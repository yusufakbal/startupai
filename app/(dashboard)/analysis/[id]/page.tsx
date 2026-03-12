"use client"

import { useState } from "react"
import Link from "next/link"
import { use } from "react"
import {
  ArrowLeft,
  BarChart2,
  Users,
  TrendingUp,
  AlertTriangle,
  Target,
  Sparkles,
  ChevronRight,
  Map,
} from "lucide-react"
import { TopNav } from "@/components/layout/top-nav"
import { MetricCard } from "@/components/cards/metric-card"
import { InsightCard } from "@/components/cards/insight-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  MarketAnalysisModal,
  CompetitionModal,
  AIInsightModal,
} from "@/components/modals/analysis-modals"
import { cn } from "@/lib/utils"

// Mock startup data
const startupData = {
  id: "1",
  name: "TechFlow AI",
  description: "AI-powered workflow automation for teams",
  stage: "Traction",
  industry: "SaaS",
  score: 7.4,
  marketScore: 8.2,
  competitionScore: 6.5,
  growthPotential: 85,
}

const recommendations = [
  "Focus on enterprise customers to increase average deal size",
  "Build integration partnerships with major CRM platforms",
  "Implement usage-based pricing to reduce friction",
  "Create educational content to establish thought leadership",
  "Develop mobile app to capture on-the-go users",
]

export default function AnalysisDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [showMarketModal, setShowMarketModal] = useState(false)
  const [showCompetitionModal, setShowCompetitionModal] = useState(false)
  const [showAIInsightModal, setShowAIInsightModal] = useState(false)

  return (
    <div className="min-h-screen">
      <TopNav />
      
      <main className="p-4 md:p-6 lg:p-8">
        {/* Back button and header */}
        <div className="mb-6">
          <Link 
            href="/analysis" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Analysis
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">{startupData.name}</h1>
                <Badge variant="outline" className="bg-indigo/10 text-indigo border-indigo/20">
                  {startupData.stage}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1">{startupData.description}</p>
            </div>
            <Link href={`/roadmap/${id}`}>
              <Button className="w-full sm:w-auto">
                <Map className="w-4 h-4 mr-2" />
                Start AI Roadmap
              </Button>
            </Link>
          </div>
        </div>

        {/* Score Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="col-span-2 md:col-span-1">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <BarChart2 className="w-4 h-4" />
                Startup Score
              </div>
              <div className="text-3xl font-bold text-primary">{startupData.score}</div>
              <div className="text-sm text-muted-foreground">/ 10</div>
            </CardContent>
          </Card>
          <MetricCard
            title="Market Score"
            value={`${startupData.marketScore}/10`}
            icon={TrendingUp}
            variant="accent"
          />
          <MetricCard
            title="Competition"
            value={`${startupData.competitionScore}/10`}
            icon={AlertTriangle}
            variant="warning"
          />
          <MetricCard
            title="Growth Potential"
            value={`${startupData.growthPotential}%`}
            icon={Target}
            variant="success"
          />
        </div>

        {/* Analysis Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Market Analysis Card */}
          <Card 
            className="cursor-pointer hover:shadow-md hover:border-primary/20 transition-all"
            onClick={() => setShowMarketModal(true)}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald" />
                Market Analysis
              </CardTitle>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Market Size</div>
                  <div className="font-semibold">$4.2B</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Growth Rate</div>
                  <div className="font-semibold text-emerald">+12.5%</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Opportunity</div>
                  <div className="font-semibold">High</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Target: Tech-savvy professionals, 25-45</span>
              </div>
            </CardContent>
          </Card>

          {/* Competition Analysis Card */}
          <Card 
            className="cursor-pointer hover:shadow-md hover:border-primary/20 transition-all"
            onClick={() => setShowCompetitionModal(true)}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber" />
                Competition Analysis
              </CardTitle>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Competition Level</div>
                  <Badge variant="secondary" className="bg-amber/10 text-amber border-amber/20">
                    Medium
                  </Badge>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground mb-1">Market Position</div>
                  <Progress value={65} className="h-2" />
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                5 main competitors identified with opportunities for differentiation
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insight Card */}
        <div className="mb-8">
          <InsightCard
            title="AI Strategic Insight"
            content="High competition detected in core market segment. Consider focusing on vertical specialization and enterprise features to differentiate. Your AI-first approach provides a unique opportunity in the workflow automation space."
            type="ai"
            onClick={() => setShowAIInsightModal(true)}
          />
        </div>

        {/* Growth Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Growth Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-sm text-foreground">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </main>

      {/* Modals */}
      <MarketAnalysisModal open={showMarketModal} onOpenChange={setShowMarketModal} />
      <CompetitionModal open={showCompetitionModal} onOpenChange={setShowCompetitionModal} />
      <AIInsightModal open={showAIInsightModal} onOpenChange={setShowAIInsightModal} />
    </div>
  )
}
