"use client";

import { useState, useEffect } from "react";
import { Plus, Map } from "lucide-react";
import { TopNav } from "@/components/layout/top-nav";
import { StartupCard, type StartupData } from "@/components/cards/startup-card";
import { AddStartupModal } from "@/components/modals/add-startup-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase";

export default function RoadmapPage() {
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

    // Startup'ları çek
    const { data: startupsData } = await supabase
      .from("startups")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!startupsData) {
      setLoading(false);
      return;
    }

    // Her startup için roadmap task sayılarını çek
    const mapped: StartupData[] = await Promise.all(
      startupsData.map(async (s) => {
        const { data: roadmap } = await supabase
          .from("roadmaps")
          .select("id")
          .eq("startup_id", s.id)
          .single();

        let tasksCompleted = 0;
        let totalTasks = 0;

        if (roadmap) {
          const { data: tasks } = await supabase
            .from("roadmap_tasks")
            .select("status")
            .eq("roadmap_id", roadmap.id);

          totalTasks = tasks?.length || 0;
          tasksCompleted =
            tasks?.filter((t) => t.status === "done").length || 0;
        }

        return {
          id: s.id,
          name: s.name,
          description: s.description,
          stage: s.stage as StartupData["stage"],
          users: s.users_count,
          revenue: s.revenue,
          growth: s.growth_rate,
          tasksCompleted,
          totalTasks,
        };
      })
    );

    setStartups(mapped);
    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      <TopNav
        primaryAction={{
          label: "Start AI Roadmap",
          onClick: () => setShowAddStartup(true),
        }}
      />

      <main className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            Growth Roadmaps
          </h1>
          <p className="text-muted-foreground">
            Select a startup to view and manage its roadmap
          </p>
        </div>

        {/* Startups Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-5 h-48" />
              </Card>
            ))}
          </div>
        ) : startups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {startups.map((startup) => (
              <StartupCard
                key={startup.id}
                startup={startup}
                href={`/roadmap/${startup.id}`}
                showMetrics
                showProgress
              />
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="p-3 rounded-full bg-primary/10 mb-4">
                <Map className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">
                No roadmaps yet
              </h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Add a startup and generate an AI-powered growth roadmap
              </p>
              <Button onClick={() => setShowAddStartup(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Start AI Roadmap
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
