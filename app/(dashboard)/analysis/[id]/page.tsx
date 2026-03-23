"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { use } from "react";
import { useTranslations } from "next-intl";
import {
  ArrowLeft,
  BarChart2,
  TrendingUp,
  AlertTriangle,
  Target,
  Sparkles,
  ChevronRight,
  Map,
  Loader2,
} from "lucide-react";
import { TopNav } from "@/components/layout/top-nav";
import { MetricCard } from "@/components/cards/metric-card";
import { InsightCard } from "@/components/cards/insight-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  MarketAnalysisModal,
  CompetitionModal,
  AIInsightModal,
} from "@/components/modals/analysis-modals";
import { createClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export default function AnalysisDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const t = useTranslations("analysis");
  const tCommon = useTranslations("common");
  const [startup, setStartup] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [showMarketModal, setShowMarketModal] = useState(false);
  const [showCompetitionModal, setShowCompetitionModal] = useState(false);
  const [showAIInsightModal, setShowAIInsightModal] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    const supabase = createClient();
    setLoading(true);

    const { data: startupData } = await supabase
      .from("startups")
      .select("*")
      .eq("id", id)
      .single();

    if (!startupData) {
      setError(t("notFound"));
      setLoading(false);
      return;
    }

    setStartup(startupData);

    const { data: existingAnalysis } = await supabase
      .from("analyses")
      .select("*")
      .eq("startup_id", id)
      .single();

    if (existingAnalysis) {
      setAnalysis(existingAnalysis);
      setLoading(false);
    } else {
      setLoading(false);
      await generateAnalysis();
    }
  };

  const generateAnalysis = async () => {
    setGenerating(true);
    setError("");
    setAnalysis(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startup_id: id, force: true }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error);
      } else {
        setAnalysis(data.analysis);
      }
    } catch (err) {
      setError(tCommon("error"));
    } finally {
      setGenerating(false);
    }
  };

  const competitionColor = {
    Low: "bg-emerald/10 text-emerald border-emerald/20",
    Medium: "bg-amber/10 text-amber border-amber/20",
    High: "bg-destructive/10 text-destructive border-destructive/20",
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <TopNav />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground text-lg">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (generating) {
    return (
      <div className="min-h-screen">
        <TopNav />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground text-lg">{t("generating")}</p>
          <p className="text-sm text-muted-foreground">{t("generatingWait")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <TopNav />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <p className="text-destructive">{error}</p>
          <Button onClick={generateAnalysis}>{tCommon("retry")}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <TopNav />

      <main className="p-4 md:p-6 lg:p-8">
        <div className="mb-6">
          <Link
            href="/analysis"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            {t("backToAnalysis")}
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">
                  {startup?.name}
                </h1>
                <Badge
                  variant="outline"
                  className="bg-indigo/10 text-indigo border-indigo/20"
                >
                  {startup?.stage}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1">
                {startup?.description}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={generateAnalysis}
                disabled={generating}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {t("reanalyze")}
              </Button>
              <Link href={`/roadmap/${id}`}>
                <Button>
                  <Map className="w-4 h-4 mr-2" />
                  {t("roadmap")}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Score Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">
                    {t("startupScore")}
                  </p>
                  <p className="text-2xl font-bold tracking-tight">
                    {analysis?.score}/10
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-secondary text-foreground">
                  <BarChart2 className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          <MetricCard
            title={t("marketScore")}
            value={`${analysis?.market_score}/10`}
            icon={TrendingUp}
            variant="accent"
          />
          <MetricCard
            title={t("competition")}
            value={`${analysis?.competition_score}/10`}
            icon={AlertTriangle}
            variant="warning"
          />
          <MetricCard
            title={t("growthPotential")}
            value={`${analysis?.growth_potential}%`}
            icon={Target}
            variant="success"
          />
        </div>

        {/* AI Summary */}
        <div className="mb-8">
          <InsightCard
            title={t("aiInsight")}
            content={analysis?.summary || ""}
            type="ai"
            onClick={() => setShowAIInsightModal(true)}
          />
        </div>

        {/* Market & Competition */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card
            className="cursor-pointer hover:shadow-md hover:border-primary/20 transition-all"
            onClick={() => setShowMarketModal(true)}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald" />
                {t("marketAnalysis")}
              </CardTitle>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    {t("marketSize")}
                  </div>
                  <div className="font-semibold text-sm leading-tight">
                    {analysis?.market_size_estimate}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    {t("growthRate")}
                  </div>
                  <div className="font-semibold text-sm text-emerald">
                    {analysis?.market_growth_rate}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    {t("score")}
                  </div>
                  <div className="font-semibold text-sm">
                    {analysis?.market_score}/10
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {analysis?.target_segment}
              </p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md hover:border-primary/20 transition-all"
            onClick={() => setShowCompetitionModal(true)}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber" />
                {t("competitionAnalysis")}
              </CardTitle>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-3">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    {t("competitionLevel")}
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn(
                      competitionColor[
                        analysis?.competition_level as keyof typeof competitionColor
                      ] || ""
                    )}
                  >
                    {analysis?.competition_level}
                  </Badge>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground mb-1">
                    {t("marketPosition")}
                  </div>
                  <Progress
                    value={analysis?.competition_score * 10}
                    className="h-2"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {analysis?.competitors?.length || 0}{" "}
                {t("competitorsIdentified")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* SWOT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-emerald">
                💪 {t("strengths")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis?.strengths?.map((s: string, i: number) => (
                  <li
                    key={i}
                    className="text-sm text-muted-foreground flex items-start gap-2"
                  >
                    <span className="text-emerald mt-0.5 shrink-0">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-amber">
                ⚠️ {t("weaknesses")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis?.weaknesses?.map((w: string, i: number) => (
                  <li
                    key={i}
                    className="text-sm text-muted-foreground flex items-start gap-2"
                  >
                    <span className="text-amber mt-0.5 shrink-0">•</span>
                    {w}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-indigo">
                🚀 {t("opportunities")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis?.opportunities?.map((o: string, i: number) => (
                  <li
                    key={i}
                    className="text-sm text-muted-foreground flex items-start gap-2"
                  >
                    <span className="text-indigo mt-0.5 shrink-0">•</span>
                    {o}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              {t("recommendations")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {analysis?.recommendations?.map((rec: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-sm text-foreground">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </main>

      <MarketAnalysisModal
        open={showMarketModal}
        onOpenChange={setShowMarketModal}
        analysis={analysis}
      />
      <CompetitionModal
        open={showCompetitionModal}
        onOpenChange={setShowCompetitionModal}
        analysis={analysis}
      />
      <AIInsightModal
        open={showAIInsightModal}
        onOpenChange={setShowAIInsightModal}
        analysis={analysis}
      />
    </div>
  );
}
