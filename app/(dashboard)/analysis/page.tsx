"use client"

import { useState } from "react"
import { Plus, BarChart2 } from "lucide-react"
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
    score: 7.8,
    marketScore: 8.2,
    competitionLevel: "Medium",
    growthPotential: 85,
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
  },
]

export default function AnalysisPage() {
  const [showAddStartup, setShowAddStartup] = useState(false)

  return (
    <div className="min-h-screen">
      <TopNav primaryAction={{ label: "Add Startup", onClick: () => setShowAddStartup(true) }} />
      
      <main className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Startup Analysis</h1>
          <p className="text-muted-foreground">Select a startup to view detailed analysis</p>
        </div>

        {/* Startups Grid */}
        {userStartups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userStartups.map((startup) => (
              <StartupCard
                key={startup.id}
                startup={startup}
                href={`/analysis/${startup.id}`}
                showMetrics={false}
                showScores
              />
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="p-3 rounded-full bg-primary/10 mb-4">
                <BarChart2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">No startups to analyze</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Add a startup to get AI-powered analysis
              </p>
              <Button onClick={() => setShowAddStartup(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Startup
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
