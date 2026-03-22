"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Users,
  Target,
  Zap,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface AnalysisModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  analysis: any;
}

export function MarketAnalysisModal({
  open,
  onOpenChange,
  analysis,
}: AnalysisModalProps) {
  const t = useTranslations("analysis");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{t("marketAnalysis")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald" />
                {t("marketAnalysis")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-secondary/50 rounded-lg">
                  <div className="text-lg font-bold text-foreground">
                    {analysis?.market_size_estimate}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("marketSize")}
                  </div>
                </div>
                <div className="text-center p-3 bg-secondary/50 rounded-lg">
                  <div className="text-lg font-bold text-emerald">
                    {analysis?.market_growth_rate}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("growthRate")}
                  </div>
                </div>
                <div className="text-center p-3 bg-secondary/50 rounded-lg">
                  <div className="text-lg font-bold text-indigo">
                    {analysis?.market_score}/10
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("score")}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo" />
                {t("targetSegment")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {analysis?.target_segment}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald" />
                {t("growthPotential")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">
                    {t("growthPotential")}
                  </span>
                  <span className="font-medium text-emerald">
                    {analysis?.growth_potential}%
                  </span>
                </div>
                <Progress value={analysis?.growth_potential} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {analysis?.market_drivers?.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber" />
                  {t("marketDrivers")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.market_drivers.map((driver: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald shrink-0 mt-0.5" />
                      <span>{driver}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function CompetitionModal({
  open,
  onOpenChange,
  analysis,
}: AnalysisModalProps) {
  const t = useTranslations("analysis");

  const competitionColor = {
    Low: "text-emerald",
    Medium: "text-amber",
    High: "text-destructive",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {t("competitionAnalysis")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                {t("competitionLevel")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "text-3xl font-bold",
                    competitionColor[
                      analysis?.competition_level as keyof typeof competitionColor
                    ]
                  )}
                >
                  {analysis?.competition_level}
                </div>
                <div className="text-sm text-muted-foreground flex-1">
                  {t("competitionScore")}: {analysis?.competition_score}/10
                </div>
              </div>
              <Progress
                value={analysis?.competition_score * 10}
                className="h-2"
              />
            </CardContent>
          </Card>

          {analysis?.competitors?.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  {t("topCompetitors")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="text-sm" style={{ minWidth: "600px" }}>
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground whitespace-nowrap">
                          {t("competitor")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground whitespace-nowrap">
                          {t("strength")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground whitespace-nowrap">
                          {t("weakness")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground whitespace-nowrap">
                          {t("position")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.competitors.map((c: any, i: number) => (
                        <tr key={i} className="border-b last:border-0">
                          <td className="py-3 px-4 font-medium whitespace-nowrap">
                            {c.name}
                          </td>
                          <td className="py-3 px-4 text-emerald max-w-[200px]">
                            {c.strength}
                          </td>
                          <td className="py-3 px-4 text-destructive max-w-[200px]">
                            {c.weakness}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <Badge variant="secondary">{c.position}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {analysis?.opportunities?.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber" />
                  {t("opportunities")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.opportunities.map((opp: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{opp}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function AIInsightModal({
  open,
  onOpenChange,
  analysis,
}: AnalysisModalProps) {
  const t = useTranslations("analysis");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{t("aiInsight")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="border-l-4 border-l-violet">
            <CardContent className="pt-6">
              <p className="text-sm leading-relaxed">{analysis?.summary}</p>
            </CardContent>
          </Card>

          {analysis?.key_risks?.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  {t("keyRisks")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.key_risks.map((risk: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 shrink-0" />
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {analysis?.opportunities?.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-emerald" />
                  {t("opportunities")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.opportunities.map((opp: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald mt-2 shrink-0" />
                      <span>{opp}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {analysis?.recommendations?.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  {t("recommendations")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {analysis.recommendations.map((rec: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium shrink-0">
                        {i + 1}
                      </span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
