"use client";

import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  BarChart2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface StartupData {
  id: string;
  name: string;
  description?: string;
  stage: "Idea" | "Validation" | "Traction" | "Growth";
  score?: number;
  marketScore?: number;
  competitionLevel?: "Low" | "Medium" | "High";
  growthPotential?: number;
  users?: number;
  revenue?: number;
  growth?: number;
  tasksCompleted?: number;
  totalTasks?: number;
}

interface StartupCardProps {
  startup: StartupData;
  href: string;
  showMetrics?: boolean;
  showScores?: boolean;
  showProgress?: boolean;
}

const stageColors = {
  Idea: "bg-violet/10 text-violet border-violet/20",
  Validation: "bg-amber/10 text-amber border-amber/20",
  Traction: "bg-indigo/10 text-indigo border-indigo/20",
  Growth: "bg-emerald/10 text-emerald border-emerald/20",
};

const competitionColors = {
  Low: "text-emerald",
  Medium: "text-amber",
  High: "text-destructive",
};

export function StartupCard({
  startup,
  href,
  showMetrics = true,
  showScores = false,
  showProgress = false,
}: StartupCardProps) {
  const t = useTranslations("startups");
  const tAnalysis = useTranslations("analysis");

  return (
    <Link href={href}>
      <Card className="group h-full hover:shadow-lg hover:border-primary/20 transition-all duration-200 cursor-pointer">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                {startup.name}
              </h3>
              {startup.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {startup.description}
                </p>
              )}
            </div>
            <Badge
              variant="outline"
              className={cn("shrink-0 text-xs", stageColors[startup.stage])}
            >
              {startup.stage}
            </Badge>
          </div>

          {showScores && startup.score !== undefined && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-secondary/50 rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <BarChart2 className="w-3.5 h-3.5" />
                  {tAnalysis("startupScore")}
                </div>
                <div className="text-lg font-bold text-indigo">
                  {startup.score}/10
                </div>
              </div>
              {startup.marketScore !== undefined && (
                <div className="bg-secondary/50 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {tAnalysis("marketScore")}
                  </div>
                  <div className="text-lg font-bold text-emerald">
                    {startup.marketScore}/10
                  </div>
                </div>
              )}
            </div>
          )}

          {showScores && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                {startup.competitionLevel && (
                  <span className="text-muted-foreground">
                    {tAnalysis("competition")}:{" "}
                    <span
                      className={cn(
                        "font-medium",
                        competitionColors[startup.competitionLevel]
                      )}
                    >
                      {startup.competitionLevel}
                    </span>
                  </span>
                )}
              </div>
              {startup.growthPotential !== undefined && (
                <div className="flex items-center gap-1 text-emerald">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-medium">
                    {startup.growthPotential}%
                  </span>
                </div>
              )}
            </div>
          )}

          {showMetrics && (
            <div className="grid grid-cols-3 gap-2">
              {startup.users !== undefined && (
                <div className="text-center p-2 bg-secondary/50 rounded-lg">
                  <Users className="w-4 h-4 mx-auto text-indigo mb-1" />
                  <div className="text-sm font-semibold">
                    {formatNumber(startup.users)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("users")}
                  </div>
                </div>
              )}
              {startup.revenue !== undefined && (
                <div className="text-center p-2 bg-secondary/50 rounded-lg">
                  <DollarSign className="w-4 h-4 mx-auto text-emerald mb-1" />
                  <div className="text-sm font-semibold">
                    ${formatNumber(startup.revenue)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("revenue")}
                  </div>
                </div>
              )}
              {startup.growth !== undefined && (
                <div className="text-center p-2 bg-secondary/50 rounded-lg">
                  {startup.growth >= 0 ? (
                    <TrendingUp className="w-4 h-4 mx-auto text-emerald mb-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mx-auto text-destructive mb-1" />
                  )}
                  <div
                    className={cn(
                      "text-sm font-semibold",
                      startup.growth >= 0 ? "text-emerald" : "text-destructive"
                    )}
                  >
                    {startup.growth > 0 ? "+" : ""}
                    {startup.growth}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("growth")}
                  </div>
                </div>
              )}
            </div>
          )}

          {showProgress &&
            startup.tasksCompleted !== undefined &&
            startup.totalTasks !== undefined && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">
                    {t("roadmapProgress")}
                  </span>
                  <span className="font-medium">
                    {startup.tasksCompleted}/{startup.totalTasks} {t("tasks")}
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{
                      width: `${
                        startup.totalTasks > 0
                          ? (startup.tasksCompleted / startup.totalTasks) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            )}
        </CardContent>
      </Card>
    </Link>
  );
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}
