"use client"

import { useState } from "react"
import { Plus, Map } from "lucide-react"
import { TopNav } from "@/components/layout/top-nav"
import { StartupCard, type StartupData } from "@/components/cards/startup-card"
import { AddStartupModal } from "@/components/modals/add-startup-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// Mock data
const userStartups: StartupData[] = [
  {
    id: "1",
    name: "TechFlow AI",
    description: "AI-powered workflow automation for teams",
    stage: "Traction",
    users: 2450,
    revenue: 12500,
    growth: 23,
    tasksCompleted: 8,
    totalTasks: 12,
  },
  {
    id: "2",
    name: "GreenCommute",
    description: "Sustainable transportation marketplace",
    stage: "Validation",
    users: 890,
    revenue: 3200,
    growth: 45,
    tasksCompleted: 3,
    totalTasks: 10,
  },
  {
    id: "3",
    name: "EduMentor",
    description: "AI tutoring platform for K-12 students",
    stage: "Growth",
    users: 15000,
    revenue: 85000,
    growth: 67,
    tasksCompleted: 15,
    totalTasks: 18,
  },
]

export default function RoadmapPage() {
  const [showAddStartup, setShowAddStartup] = useState(false)

  return (
    <div className="min-h-screen">
      <TopNav primaryAction={{ label: "Start AI Roadmap", onClick: () => setShowAddStartup(true) }} />
      
      <main className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Growth Roadmaps</h1>
          <p className="text-muted-foreground">Select a startup to view and manage its roadmap</p>
        </div>

        {/* Startups Grid */}
        {userStartups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userStartups.map((startup) => (
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
              <h3 className="font-semibold text-foreground mb-1">No roadmaps yet</h3>
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
      />
    </div>
  )
}
