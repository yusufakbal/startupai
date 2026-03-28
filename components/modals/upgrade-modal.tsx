"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Sparkles, Check, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  limitType: "analyses" | "roadmaps" | "startups";
  limit?: number;
}

export function UpgradeModal({
  open,
  onOpenChange,
  limitType,
  limit,
}: UpgradeModalProps) {
  const t = useTranslations("upgrade");
  const [loading, setLoading] = useState(false);

  const getDescription = () => {
    const l = limit?.toString() ?? "";
    if (limitType === "analyses")
      return t("analysisLimitDesc").replace("{limit}", l);
    if (limitType === "roadmaps")
      return t("roadmapLimitDesc").replace("{limit}", l);
    return t("startupLimitDesc").replace("{limit}", l);
  };

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    t("proFeature1"),
    t("proFeature2"),
    t("proFeature3"),
    t("proFeature4"),
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="w-5 h-5 text-primary" />
            {t("limitReachedTitle")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <p className="text-sm text-muted-foreground">{getDescription()}</p>

          {/* Pro plan özellikleri */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">Pro Plan</span>
              <span className="text-primary font-bold">{t("priceLabel")}</span>
            </div>
            <ul className="space-y-2">
              {features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-emerald shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Butonlar */}
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              {t("upgradeButton")}
            </Button>
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="w-full"
            >
              {t("cancelButton")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
