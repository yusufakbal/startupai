"use client"

import { useState } from "react"
import Link from "next/link"
import { use } from "react"
import {
  ArrowLeft,
  Users,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Circle,
  Clock,
  ChevronRight,
  Flag,
} from "lucide-react"
import { TopNav } from "@/components/layout/top-nav"
import { InsightCard } from "@/components/cards/insight-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { TaskDetailModal, type TaskData } from "@/components/modals/task-detail-modal"
import { cn } from "@/lib/utils"

// Mock data
const startupData = {
  id: "1",
  name: "TechFlow AI",
  users: 2450,
  revenue: 12500,
  growth: 23,
}

const phases = [
  {
    id: 1,
    name: "Validate Idea",
    status: "completed" as const,
    tasks: [
      {
        id: "t1",
        title: "Define value proposition",
        description: "Clearly articulate what makes your product unique and valuable to customers. This forms the foundation of all your marketing and product decisions.",
        status: "done" as const,
        priority: "high" as const,
        phase: 1,
        difficulty: "Easy" as const,
        steps: ["Research competitor positioning", "Interview 10 potential customers", "Create positioning statement", "Test messaging with focus group"],
        tools: [
          { category: "Research", items: ["Notion", "Miro"] },
          { category: "Survey", items: ["Typeform", "Google Forms"] },
        ],
        impact: { userGrowth: 15, conversion: 25 },
      },
      {
        id: "t2",
        title: "Create landing page",
        description: "Build a conversion-optimized landing page that clearly communicates your value proposition and captures user interest.",
        status: "done" as const,
        priority: "high" as const,
        phase: 1,
        difficulty: "Medium" as const,
        steps: ["Design wireframes", "Write compelling copy", "Build with no-code tools", "Set up analytics tracking", "Launch and collect signups"],
        tools: [
          { category: "Landing Page", items: ["Webflow", "Framer", "Carrd"] },
          { category: "Analytics", items: ["Google Analytics", "Mixpanel"] },
        ],
        impact: { userGrowth: 30, conversion: 40 },
      },
      {
        id: "t3",
        title: "Collect waitlist signups",
        description: "Build initial demand validation by collecting email signups from interested potential users.",
        status: "done" as const,
        priority: "medium" as const,
        phase: 1,
        difficulty: "Easy" as const,
        steps: ["Set up email collection form", "Create incentive for signing up", "Promote on social media", "Track conversion rates"],
        tools: [
          { category: "Email", items: ["Mailchimp", "Brevo", "ConvertKit"] },
        ],
        impact: { userGrowth: 50 },
      },
    ],
  },
  {
    id: 2,
    name: "Acquire Users",
    status: "in_progress" as const,
    tasks: [
      {
        id: "t4",
        title: "Launch beta program",
        description: "Invite early adopters to test your product, gather feedback, and build initial user base.",
        status: "done" as const,
        priority: "high" as const,
        phase: 2,
        difficulty: "Medium" as const,
        steps: ["Define beta criteria", "Create onboarding flow", "Set up feedback channels", "Launch to waitlist"],
        tools: [
          { category: "Feedback", items: ["Intercom", "Canny"] },
          { category: "Analytics", items: ["Amplitude", "Mixpanel"] },
        ],
        impact: { userGrowth: 100, conversion: 35 },
      },
      {
        id: "t5",
        title: "Implement referral system",
        description: "Create a viral loop by incentivizing existing users to invite their network.",
        status: "in_progress" as const,
        priority: "high" as const,
        phase: 2,
        difficulty: "Medium" as const,
        steps: ["Design referral mechanics", "Build tracking system", "Create reward structure", "Launch referral campaign"],
        tools: [
          { category: "Referrals", items: ["Viral Loops", "ReferralCandy"] },
        ],
        impact: { userGrowth: 80, conversion: 20 },
      },
      {
        id: "t6",
        title: "Content marketing launch",
        description: "Establish thought leadership through valuable content that attracts your target audience.",
        status: "todo" as const,
        priority: "medium" as const,
        phase: 2,
        difficulty: "Hard" as const,
        steps: ["Create content calendar", "Write 10 cornerstone articles", "Optimize for SEO", "Distribute across channels"],
        tools: [
          { category: "Writing", items: ["Notion", "Substack"] },
          { category: "SEO", items: ["Ahrefs", "Semrush"] },
        ],
        impact: { userGrowth: 60 },
      },
    ],
  },
  {
    id: 3,
    name: "Product Growth",
    status: "upcoming" as const,
    tasks: [
      {
        id: "t7",
        title: "Launch premium tier",
        description: "Introduce paid features to begin monetization and validate willingness to pay.",
        status: "todo" as const,
        priority: "high" as const,
        phase: 3,
        difficulty: "Hard" as const,
        steps: ["Define premium features", "Set pricing strategy", "Build billing system", "Launch to existing users"],
        tools: [
          { category: "Payments", items: ["Stripe", "Paddle"] },
        ],
        impact: { conversion: 45 },
      },
      {
        id: "t8",
        title: "Optimize onboarding",
        description: "Reduce time-to-value and improve activation rates for new users.",
        status: "todo" as const,
        priority: "medium" as const,
        phase: 3,
        difficulty: "Medium" as const,
        steps: ["Analyze drop-off points", "Simplify first-run experience", "Add interactive tutorials", "A/B test variations"],
        tools: [
          { category: "Product", items: ["Pendo", "Appcues"] },
        ],
        impact: { userGrowth: 25, conversion: 35 },
      },
    ],
  },
  {
    id: 4,
    name: "Scale",
    status: "upcoming" as const,
    tasks: [
      {
        id: "t9",
        title: "Enterprise sales launch",
        description: "Build sales motion to acquire larger customers and increase deal sizes.",
        status: "todo" as const,
        priority: "high" as const,
        phase: 4,
        difficulty: "Hard" as const,
        steps: ["Hire first sales rep", "Build sales playbook", "Create enterprise features", "Launch outbound campaign"],
        tools: [
          { category: "Sales", items: ["Salesforce", "HubSpot"] },
          { category: "Outreach", items: ["Apollo", "Outreach"] },
        ],
        impact: { userGrowth: 40, conversion: 60 },
      },
      {
        id: "t10",
        title: "International expansion",
        description: "Localize and launch in new markets to expand addressable market.",
        status: "todo" as const,
        priority: "low" as const,
        phase: 4,
        difficulty: "Hard" as const,
        steps: ["Market research", "Localization", "Local partnerships", "Launch campaign"],
        tools: [
          { category: "Localization", items: ["Lokalise", "Crowdin"] },
        ],
        impact: { userGrowth: 100 },
      },
    ],
  },
]

