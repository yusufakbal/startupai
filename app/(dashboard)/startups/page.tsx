"use client";

import { useState, useEffect } from "react";
import { Plus, Rocket, Filter, Grid, List } from "lucide-react";
import { useTranslations } from "next-intl";
import { TopNav } from "@/components/layout/top-nav";
import { StartupCard, type StartupData } from "@/components/cards/startup-card";
import { AddStartupModal } from "@/components/modals/add-startup-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase";

export default function StartupsPage() {
  const t = useTranslations("startups");
  const tDashboard = useTranslations("dashboard");
  const [showAddStartup, setShowAddStartup] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [startups, setStartups] = useState<StartupData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStartups();
  }, []);

  const loadStartups = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("startups")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) {
      setStartups(
        data.map((s) => ({
          id: s.id,
          name: s.name,
          description: s.description,
          stage: s.stage as StartupData["stage"],
          users: s.users_count,
          revenue: s.revenue,
          growth: s.growth_rate,
        }))
      );
    }
    setLoading(false);
  };

  const filteredStartups =
    stageFilter === "all"
      ? startups
      : startups.filter((s) => s.stage === stageFilter);

  return (
    <div className="min-h-screen">
      <TopNav
        primaryAction={{
          label: t("addStartup"),
          onClick: () => setShowAddStartup(true),
        }}
      />

      <main className="p-4 md:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
            <p className="text-muted-foreground">{t("subtitle")}</p>
          </div>

          <div className="flex items-center gap-3">
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder={t("filterBy")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allStages")}</SelectItem>
                <SelectItem value="Idea">Idea</SelectItem>
                <SelectItem value="Validation">Validation</SelectItem>
                <SelectItem value="Traction">Traction</SelectItem>
                <SelectItem value="Growth">Growth</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center border rounded-lg p-1">
              <Button
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8", viewMode === "grid" && "bg-secondary")}
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8", viewMode === "list" && "bg-secondary")}
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-5 h-40" />
              </Card>
            ))}
          </div>
        ) : filteredStartups.length > 0 ? (
          <div
            className={cn(
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                : "space-y-4"
            )}
          >
            {filteredStartups.map((startup) => (
              <StartupCard
                key={startup.id}
                startup={startup}
                href={`/analysis/${startup.id}`}
                showMetrics={viewMode === "grid"}
                showScores={viewMode === "list"}
              />
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="p-3 rounded-full bg-primary/10 mb-4">
                <Rocket className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">
                {t("noStartupsYet")}
              </h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                {stageFilter !== "all"
                  ? `No startups in the ${stageFilter} stage`
                  : t("addFirstStartup")}
              </p>
              <Button onClick={() => setShowAddStartup(true)}>
                <Plus className="w-4 h-4 mr-2" />
                {t("addStartup")}
              </Button>
            </CardContent>
          </Card>
        )}

        {startups.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-foreground">
                  {startups.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t("totalStartups")}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-emerald">
                  {startups.filter((s) => s.stage === "Growth").length}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t("inGrowth")}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-indigo">
                  {startups.length > 0
                    ? (
                        startups.reduce((acc, s) => acc + (s.revenue || 0), 0) /
                        1000
                      ).toFixed(0)
                    : 0}
                  K
                </div>
                <div className="text-sm text-muted-foreground">
                  {t("revenue")}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-foreground">
                  {startups.filter((s) => s.stage === "Idea").length}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t("inIdeaStage")}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <AddStartupModal
        open={showAddStartup}
        onOpenChange={setShowAddStartup}
        onComplete={loadStartups}
      />
    </div>
  );
}
