"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase";
import { getPlanLimits, type PlanType } from "@/lib/plans";

interface AddStartupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
}

export interface StartupFormData {
  businessName: string;
  industry: string;
  description: string;
  mainGoal: string;
  targetCustomer: string;
  targetAudience: string;
  marketSize: string;
  customerProblem: string;
  users?: number;
  revenue?: number;
  monthlySales?: number;
  traffic?: number;
  conversionRate?: number;
}

const industries = [
  "SaaS",
  "E-commerce",
  "FinTech",
  "HealthTech",
  "EdTech",
  "AI/ML",
  "Consumer Apps",
  "Marketplace",
  "Hardware",
  "Other",
];

export function AddStartupModal({
  open,
  onOpenChange,
  onComplete,
}: AddStartupModalProps) {
  const router = useRouter();
  const t = useTranslations("addStartup");
  const tCommon = useTranslations("common");
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<StartupFormData>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const steps = [
    { id: 1, title: t("businessInfo") },
    { id: 2, title: t("marketInfo") },
    { id: 3, title: t("metricsStep") },
  ];

  const updateField = (
    field: keyof StartupFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = async () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      setLoading(true);
      setError("");

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError(t("sessionNotFound"));
        setLoading(false);
        return;
      }

      // Plan ve startup sayısını kontrol et
      const { data: profile } = await supabase
        .from("profiles")
        .select("plan")
        .eq("id", user.id)
        .single();

      const plan = (profile?.plan ?? "free") as PlanType;
      const limits = getPlanLimits(plan);

      if (limits.maxStartups !== Infinity) {
        const { count } = await supabase
          .from("startups")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id);

        if (count !== null && count >= limits.maxStartups) {
          setError(
            plan === "free"
              ? `Free plan allows maximum ${limits.maxStartups} startups. Please upgrade to Pro.`
              : `You have reached the maximum number of startups for your plan.`
          );
          setLoading(false);
          return;
        }
      }

      const { data: savedStartup, error: insertError } = await supabase
        .from("startups")
        .insert({
          user_id: user.id,
          name: formData.businessName,
          description: formData.description,
          industry: formData.industry,
          stage: "Idea",
          main_goal: formData.mainGoal,
          target_audience: formData.targetAudience || formData.targetCustomer,
          main_problem: formData.customerProblem,
          market_size: formData.marketSize,
          users_count: formData.users || 0,
          revenue: formData.revenue || 0,
          growth_rate: 0,
        })
        .select()
        .single();

      if (insertError || !savedStartup) {
        setError(insertError?.message || tCommon("error"));
        setLoading(false);
        return;
      }

      onComplete?.();
      onOpenChange(false);
      setCurrentStep(1);
      setFormData({});
      setLoading(false);
      router.push(`/analysis/${savedStartup.id}`);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceed = () => {
    if (currentStep === 1)
      return formData.businessName && formData.industry && formData.description;
    if (currentStep === 2)
      return formData.targetAudience && formData.customerProblem;
    return true;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{t("title")}</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    currentStep > step.id
                      ? "bg-primary text-primary-foreground"
                      : currentStep === step.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  {currentStep > step.id ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    step.id
                  )}
                </div>
                <span className="text-xs mt-1.5 text-muted-foreground hidden sm:block">
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-12 sm:w-20 h-0.5 mx-2",
                    currentStep > step.id ? "bg-primary" : "bg-secondary"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">
            {error}
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">{t("businessName")} *</Label>
              <Input
                id="businessName"
                value={formData.businessName || ""}
                onChange={(e) => updateField("businessName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">{t("industry")} *</Label>
              <Select
                value={formData.industry}
                onValueChange={(value) => updateField("industry", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{t("description")} *</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => updateField("description", e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mainGoal">{t("mainGoal")}</Label>
              <Input
                id="mainGoal"
                value={formData.mainGoal || ""}
                onChange={(e) => updateField("mainGoal", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetCustomer">{t("targetCustomer")}</Label>
              <Input
                id="targetCustomer"
                value={formData.targetCustomer || ""}
                onChange={(e) => updateField("targetCustomer", e.target.value)}
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="targetAudience">{t("targetAudience")} *</Label>
              <Textarea
                id="targetAudience"
                value={formData.targetAudience || ""}
                onChange={(e) => updateField("targetAudience", e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="marketSize">{t("marketSize")}</Label>
              <Select
                value={formData.marketSize}
                onValueChange={(value) => updateField("marketSize", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (&lt;$1B)</SelectItem>
                  <SelectItem value="medium">Medium ($1B-$10B)</SelectItem>
                  <SelectItem value="large">Large ($10B-$100B)</SelectItem>
                  <SelectItem value="massive">Massive (&gt;$100B)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerProblem">{t("customerProblem")} *</Label>
              <Textarea
                id="customerProblem"
                value={formData.customerProblem || ""}
                onChange={(e) => updateField("customerProblem", e.target.value)}
                rows={3}
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="users">{t("currentUsers")}</Label>
                <Input
                  id="users"
                  type="number"
                  placeholder="0"
                  value={formData.users || ""}
                  onChange={(e) =>
                    updateField("users", parseInt(e.target.value) || 0)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="revenue">{t("monthlyRevenue")}</Label>
                <Input
                  id="revenue"
                  type="number"
                  placeholder="0"
                  value={formData.revenue || ""}
                  onChange={(e) =>
                    updateField("revenue", parseInt(e.target.value) || 0)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlySales">Monthly Sales</Label>
                <Input
                  id="monthlySales"
                  type="number"
                  placeholder="0"
                  value={formData.monthlySales || ""}
                  onChange={(e) =>
                    updateField("monthlySales", parseInt(e.target.value) || 0)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="traffic">Monthly Traffic</Label>
                <Input
                  id="traffic"
                  type="number"
                  placeholder="0"
                  value={formData.traffic || ""}
                  onChange={(e) =>
                    updateField("traffic", parseInt(e.target.value) || 0)
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="conversionRate">Conversion Rate (%)</Label>
              <Input
                id="conversionRate"
                type="number"
                step="0.1"
                placeholder="0"
                value={formData.conversionRate || ""}
                onChange={(e) =>
                  updateField("conversionRate", parseFloat(e.target.value) || 0)
                }
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {tCommon("back")}
          </Button>
          <Button onClick={handleNext} disabled={!canProceed() || loading}>
            {loading
              ? tCommon("saving")
              : currentStep === 3
              ? t("createStartup")
              : tCommon("next")}
            {currentStep < 3 && <ChevronRight className="w-4 h-4 ml-1" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
