"use client"

import { Users, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react"
import { TopNav } from "@/components/layout/top-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const metrics = {
  totalUsers: { value: 18340, change: 12.5, trend: "up" as const },
  totalRevenue: { value: 100700, change: 8.2, trend: "up" as const },
  avgGrowth: { value: 34, change: -2.1, trend: "down" as const },
  activeStartups: { value: 4, change: 0, trend: "neutral" as const },
}

const startupMetrics = [
  {
    name: "TechFlow AI",
    users: 2450,
    revenue: 12500,
    growth: 23,
    conversion: 4.2,
    churn: 2.1,
  },
  {
    name: "GreenCommute",
    users: 890,
    revenue: 3200,
    growth: 45,
    conversion: 3.8,
    churn: 3.5,
  },
  {
    name: "HealthSync",
    users: 0,
    revenue: 0,
    growth: 0,
    conversion: 0,
    churn: 0,
  },
  {
    name: "EduMentor",
    users: 15000,
    revenue: 85000,
    growth: 67,
    conversion: 5.5,
    churn: 1.2,
  },
]

const monthlyData = [
  { month: "Sep", users: 8500, revenue: 45000 },
  { month: "Oct", users: 10200, revenue: 58000 },
  { month: "Nov", users: 12800, revenue: 72000 },
  { month: "Dec", users: 14500, revenue: 82000 },
  { month: "Jan", users: 16100, revenue: 91000 },
  { month: "Feb", users: 18340, revenue: 100700 },
]

export default function MetricsPage() {
  return (
    <div className="min-h-screen">
      <TopNav />
      
      <main className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Metrics Dashboard</h1>
            <p className="text-muted-foreground">Track performance across all your startups</p>
          </div>
          <Select defaultValue="6m">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="3m">Last 3 months</SelectItem>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-indigo/10">
                  <Users className="w-5 h-5 text-indigo" />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-sm font-medium",
                  metrics.totalUsers.trend === "up" ? "text-emerald" : "text-destructive"
                )}>
                  {metrics.totalUsers.trend === "up" ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {metrics.totalUsers.change}%
                </div>
              </div>
              <div className="text-2xl font-bold">{metrics.totalUsers.value.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-emerald/10">
                  <DollarSign className="w-5 h-5 text-emerald" />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-sm font-medium",
                  metrics.totalRevenue.trend === "up" ? "text-emerald" : "text-destructive"
                )}>
                  <ArrowUpRight className="w-4 h-4" />
                  {metrics.totalRevenue.change}%
                </div>
              </div>
              <div className="text-2xl font-bold">${(metrics.totalRevenue.value / 1000).toFixed(1)}K</div>
              <div className="text-sm text-muted-foreground">Total Revenue</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-amber/10">
                  <TrendingUp className="w-5 h-5 text-amber" />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-sm font-medium",
                  metrics.avgGrowth.trend === "up" ? "text-emerald" : "text-destructive"
                )}>
                  <ArrowDownRight className="w-4 h-4" />
                  {Math.abs(metrics.avgGrowth.change)}%
                </div>
              </div>
              <div className="text-2xl font-bold">{metrics.avgGrowth.value}%</div>
              <div className="text-sm text-muted-foreground">Avg Growth Rate</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-violet/10">
                  <Activity className="w-5 h-5 text-violet" />
                </div>
              </div>
              <div className="text-2xl font-bold">{metrics.activeStartups.value}</div>
              <div className="text-sm text-muted-foreground">Active Startups</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="users" className="mb-8">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
          </TabsList>
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end gap-2">
                  {monthlyData.map((data, i) => (
                    <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                      <div 
                        className="w-full bg-primary/20 hover:bg-primary/40 rounded-t transition-colors"
                        style={{ height: `${(data.users / 20000) * 100}%` }}
                      />
                      <span className="text-xs text-muted-foreground">{data.month}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="revenue">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end gap-2">
                  {monthlyData.map((data) => (
                    <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                      <div 
                        className="w-full bg-emerald/20 hover:bg-emerald/40 rounded-t transition-colors"
                        style={{ height: `${(data.revenue / 120000) * 100}%` }}
                      />
                      <span className="text-xs text-muted-foreground">{data.month}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Startup Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Startup Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Startup</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Users</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Revenue</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Growth</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Conversion</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Churn</th>
                  </tr>
                </thead>
                <tbody>
                  {startupMetrics.map((startup) => (
                    <tr key={startup.name} className="border-b last:border-0">
                      <td className="py-3 px-4 font-medium">{startup.name}</td>
                      <td className="py-3 px-4 text-right">{startup.users.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">${startup.revenue.toLocaleString()}</td>
                      <td className={cn(
                        "py-3 px-4 text-right font-medium",
                        startup.growth > 0 ? "text-emerald" : startup.growth < 0 ? "text-destructive" : "text-muted-foreground"
                      )}>
                        {startup.growth > 0 ? "+" : ""}{startup.growth}%
                      </td>
                      <td className="py-3 px-4 text-right">{startup.conversion}%</td>
                      <td className={cn(
                        "py-3 px-4 text-right",
                        startup.churn > 3 ? "text-destructive" : "text-muted-foreground"
                      )}>
                        {startup.churn}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
