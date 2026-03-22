"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { use } from "react";
import { useTranslations } from "next-intl";
import {
  ArrowLeft,
  Users,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Sparkles,
  ChevronRight,
  Flag,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { TopNav } from "@/components/layout/top-nav";
import { InsightCard } from "@/components/cards/insight-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  TaskDetailModal,
  type TaskData,
} from "@/components/modals/task-detail-modal";
import { createClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const phaseStatusColors = {
  completed: "bg-emerald text-white",
  in_progress: "bg-primary text-primary-foreground",
  upcoming: "bg-secondary text-secondary-foreground",
};

const priorityColors = {
  low: "bg-secondary text-secondary-foreground",
  medium: "bg-amber/10 text-amber border-amber/20",
  high: "bg-destructive/10 text-destructive border-destructive/20",
};

const difficultyColors = {
  Easy: "bg-emerald/10 text-emerald border-emerald/20",
  Medium: "bg-amber/10 text-amber border-amber/20",
  Hard: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function RoadmapDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const t = useTranslations("roadmap");
  const tCommon = useTranslations("common");
  const tTask = useTranslations("taskDetail");
  const tStartups = useTranslations("startups");
  const [startup, setStartup] = useState<any>(null);
  const [roadmap, setRoadmap] = useState<any>(null);
  const [phases, setPhases] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showUpdateRoadmapDialog, setShowUpdateRoadmapDialog] = useState(false);
  const [showMetricsModal, setShowMetricsModal] = useState(false);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [metrics, setMetrics] = useState({
    users_count: 0,
    revenue: 0,
    growth_rate: 0,
  });

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
      setError(tCommon("error"));
      setLoading(false);
      return;
    }

    setStartup(startupData);
    setMetrics({
      users_count: startupData.users_count || 0,
      revenue: startupData.revenue || 0,
      growth_rate: startupData.growth_rate || 0,
    });

    const { data: roadmapData } = await supabase
      .from("roadmaps")
      .select("*")
      .eq("startup_id", id)
      .single();

    if (roadmapData) {
      setRoadmap(roadmapData);
      const { data: phasesData } = await supabase
        .from("roadmap_phases")
        .select("*")
        .eq("roadmap_id", roadmapData.id)
        .order("phase_number");
      const { data: tasksData } = await supabase
        .from("roadmap_tasks")
        .select("*")
        .eq("roadmap_id", roadmapData.id)
        .order("order_index");
      setPhases(phasesData || []);
      setTasks(tasksData || []);
      setLoading(false);
    } else {
      setLoading(false);
      await generateRoadmap(false);
    }
  };

  const generateRoadmap = async (force: boolean) => {
    setGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startup_id: id, force }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error);
      } else {
        setRoadmap(data.roadmap);
        setPhases(data.phases || []);
        setTasks(data.tasks || []);
      }
    } catch (err) {
      setError(tCommon("error"));
    } finally {
      setGenerating(false);
    }
  };

  const handleTaskCheck = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === "done" ? "todo" : "done";
    const supabase = createClient();
    await supabase
      .from("roadmap_tasks")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", taskId);
    const updatedTasks = tasks.map((t) =>
      t.id === taskId ? { ...t, status: newStatus } : t
    );
    setTasks(updatedTasks);
    await updatePhaseStatuses(updatedTasks);
  };

  const updatePhaseStatuses = async (updatedTasks: any[]) => {
    const supabase = createClient();
    const updatedPhases = [...phases];
    for (let i = 0; i < updatedPhases.length; i++) {
      const phase = updatedPhases[i];
      const phaseTasks = updatedTasks.filter((t) => t.phase_id === phase.id);
      const completedCount = phaseTasks.filter(
        (t) => t.status === "done"
      ).length;
      const prevPhase = i > 0 ? updatedPhases[i - 1] : null;
      let newStatus = phase.status;
      if (phaseTasks.length > 0 && completedCount === phaseTasks.length) {
        newStatus = "completed";
      } else if (
        completedCount > 0 ||
        (prevPhase && prevPhase.status === "completed") ||
        i === 0
      ) {
        newStatus = "in_progress";
      } else {
        newStatus = "upcoming";
      }
      if (newStatus !== phase.status) {
        await supabase
          .from("roadmap_phases")
          .update({ status: newStatus })
          .eq("id", phase.id);
        updatedPhases[i] = { ...phase, status: newStatus };
      }
    }
    setPhases(updatedPhases);
  };

  const handleTaskClick = (task: any) => {
    setSelectedTask({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      phase: task.phase_id,
      steps: task.steps,
      tools: task.tools,
      impact: task.impact,
      difficulty: task.difficulty,
    });
    setShowTaskModal(true);
  };

  const handleUpdateMetrics = async () => {
    setMetricsLoading(true);
    const supabase = createClient();
    await supabase
      .from("startups")
      .update({
        users_count: metrics.users_count,
        revenue: metrics.revenue,
        growth_rate: metrics.growth_rate,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
    setStartup({ ...startup, ...metrics });
    setMetricsLoading(false);
    setShowMetricsModal(false);
  };

  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const totalTasks = tasks.length;
  const nextUpTasks = tasks.filter((t) => t.status !== "done").slice(0, 3);

  if (loading)
    return (
      <div className="min-h-screen">
        <TopNav />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground text-lg">{t("loading")}</p>
        </div>
      </div>
    );

  if (generating)
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

  if (error)
    return (
      <div className="min-h-screen">
        <TopNav />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <AlertTriangle className="w-10 h-10 text-destructive" />
          <p className="text-destructive">{error}</p>
          <Button onClick={() => generateRoadmap(false)}>
            {tCommon("retry")}
          </Button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="p-4 md:p-6 lg:p-8">
        <div className="mb-6">
          <Link
            href="/roadmap"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            {t("backToRoadmaps")}
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-bold text-foreground">
              {startup?.name} Roadmap
            </h1>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMetricsModal(true)}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {t("updateMetrics")}
              </Button>
              <Button
                size="sm"
                onClick={() => setShowUpdateRoadmapDialog(true)}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {t("updateRoadmap")}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo/10">
                <Users className="w-5 h-5 text-indigo" />
              </div>
              <div>
                <div className="text-lg font-bold">
                  {startup?.users_count?.toLocaleString() || 0}
                </div>
                <div className="text-xs text-muted-foreground">
                  {tTask("users")}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald/10">
                <DollarSign className="w-5 h-5 text-emerald" />
              </div>
              <div>
                <div className="text-lg font-bold">
                  ${((startup?.revenue || 0) / 1000).toFixed(1)}K
                </div>
                <div className="text-xs text-muted-foreground">
                  {tStartups("revenue")}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald/10">
                <TrendingUp className="w-5 h-5 text-emerald" />
              </div>
              <div>
                <div className="text-lg font-bold text-emerald">
                  +{startup?.growth_rate || 0}%
                </div>
                <div className="text-xs text-muted-foreground">
                  {tStartups("growth")}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Flag className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-lg font-bold">
                  {completedTasks}/{totalTasks}
                </div>
                <div className="text-xs text-muted-foreground">
                  {t("tasksDone")}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-lg font-semibold text-foreground">
              {t("title")}
            </h2>
            {phases.map((phase) => {
              const phaseTasks = tasks.filter((t) => t.phase_id === phase.id);
              return (
                <Card key={phase.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold flex items-center gap-3">
                        <span
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                            phaseStatusColors[
                              phase.status as keyof typeof phaseStatusColors
                            ]
                          )}
                        >
                          {phase.phase_number}
                        </span>
                        {t("phase")} {phase.phase_number} - {phase.name}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {phase.duration && (
                          <span className="text-xs text-muted-foreground">
                            {phase.duration}
                          </span>
                        )}
                        <Badge
                          variant="outline"
                          className={cn(
                            phase.status === "completed" &&
                              "bg-emerald/10 text-emerald border-emerald/20",
                            phase.status === "in_progress" &&
                              "bg-primary/10 text-primary border-primary/20",
                            phase.status === "upcoming" && "bg-secondary"
                          )}
                        >
                          {phase.status === "in_progress"
                            ? t("inProgress")
                            : phase.status === "completed"
                            ? t("completed")
                            : t("upcoming")}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {phaseTasks.map((task) => (
                        <li
                          key={task.id}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors group"
                          onClick={() => handleTaskClick(task)}
                        >
                          <Checkbox
                            checked={task.status === "done"}
                            className="mt-0.5"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTaskCheck(task.id, task.status);
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={cn(
                                  "font-medium text-sm",
                                  task.status === "done" &&
                                    "line-through text-muted-foreground"
                                )}
                              >
                                {task.title}
                              </span>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs",
                                  difficultyColors[
                                    task.difficulty as keyof typeof difficultyColors
                                  ]
                                )}
                              >
                                {task.difficulty}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs",
                                  priorityColors[
                                    task.priority as keyof typeof priorityColors
                                  ]
                                )}
                              >
                                {task.priority}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                              {task.description}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="space-y-6">
            {roadmap?.ai_recommendation && (
              <InsightCard
                title={t("aiRecommendation")}
                content={roadmap.ai_recommendation}
                type="ai"
              />
            )}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  {t("progressOverview")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {phases.map((phase) => {
                  const phaseTasks = tasks.filter(
                    (t) => t.phase_id === phase.id
                  );
                  const completed = phaseTasks.filter(
                    (t) => t.status === "done"
                  ).length;
                  const progress =
                    phaseTasks.length > 0
                      ? (completed / phaseTasks.length) * 100
                      : 0;
                  return (
                    <div key={phase.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">
                          {t("phase")} {phase.phase_number}
                        </span>
                        <span className="font-medium">
                          {completed}/{phaseTasks.length}
                        </span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            progress === 100 ? "bg-emerald" : "bg-primary"
                          )}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {nextUpTasks.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    {t("nextUp")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {nextUpTasks.map((task, index) => (
                      <li
                        key={task.id}
                        className="flex items-start gap-2 text-sm cursor-pointer hover:text-primary transition-colors"
                        onClick={() => handleTaskClick(task)}
                      >
                        <div
                          className={cn(
                            "w-1.5 h-1.5 rounded-full mt-2 shrink-0",
                            index === 0 ? "bg-primary" : "bg-muted-foreground"
                          )}
                        />
                        <span>{task.title}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <TaskDetailModal
        open={showTaskModal}
        onOpenChange={setShowTaskModal}
        task={selectedTask}
      />

      <AlertDialog
        open={showUpdateRoadmapDialog}
        onOpenChange={setShowUpdateRoadmapDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("confirmUpdate")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowUpdateRoadmapDialog(false);
                generateRoadmap(true);
              }}
            >
              {t("confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showMetricsModal} onOpenChange={setShowMetricsModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("updateMetrics")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>{tTask("users")}</Label>
              <Input
                type="number"
                value={metrics.users_count}
                onChange={(e) =>
                  setMetrics({
                    ...metrics,
                    users_count: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>{tTask("revenue")}</Label>
              <Input
                type="number"
                value={metrics.revenue}
                onChange={(e) =>
                  setMetrics({
                    ...metrics,
                    revenue: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>{tTask("growthRate")}</Label>
              <Input
                type="number"
                value={metrics.growth_rate}
                onChange={(e) =>
                  setMetrics({
                    ...metrics,
                    growth_rate: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setShowMetricsModal(false)}
            >
              {tCommon("cancel")}
            </Button>
            <Button onClick={handleUpdateMetrics} disabled={metricsLoading}>
              {metricsLoading ? tCommon("saving") : tCommon("save")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
