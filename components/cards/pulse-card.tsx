"use client"

import { 
  TrendingUp, 
  Newspaper, 
  Award, 
  Globe, 
  Briefcase, 
  DollarSign,
  Rocket,
  type LucideIcon 
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface PulseItem {
  id: string
  title: string
  subtitle?: string
  value?: string
  growth?: number
  badge?: string
  type: "news" | "trending" | "grants" | "top" | "programs" | "funding"
}

interface PulseCardProps {
  item: PulseItem
  onClick?: () => void
}

const typeConfig: Record<string, { icon: LucideIcon; color: string; bg: string }> = {
  news: { icon: Newspaper, color: "text-indigo", bg: "bg-indigo/10" },
  trending: { icon: TrendingUp, color: "text-emerald", bg: "bg-emerald/10" },
  grants: { icon: Award, color: "text-amber", bg: "bg-amber/10" },
  top: { icon: Rocket, color: "text-violet", bg: "bg-violet/10" },
  programs: { icon: Briefcase, color: "text-indigo", bg: "bg-indigo/10" },
  funding: { icon: DollarSign, color: "text-emerald", bg: "bg-emerald/10" },
}

export function PulseCard({ item, onClick }: PulseCardProps) {
  const config = typeConfig[item.type]
  const Icon = config.icon

  return (
    <Card 
      className={cn(
        "group hover:shadow-md hover:border-primary/20 transition-all cursor-pointer h-full",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn("p-2 rounded-lg shrink-0", config.bg)}>
            <Icon className={cn("w-4 h-4", config.color)} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {item.title}
              </h4>
              {item.badge && (
                <Badge variant="secondary" className="shrink-0 text-xs">
                  {item.badge}
                </Badge>
              )}
            </div>
            {item.subtitle && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{item.subtitle}</p>
            )}
            <div className="flex items-center gap-3 mt-2">
              {item.value && (
                <span className="text-sm font-semibold text-foreground">{item.value}</span>
              )}
              {item.growth !== undefined && (
                <span className={cn(
                  "text-xs font-medium flex items-center gap-0.5",
                  item.growth >= 0 ? "text-emerald" : "text-destructive"
                )}>
                  <TrendingUp className={cn("w-3 h-3", item.growth < 0 && "rotate-180")} />
                  {item.growth > 0 ? "+" : ""}{item.growth}%
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