const phaseStatusColors = {
  completed: "bg-emerald text-emerald-foreground",
  in_progress: "bg-primary text-primary-foreground",
  upcoming: "bg-secondary text-secondary-foreground",
}

const taskStatusIcons = {
  todo: Circle,
  in_progress: Clock,
  done: CheckCircle2,
}

const priorityColors = {
  low: "bg-secondary text-secondary-foreground",
  medium: "bg-amber/10 text-amber border-amber/20",
  high: "bg-destructive/10 text-destructive border-destructive/20",
}

export default function RoadmapDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null)
  const [showTaskModal, setShowTaskModal] = useState(false)

  const allTasks = phases.flatMap((p) => p.tasks)
  const completedTasks = allTasks.filter((t) => t.status === "done").length
  const totalTasks = allTasks.length

  const handleTaskClick = (task: TaskData) => {
    setSelectedTask(task)
    setShowTaskModal(true)
  }

  return (
    <div className="min-h-screen">
      <TopNav />
      
      <main className="p-4 md:p-6 lg:p-8">
        {/* Back button and header */}
        <div className="mb-6">
          <Link 
            href="/roadmap" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Roadmaps
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-bold text-foreground">{startupData.name} Roadmap</h1>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Update Metrics
            </Button>
          </div>
        </div>

        {/* Startup Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo/10">
                <Users className="w-5 h-5 text-indigo" />
              </div>
              <div>
                <div className="text-lg font-bold">{startupData.users.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Users</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald/10">
                <DollarSign className="w-5 h-5 text-emerald" />
              </div>
              <div>
                <div className="text-lg font-bold">${(startupData.revenue / 1000).toFixed(1)}K</div>
                <div className="text-xs text-muted-foreground">Revenue</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald/10">
                <TrendingUp className="w-5 h-5 text-emerald" />
              </div>
              <div>
                <div className="text-lg font-bold text-emerald">+{startupData.growth}%</div>
                <div className="text-xs text-muted-foreground">Growth</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Flag className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-lg font-bold">{completedTasks}/{totalTasks}</div>
                <div className="text-xs text-muted-foreground">Tasks Done</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Roadmap */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-lg font-semibold text-foreground">Growth Roadmap</h2>
            
            {phases.map((phase) => (
              <Card key={phase.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold flex items-center gap-3">
                      <span className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                        phaseStatusColors[phase.status]
                      )}>
                        {phase.id}
                      </span>
                      Phase {phase.id} - {phase.name}
                    </CardTitle>
                    <Badge variant="outline" className={cn(
                      phase.status === "completed" && "bg-emerald/10 text-emerald border-emerald/20",
                      phase.status === "in_progress" && "bg-primary/10 text-primary border-primary/20",
                      phase.status === "upcoming" && "bg-secondary"
                    )}>
                      {phase.status === "in_progress" ? "In Progress" : phase.status === "completed" ? "Completed" : "Upcoming"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {phase.tasks.map((task) => {
                      const StatusIcon = taskStatusIcons[task.status]
                      return (
                        <li 
                          key={task.id}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors group"
                          onClick={() => handleTaskClick(task)}
                        >
                          <Checkbox 
                            checked={task.status === "done"} 
                            className="mt-0.5"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "font-medium text-sm",
                                task.status === "done" && "line-through text-muted-foreground"
                              )}>
                                {task.title}
                              </span>
                              <Badge variant="outline" className={cn("text-xs", priorityColors[task.priority])}>
                                {task.priority}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                              {task.description}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </li>
                      )
                    })}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            {/* AI Insight */}
            <InsightCard
              title="AI Recommendation"
              content="Based on your latest metrics, focus on completing the referral system to accelerate user acquisition before launching premium features."
              type="ai"
            />

            {/* Quick Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Progress Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {phases.map((phase) => {
                  const phaseTasks = phase.tasks
                  const completed = phaseTasks.filter((t) => t.status === "done").length
                  const progress = (completed / phaseTasks.length) * 100
                  return (
                    <div key={phase.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Phase {phase.id}</span>
                        <span className="font-medium">{completed}/{phaseTasks.length}</span>
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
                  )
                })}
              </CardContent>
            </Card>

            {/* Upcoming Tasks */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Next Up</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {allTasks
                    .filter((t) => t.status !== "done")
                    .slice(0, 3)
                    .map((task) => (
                      <li 
                        key={task.id}
                        className="flex items-start gap-2 text-sm cursor-pointer hover:text-primary transition-colors"
                        onClick={() => handleTaskClick(task)}
                      >
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full mt-2 shrink-0",
                          task.status === "in_progress" ? "bg-primary" : "bg-muted-foreground"
                        )} />
                        <span>{task.title}</span>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <TaskDetailModal
        open={showTaskModal}
        onOpenChange={setShowTaskModal}
        task={selectedTask}
      />
    </div>
  )
}
