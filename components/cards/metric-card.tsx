"use client"

import { type LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: LucideIcon
  trend?: {
    value: number
    label?: string
  }
  variant?: "default" | "primary" | "accent" | "warning" | "success"
  className?: string
}

const variants = {
  default: "bg-card",
  primary: "bg-indigo/5 border-indigo/20",
  accent: "bg-emerald/5 border-emerald/20",
  warning: "bg-amber/5 border-amber/20",
  success: "bg-green/5 border-green/20",
}

const iconVariants = {
  default: "bg-secondary text-foreground",
  primary: "bg-indigo/10 text-indigo",
  accent: "bg-emerald/10 text-emerald",
  warning: "bg-amber/10 text-amber",
  success: "bg-green/10 text-green",
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: MetricCardProps) {
  return (
    <Card className={cn("overflow-hidden", variants[variant], className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
            {trend && (
              <div className={cn(
                "flex items-center gap-1 mt-2 text-sm font-medium",
                trend.value >= 0 ? "text-emerald" : "text-destructive"
              )}>
                <span>{trend.value > 0 ? "+" : ""}{trend.value}%</span>
                {trend.label && <span className="text-muted-foreground font-normal">{trend.label}</span>}
              </div>
            )}
          </div>
          {Icon && (
            <div className={cn("p-2.5 rounded-lg", iconVariants[variant])}>
              <Icon className="w-5 h-5" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
