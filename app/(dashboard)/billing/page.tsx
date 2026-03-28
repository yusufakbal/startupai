"use client";

import { useState, useEffect } from "react";
import { CreditCard, Check, Zap, Rocket, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { TopNav } from "@/components/layout/top-nav";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase";
import { getPlanLimits, type PlanType } from "@/lib/plans";

export default function BillingPage() {
  const t = useTranslations("billing");
  const tUpgrade = useTranslations("upgrade");
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [startupCount, setStartupCount] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const { count } = await supabase
      .from("startups")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);

    setProfile(profileData);
    setStartupCount(count || 0);
    setLoading(false);
  };

  const handleUpgrade = async () => {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handlePortal = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (error) {
      console.error("Portal error:", error);
    } finally {
      setPortalLoading(false);
    }
  };

  const plan = (profile?.plan ?? "free") as PlanType;
  const limits = getPlanLimits(plan);
  const isPro = plan === "pro";

  const analysesUsed = profile?.analyses_used_this_month ?? 0;
  const roadmapsUsed = profile?.roadmaps_used_this_month ?? 0;

  const plans = [
    {
      key: "free",
      name: "Free",
      price: 0,
      description: "Perfect for exploring the platform",
      features: [
        "2 Startup projects",
        "4 AI analyses/month",
        "2 Roadmaps/month",
        "Basic features",
      ],
    },
    {
      key: "pro",
      name: "Pro",
      price: 9.99,
      description: "For serious entrepreneurs",
      popular: true,
      features: [
        tUpgrade("proFeature1"),
        tUpgrade("proFeature2"),
        tUpgrade("proFeature3"),
        tUpgrade("proFeature4"),
      ],
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen">
        <TopNav />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <TopNav />

      <main className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>

        {/* Current Plan */}
        <Card className="mb-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold">
                      {isPro ? "Pro Plan" : "Free Plan"}
                    </h2>
                    <Badge className="bg-primary text-primary-foreground">
                      {t("currentPlan")}
                    </Badge>
                  </div>
                  {isPro && profile?.subscription_period_end && (
                    <p className="text-muted-foreground text-sm">
                      $9.99/month · Renews on{" "}
                      {new Date(
                        profile.subscription_period_end
                      ).toLocaleDateString()}
                    </p>
                  )}
                  {!isPro && (
                    <p className="text-muted-foreground text-sm">
                      {t("freePlanDesc")}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                {isPro ? (
                  <Button
                    variant="outline"
                    onClick={handlePortal}
                    disabled={portalLoading}
                  >
                    {portalLoading && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    Manage Billing
                  </Button>
                ) : (
                  <Button onClick={handleUpgrade} disabled={checkoutLoading}>
                    {checkoutLoading && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    {t("upgradePro")}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Usage This Month</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">
                    Startups
                  </span>
                  <Rocket className="w-4 h-4 text-primary" />
                </div>
                {limits.maxStartups === Infinity ? (
                  <div className="text-2xl font-bold mb-2">
                    {startupCount}
                    <span className="text-sm font-normal text-muted-foreground ml-1">
                      / Unlimited
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold mb-2">
                      {startupCount}/{limits.maxStartups}
                    </div>
                    <Progress
                      value={(startupCount / limits.maxStartups) * 100}
                      className="h-2"
                    />
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">
                    AI Analyses
                  </span>
                  <Zap className="w-4 h-4 text-emerald" />
                </div>
                {limits.maxAnalysesPerMonth === Infinity ? (
                  <div className="text-2xl font-bold mb-2">
                    {analysesUsed}
                    <span className="text-sm font-normal text-muted-foreground ml-1">
                      / Unlimited
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold mb-2">
                      {analysesUsed}/{limits.maxAnalysesPerMonth}
                    </div>
                    <Progress
                      value={(analysesUsed / limits.maxAnalysesPerMonth) * 100}
                      className="h-2"
                    />
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">
                    Roadmaps
                  </span>
                  <CreditCard className="w-4 h-4 text-indigo" />
                </div>
                {limits.maxRoadmapsPerMonth === Infinity ? (
                  <div className="text-2xl font-bold mb-2">
                    {roadmapsUsed}
                    <span className="text-sm font-normal text-muted-foreground ml-1">
                      / Unlimited
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold mb-2">
                      {roadmapsUsed}/{limits.maxRoadmapsPerMonth}
                    </div>
                    <Progress
                      value={(roadmapsUsed / limits.maxRoadmapsPerMonth) * 100}
                      className="h-2"
                    />
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Plans */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((p) => {
              const isCurrent = plan === p.key;
              return (
                <Card
                  key={p.key}
                  className={cn(
                    "relative",
                    isCurrent && "border-primary shadow-lg",
                    p.popular && "ring-1 ring-primary"
                  )}
                >
                  {p.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {p.name}
                      {isCurrent && (
                        <Badge variant="outline">{t("currentPlan")}</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>{p.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <span className="text-4xl font-bold">${p.price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <ul className="space-y-3">
                      {p.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2 text-sm"
                        >
                          <Check className="w-4 h-4 text-emerald shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    {isCurrent ? (
                      <Button className="w-full" variant="outline" disabled>
                        {t("currentPlan")}
                      </Button>
                    ) : p.key === "pro" ? (
                      <Button
                        className="w-full"
                        onClick={handleUpgrade}
                        disabled={checkoutLoading}
                      >
                        {checkoutLoading && (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        )}
                        {t("upgradePro")}
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={handlePortal}
                        disabled={portalLoading}
                      >
                        Downgrade
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
