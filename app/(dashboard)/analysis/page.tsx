"use client";

import { useState, useEffect } from "react";
import { Plus, BarChart2 } from "lucide-react";
import { TopNav } from "@/components/layout/top-nav";
import { StartupCard, type StartupData } from "@/components/cards/startup-card";
import { AddStartupModal } from "@/components/modals/add-startup-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase";

export default function AnalysisPage() {
  const [showAddStartup, setShowAddStartup] = useState(false);
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

    // Startup ve analiz verilerini birlikte çek
    const { data: startupsData } = await supabase
      .from("startups")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!startupsData) {
      setLoading(false);
      return;
    }

    // Analizleri çek
    const { data: analysesData } = await supabase
      .from("analyses")
      .select(
        "startup_id, score, market_score, competition_level, growth_potential"
      )
      .eq("user_id", user.id);

    // Startup ve analiz verilerini birleştir
    const mapped: StartupData[] = startupsData.map((s) => {
      const analysis = analysesData?.find((a) => a.startup_id === s.id);
      return {
        id: s.id,
        name: s.name,
        description: s.description,
        stage: s.stage as StartupData["stage"],
        score: analysis?.score,
        marketScore: analysis?.market_score,
        competitionLevel:
          analysis?.competition_level as StartupData["competitionLevel"],
        growthPotential: analysis?.growth_potential,
      };
    });

    setStartups(mapped);
    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      <TopNav
        primaryAction={{
          label: "Add Startup",
          onClick: () => setShowAddStartup(true),
        }}
      />

      <main className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            Startup Analysis
          </h1>
          <p className="text-muted-foreground">
            Select a startup to view detailed analysis
          </p>
        </div>

        {/* Startups Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-5 h-40" />
              </Card>
            ))}
          </div>
        ) : startups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {startups.map((startup) => (
              <StartupCard
                key={startup.id}
                startup={startup}
                href={`/analysis/${startup.id}`}
                showMetrics={false}
                showScores
              />
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="p-3 rounded-full bg-primary/10 mb-4">
                <BarChart2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">
                No startups to analyze
              </h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Add a startup to get AI-powered analysis
              </p>
              <Button onClick={() => setShowAddStartup(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Startup
              </Button>
            </CardContent>
          </Card>
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
