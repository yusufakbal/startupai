"use client"

import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, type LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface InsightCardProps {
  title: string
  content: string
  type?: "ai" | "growth" | "warning" | "opportunity"
  className?: string
  onClick?: () => void
}

const typeConfig: Record<string, { icon: LucideIcon; color: string; bg: string }> = {
  ai: { icon: Sparkles, color: "text-violet", bg: "bg-violet/10" },
  growth: { icon: TrendingUp, color: "text-emerald", bg: "bg-emerald/10" },
  warning: { icon: AlertTriangle, color: "text-amber", bg: "bg-amber/10" },
  opportunity: { icon: Lightbulb, color: "text-indigo", bg: "bg-indigo/10" },
}

export function InsightCard({
  title,
  content,
  type = "ai",
  className,
  onClick,
}: InsightCardProps) {
  const config = typeConfig[type]
  const Icon = config.icon

  return (
    <Card 
      className={cn(
        "overflow-hidden border-l-4 transition-all",
        onClick && "cursor-pointer hover:shadow-md",
        type === "ai" && "border-l-violet",
        type === "growth" && "border-l-emerald",
        type === "warning" && "border-l-amber",
        type === "opportunity" && "border-l-indigo",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn("p-2 rounded-lg shrink-0", config.bg)}>
            <Icon className={cn("w-4 h-4", config.color)} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm text-foreground mb-1">{title}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{content}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
