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
  Wrench,
  ListOrdered,
  BarChart2,
  Gauge,
  ExternalLink,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export interface ToolItem {
  name: string;
  url: string;
}

export interface TaskData {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  phase: number;
  steps?: string[];
  tools?: { category: string; items: ToolItem[] | string[] }[];
  impact?: {
    userGrowth?: number;
    conversion?: number;
  };
  difficulty: "Easy" | "Medium" | "Hard";
}

interface TaskDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: TaskData | null;
}

const difficultyColors = {
  Easy: "bg-emerald/10 text-emerald border-emerald/20",
  Medium: "bg-amber/10 text-amber border-amber/20",
  Hard: "bg-destructive/10 text-destructive border-destructive/20",
};

export function TaskDetailModal({
  open,
  onOpenChange,
  task,
}: TaskDetailModalProps) {
  const t = useTranslations("taskDetail");

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-xl">{task.title}</DialogTitle>
            <Badge
              variant="outline"
              className={cn(difficultyColors[task.difficulty])}
            >
              {task.difficulty}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                {t("taskDescription")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {task.description}
              </p>
            </CardContent>
          </Card>

          {task.steps && task.steps.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <ListOrdered className="w-4 h-4 text-primary" />
                  {t("howToExecute")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {task.steps.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-sm">{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          )}

          {task.tools && task.tools.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-indigo" />
                  {t("recommendedTools")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {task.tools.map((toolGroup) => (
                    <div key={toolGroup.category}>
                      <div className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
                        {toolGroup.category}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {toolGroup.items.map((tool) => {
                          const toolName =
                            typeof tool === "string" ? tool : tool.name;
                          const toolUrl =
                            typeof tool === "string"
                              ? `https://www.google.com/search?q=${encodeURIComponent(
                                  tool + " tool"
                                )}`
                              : tool.url;

                          return (
                            <Badge
                              key={toolName}
                              variant="secondary"
                              className="cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors"
                              onClick={() => window.open(toolUrl, "_blank")}
                            >
                              {toolName}
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {task.impact && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-emerald" />
                  {t("estimatedImpact")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {task.impact.userGrowth !== undefined && (
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">
                        {t("userGrowth")}
                      </span>
                      <span className="font-medium text-emerald">
                        +{task.impact.userGrowth}%
                      </span>
                    </div>
                    <Progress value={task.impact.userGrowth} className="h-2" />
                  </div>
                )}
                {task.impact.conversion !== undefined && (
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">
                        {t("conversion")}
                      </span>
                      <span className="font-medium text-emerald">
                        +{task.impact.conversion}%
                      </span>
                    </div>
                    <Progress value={task.impact.conversion} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Gauge className="w-4 h-4 text-amber" />
                {t("difficultyAssessment")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                  {[1, 2, 3].map((level) => (
                    <div
                      key={level}
                      className={cn(
                        "w-8 h-2 rounded-full",
                        task.difficulty === "Easy" &&
                          level === 1 &&
                          "bg-emerald",
                        task.difficulty === "Medium" &&
                          level <= 2 &&
                          "bg-amber",
                        task.difficulty === "Hard" && "bg-destructive",
                        !(
                          (task.difficulty === "Easy" && level === 1) ||
                          (task.difficulty === "Medium" && level <= 2) ||
                          task.difficulty === "Hard"
                        ) && "bg-secondary"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {task.difficulty === "Easy" && t("easyDesc")}
                  {task.difficulty === "Medium" && t("mediumDesc")}
                  {task.difficulty === "Hard" && t("hardDesc")}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
