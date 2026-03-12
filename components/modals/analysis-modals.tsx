"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  TrendingUp,
  Users,
  Target,
  Zap,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Market Analysis Modal
interface MarketModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MarketAnalysisModal({ open, onOpenChange }: MarketModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Market Analysis</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Market Overview */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald" />
                Market Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-secondary/50 rounded-lg">
                  <div className="text-lg font-bold text-foreground">$4.2B</div>
                  <div className="text-xs text-muted-foreground">Market Size</div>
                </div>
                <div className="text-center p-3 bg-secondary/50 rounded-lg">
                  <div className="text-lg font-bold text-emerald">12.5%</div>
                  <div className="text-xs text-muted-foreground">Growth Rate</div>
                </div>
                <div className="text-center p-3 bg-secondary/50 rounded-lg">
                  <div className="text-lg font-bold text-indigo">Rising</div>
                  <div className="text-xs text-muted-foreground">Trend</div>
                </div>
              </div>
              {/* Simple chart representation */}
              <div className="h-24 flex items-end gap-1">
                {[35, 42, 38, 55, 48, 62, 58, 75, 82, 78, 88, 95].map((val, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-primary/20 rounded-t transition-all hover:bg-primary/40"
                    style={{ height: `${val}%` }}
                  />
                ))}
              </div>
              <div className="text-xs text-muted-foreground text-center">Market growth over 12 months</div>
            </CardContent>
          </Card>

          {/* Target Customer */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo" />
                Customer Persona
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-muted-foreground">Age Range</div>
                    <div className="font-medium">25-45 years</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Income Level</div>
                    <div className="font-medium">$75K - $150K/year</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-muted-foreground">Buying Motivation</div>
                    <div className="font-medium">Time savings & efficiency</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Key Pain Points</div>
                    <div className="font-medium">Manual workflow bottlenecks</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market Opportunity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald" />
                Market Opportunity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Opportunity Score</span>
                  <span className="font-medium text-emerald">78/100</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Market Drivers */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber" />
                Market Drivers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald shrink-0 mt-0.5" />
                  <span>AI adoption accelerating across enterprise workflows</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald shrink-0 mt-0.5" />
                  <span>Remote work driving demand for automation tools</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald shrink-0 mt-0.5" />
                  <span>Integration ecosystem maturity enabling rapid deployment</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Competition Analysis Modal
export function CompetitionModal({ open, onOpenChange }: MarketModalProps) {
  const competitors = [
    { name: "AutomateHQ", strength: "Enterprise features", weakness: "Complex pricing", position: "Leader" },
    { name: "FlowBuilder", strength: "User-friendly", weakness: "Limited integrations", position: "Challenger" },
    { name: "WorkStream", strength: "AI capabilities", weakness: "Early stage", position: "Niche" },
    { name: "TaskMaster", strength: "Affordable", weakness: "Basic features", position: "Follower" },
    { name: "ZenFlow", strength: "Design quality", weakness: "Small team", position: "Niche" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Competition Landscape</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Competition Level */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Competition Level</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-amber">Medium</div>
                <div className="text-sm text-muted-foreground flex-1">
                  Market has established players but significant opportunities for differentiation exist.
                </div>
              </div>
              {/* Radar-like visualization */}
              <div className="grid grid-cols-5 gap-2">
                {["Price", "Features", "Support", "Brand", "Tech"].map((label, i) => (
                  <div key={label} className="text-center">
                    <div className="h-16 relative mb-1">
                      <div 
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 bg-primary/20 rounded-t"
                        style={{ height: `${[60, 75, 45, 50, 80][i]}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Competitors Table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Top 5 Competitors</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Competitor</TableHead>
                    <TableHead>Strength</TableHead>
                    <TableHead>Weakness</TableHead>
                    <TableHead>Position</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {competitors.map((c) => (
                    <TableRow key={c.name}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell className="text-emerald">{c.strength}</TableCell>
                      <TableCell className="text-destructive">{c.weakness}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{c.position}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Competitive Advantages */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber" />
                Competitive Advantage Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm">
                  <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span><strong>Differentiation:</strong> Focus on AI-first approach with natural language commands</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span><strong>Pricing:</strong> Usage-based model could capture SMB market</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span><strong>Feature Gap:</strong> No competitor offers real-time collaboration</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Competitive Map */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Competitive Positioning Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-48 bg-secondary/30 rounded-lg">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-px h-full bg-border" />
                </div>
                <div className="absolute inset-0 flex items-center">
                  <div className="h-px w-full bg-border" />
                </div>
                {/* Competitors positioned */}
                <div className="absolute top-4 right-8 p-2 bg-amber/20 rounded-lg text-xs font-medium">AutomateHQ</div>
                <div className="absolute top-12 left-12 p-2 bg-primary/20 rounded-lg text-xs font-medium">You</div>
                <div className="absolute bottom-8 right-16 p-2 bg-secondary rounded-lg text-xs font-medium">FlowBuilder</div>
                <div className="absolute bottom-16 left-20 p-2 bg-secondary rounded-lg text-xs font-medium">TaskMaster</div>
                {/* Axis labels */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">Price (Low → High)</div>
                <div className="absolute top-1/2 -left-8 -translate-y-1/2 -rotate-90 text-xs text-muted-foreground">Value</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// AI Insight Modal
export function AIInsightModal({ open, onOpenChange }: MarketModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">AI Strategic Insight</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Expanded Insight */}
          <Card className="border-l-4 border-l-violet">
            <CardContent className="pt-6">
              <p className="text-sm leading-relaxed">
                Based on comprehensive analysis of your market position, competition landscape, and growth metrics, 
                your startup shows strong potential in the workflow automation space. However, the medium-high competition 
                level suggests a need for clear differentiation. Your AI-first approach provides a unique value proposition 
                that can capture the growing segment of users seeking intelligent automation solutions.
              </p>
            </CardContent>
          </Card>

          {/* Key Risks */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                Key Risks Detected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-2" />
                  <span>Large competitors may enter your niche within 12-18 months</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-2" />
                  <span>Customer acquisition cost trending upward in this segment</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber mt-2" />
                  <span>Dependency on third-party integrations could limit scalability</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Key Opportunities */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-emerald" />
                Key Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald mt-2" />
                  <span>Vertical-specific solutions (healthcare, legal) underserved</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald mt-2" />
                  <span>Partnership opportunities with major enterprise software providers</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald mt-2" />
                  <span>API marketplace could generate additional revenue streams</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Strategic Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Recommended Strategic Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {[
                  "Focus on building 2-3 deep vertical integrations to create switching costs",
                  "Accelerate product-led growth with a generous free tier to build market share",
                  "Develop proprietary AI models trained on workflow data for competitive moat",
                  "Build community and ecosystem around your platform early",
                ].map((action, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium shrink-0">
                      {i + 1}
                    </span>
                    <span>{action}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Impact Prediction */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald" />
                Impact Prediction: User Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-32 flex items-end gap-2">
                {[
                  { month: "Now", current: 40, projected: 40 },
                  { month: "M1", current: 45, projected: 52 },
                  { month: "M2", current: 50, projected: 65 },
                  { month: "M3", current: 55, projected: 78 },
                  { month: "M4", current: 60, projected: 88 },
                  { month: "M5", current: 65, projected: 95 },
                  { month: "M6", current: 70, projected: 100 },
                ].map((item) => (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex gap-0.5">
                      <div
                        className="flex-1 bg-secondary rounded-t"
                        style={{ height: `${item.current}%` }}
                      />
                      <div
                        className="flex-1 bg-emerald/50 rounded-t"
                        style={{ height: `${item.projected}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{item.month}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 bg-secondary rounded" />
                  <span className="text-muted-foreground">Current trajectory</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 bg-emerald/50 rounded" />
                  <span className="text-muted-foreground">With recommendations</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
