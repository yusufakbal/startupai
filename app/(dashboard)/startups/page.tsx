"use client"

import { useState } from "react"
import { Plus, Rocket, Filter, Grid, List } from "lucide-react"
import { TopNav } from "@/components/layout/top-nav"
import { StartupCard, type StartupData } from "@/components/cards/startup-card"
import { AddStartupModal } from "@/components/modals/add-startup-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

// Mock data
const userStartups: StartupData[] = [
  {
    id: "1",
    name: "TechFlow AI",
    description: "AI-powered workflow automation for teams",
    stage: "Traction",
    score: 7.8,
    marketScore: 8.2,
    competitionLevel: "Medium",
    growthPotential: 85,
    users: 2450,
    revenue: 12500,
    growth: 23,
  },
  {
    id: "2",
    name: "GreenCommute",
    description: "Sustainable transportation marketplace",
    stage: "Validation",
    score: 6.5,
    marketScore: 7.0,
    competitionLevel: "High",
    growthPotential: 72,
    users: 890,
    revenue: 3200,
    growth: 45,
  },
  {
    id: "3",
    name: "HealthSync",
    description: "Personal health data aggregation platform",
    stage: "Idea",
    score: 5.2,
    marketScore: 8.5,
    competitionLevel: "Low",
    growthPotential: 90,
    users: 0,
    revenue: 0,
    growth: 0,
  },
  {
    id: "4",
    name: "EduMentor",
    description: "AI tutoring platform for K-12 students",
    stage: "Growth",
    score: 8.5,
    marketScore: 9.0,
    competitionLevel: "Medium",
    growthPotential: 95,
    users: 15000,
    revenue: 85000,
    growth: 67,
  },
]

export default function StartupsPage() {
  const [showAddStartup, setShowAddStartup] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [stageFilter, setStageFilter] = useState<string>("all")

  const filteredStartups = stageFilter === "all" 
    ? userStartups 
    : userStartups.filter(s => s.stage === stageFilter)

  return (
    <div className="min-h-screen">
      <TopNav primaryAction={{ label: "Add Startup", onClick: () => setShowAddStartup(true) }} />
      
      <main className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Startups</h1>
            <p className="text-muted-foreground">Manage all your startup ventures</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="Idea">Idea</SelectItem>
                <SelectItem value="Validation">Validation</SelectItem>
                <SelectItem value="Traction">Traction</SelectItem>
                <SelectItem value="Growth">Growth</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center border rounded-lg p-1">
              <Button
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8", viewMode === "grid" && "bg-secondary")}
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8", viewMode === "list" && "bg-secondary")}
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Startups Grid/List */}
        {filteredStartups.length > 0 ? (
          <div className={cn(
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
              : "space-y-4"
          )}>
            {filteredStartups.map((startup) => (
              <StartupCard
                key={startup.id}
                startup={startup}
                href={`/analysis/${startup.id}`}
                showMetrics={viewMode === "grid"}
                showScores={viewMode === "list"}
              />
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="p-3 rounded-full bg-primary/10 mb-4">
                <Rocket className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">No startups found</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                {stageFilter !== "all" 
                  ? `No startups in the ${stageFilter} stage` 
                  : "Get started by adding your first startup"}
              </p>
              <Button onClick={() => setShowAddStartup(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Startup
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        {userStartups.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-foreground">{userStartups.length}</div>
                <div className="text-sm text-muted-foreground">Total Startups</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-emerald">{userStartups.filter(s => s.stage === "Growth").length}</div>
                <div className="text-sm text-muted-foreground">In Growth</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-indigo">
                  {(userStartups.reduce((acc, s) => acc + (s.score || 0), 0) / userStartups.length).toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground">Avg Score</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-foreground">
                  ${(userStartups.reduce((acc, s) => acc + (s.revenue || 0), 0) / 1000).toFixed(0)}K
                </div>
                <div className="text-sm text-muted-foreground">Total Revenue</div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <AddStartupModal
        open={showAddStartup}
        onOpenChange={setShowAddStartup}
      />
    </div>
  )
}
