"use client";

import { useState, useEffect } from "react";
import { Users, DollarSign, BarChart2, Flag, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { TopNav } from "@/components/layout/top-nav";
import { InsightCard } from "@/components/cards/insight-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const positionColors: Record<string, string> = {
  Leader: "bg-indigo/10 text-indigo border-indigo/20",
  Challenger: "bg-amber/10 text-amber border-amber/20",
  Niche: "bg-violet/10 text-violet border-violet/20",
  Follower: "bg-secondary text-secondary-foreground",
};

export default function MetricsPage() {
  const t = useTranslations("metrics");
  const [startups, setStartups] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [startup, setStartup] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [roadmap, setRoadmap] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    loadStartups();
  }, []);
  useEffect(() => {
    if (selectedId) loadDetail(selectedId);
  }, [selectedId]);

  const loadStartups = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("startups")
      .select("id, name")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data && data.length > 0) {
      setStartups(data);
      setSelectedId(data[0].id);
    }
    setLoading(false);
  };

  const loadDetail = async (startupId: string) => {
    setDetailLoading(true);
    const supabase = createClient();

    const { data: startupData } = await supabase
      .from("startups")
      .select("*")
      .eq("id", startupId)
      .single();
    const { data: analysisData } = await supabase
      .from("analyses")
      .select("*")
      .eq("startup_id", startupId)
      .single();
    const { data: roadmapData } = await supabase
      .from("roadmaps")
      .select("*")
      .eq("startup_id", startupId)
      .single();

    let tasksData: any[] = [];
    if (roadmapData) {
      const { data: td } = await supabase
        .from("roadmap_tasks")
        .select("status")
        .eq("roadmap_id", roadmapData.id);
      tasksData = td || [];
    }

    setStartup(startupData);
    setAnalysis(analysisData);
    setRoadmap(roadmapData);
    setTasks(tasksData);
    setDetailLoading(false);
  };

  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const totalTasks = tasks.length;

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

      <main className="p-4 md:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <Select value={selectedId} onValueChange={setSelectedId}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder={t("selectStartup")} />
            </SelectTrigger>
            <SelectContent>
              {startups.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {startup && (
            <h1 className="text-2xl font-bold text-foreground">
              {startup.name}
            </h1>
          )}
        </div>

        {detailLoading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : startup ? (
          <div className="space-y-8">
            {analysis?.summary && (
              <InsightCard
                title={t("aiInsight")}
                content={analysis.summary}
                type="ai"
              />
            )}

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-lg bg-indigo/10">
                      <Users className="w-5 h-5 text-indigo" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold">
                    {(startup.users_count || 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("users")}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-lg bg-emerald/10">
                      <DollarSign className="w-5 h-5 text-emerald" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold">
                    ${((startup.revenue || 0) / 1000).toFixed(1)}K
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("monthlyRevenue")}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-lg bg-violet/10">
                      <BarChart2 className="w-5 h-5 text-violet" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-violet">
                    {analysis?.score ?? "—"}/10
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("aiScore")}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Flag className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold">
                    {totalTasks > 0 ? `${completedTasks}/${totalTasks}` : "—"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("tasksCompleted")}
                  </div>
                </CardContent>
              </Card>
            </div>

            {roadmap?.ai_recommendation && (
              <InsightCard
                title={t("aiRecommendation")}
                content={roadmap.ai_recommendation}
                type="opportunity"
              />
            )}

            {analysis?.competitors && analysis.competitors.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">
                  {t("competitorAnalysis")}
                </h2>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {analysis.competitors.map((competitor: any, i: number) => (
                    <Card key={i} className="shrink-0 w-72">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between gap-2">
                          <CardTitle className="text-sm font-semibold line-clamp-2 leading-snug">
                            {competitor.name}
                          </CardTitle>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs shrink-0",
                              positionColors[competitor.position] ||
                                "bg-secondary"
                            )}
                          >
                            {competitor.position}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">
                            Strength
                          </div>
                          <p className="text-sm text-emerald leading-snug">
                            {competitor.strength}
                          </p>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">
                            Weakness
                          </div>
                          <p className="text-sm text-destructive leading-snug">
                            {competitor.weakness}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[40vh]">
            <p className="text-muted-foreground">{t("selectStartup")}</p>
          </div>
        )}
      </main>
    </div>
  );
}
