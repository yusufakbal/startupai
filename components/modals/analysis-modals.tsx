"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TrendingUp,
  Users,
  Target,
  Zap,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalysisModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  analysis: any;
}

// Market Analysis Modal
export function MarketAnalysisModal({
  open,
  onOpenChange,
  analysis,
}: AnalysisModalProps) {
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
                  <div className="text-lg font-bold text-foreground">
                    {analysis?.market_size_estimate}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Market Size
                  </div>
                </div>
                <div className="text-center p-3 bg-secondary/50 rounded-lg">
                  <div className="text-lg font-bold text-emerald">
                    {analysis?.market_growth_rate}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Growth Rate
                  </div>
                </div>
                <div className="text-center p-3 bg-secondary/50 rounded-lg">
                  <div className="text-lg font-bold text-indigo">
                    {analysis?.market_score}/10
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Market Score
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Target Segment */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo" />
                Target Segment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {analysis?.target_segment}
              </p>
            </CardContent>
          </Card>

          {/* Market Opportunity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald" />
                Market Opportunity Score
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">
                    Growth Potential
                  </span>
                  <span className="font-medium text-emerald">
                    {analysis?.growth_potential}%
                  </span>
                </div>
                <Progress value={analysis?.growth_potential} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Market Drivers */}
          {analysis?.market_drivers?.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber" />
                  Market Drivers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.market_drivers.map((driver: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald shrink-0 mt-0.5" />
                      <span>{driver}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Competition Analysis Modal
export function CompetitionModal({
  open,
  onOpenChange,
  analysis,
}: AnalysisModalProps) {
  const competitionColor = {
    Low: "text-emerald",
    Medium: "text-amber",
    High: "text-destructive",
  };

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
              <CardTitle className="text-sm font-medium">
                Competition Level
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "text-3xl font-bold",
                    competitionColor[
                      analysis?.competition_level as keyof typeof competitionColor
                    ]
                  )}
                >
                  {analysis?.competition_level}
                </div>
                <div className="text-sm text-muted-foreground flex-1">
                  Competition score: {analysis?.competition_score}/10
                </div>
              </div>
              <Progress
                value={analysis?.competition_score * 10}
                className="h-2"
              />
            </CardContent>
          </Card>

          {/* Competitors Table */}
          {analysis?.competitors?.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Top Competitors
                </CardTitle>
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
                    {analysis.competitors.map((c: any, i: number) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{c.name}</TableCell>
                        <TableCell className="text-emerald text-sm">
                          {c.strength}
                        </TableCell>
                        <TableCell className="text-destructive text-sm">
                          {c.weakness}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{c.position}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Opportunities */}
          {analysis?.opportunities?.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber" />
                  Competitive Advantage Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.opportunities.map((opp: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{opp}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// AI Insight Modal
export function AIInsightModal({
  open,
  onOpenChange,
  analysis,
}: AnalysisModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">AI Strategic Insight</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Full Summary */}
          <Card className="border-l-4 border-l-violet">
            <CardContent className="pt-6">
              <p className="text-sm leading-relaxed">{analysis?.summary}</p>
            </CardContent>
          </Card>

          {/* Key Risks */}
          {analysis?.key_risks?.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  Key Risks Detected
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.key_risks.map((risk: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 shrink-0" />
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Opportunities */}
          {analysis?.opportunities?.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-emerald" />
                  Key Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.opportunities.map((opp: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald mt-2 shrink-0" />
                      <span>{opp}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          {analysis?.recommendations?.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Recommended Strategic Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {analysis.recommendations.map((rec: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium shrink-0">
                        {i + 1}
                      </span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
