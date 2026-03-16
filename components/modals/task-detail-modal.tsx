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
import { cn } from "@/lib/utils";

export interface TaskData {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  phase: number;
  steps?: string[];
  tools?: { category: string; items: string[] }[];
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

function getToolUrl(toolName: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(
    toolName + " tool"
  )}`;
}

export function TaskDetailModal({
  open,
  onOpenChange,
  task,
}: TaskDetailModalProps) {
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
          {/* Task Description */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Task Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {task.description}
              </p>
            </CardContent>
          </Card>

          {/* How to Execute */}
          {task.steps && task.steps.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <ListOrdered className="w-4 h-4 text-primary" />
                  How to Execute
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

          {/* Recommended Tools */}
          {task.tools && task.tools.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-indigo" />
                  Recommended Tools
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
                        {toolGroup.items.map((tool: string) => (
                          <Badge
                            key={tool}
                            variant="secondary"
                            className="cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors"
                            onClick={() =>
                              window.open(getToolUrl(tool), "_blank")
                            }
                          >
                            {tool}
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Estimated Impact */}
          {task.impact && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-emerald" />
                  Estimated Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {task.impact.userGrowth !== undefined && (
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">
                        Expected User Growth
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
                        Conversion Improvement
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

          {/* Difficulty Level */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Gauge className="w-4 h-4 text-amber" />
                Difficulty Assessment
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
                  {task.difficulty === "Easy" &&
                    "Quick win - can be completed in a few hours"}
                  {task.difficulty === "Medium" &&
                    "Moderate effort - 1-3 days of focused work"}
                  {task.difficulty === "Hard" &&
                    "Significant investment - 1+ weeks required"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
