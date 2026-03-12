"use client"

import { CreditCard, Check, Zap, Building, Rocket } from "lucide-react"
import { TopNav } from "@/components/layout/top-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "Starter",
    price: 0,
    description: "Perfect for exploring the platform",
    features: [
      "1 Startup project",
      "Basic AI analysis",
      "Community support",
      "5 AI insights/month",
    ],
    current: false,
  },
  {
    name: "Pro",
    price: 29,
    description: "For serious entrepreneurs",
    features: [
      "5 Startup projects",
      "Advanced AI analysis",
      "Priority support",
      "Unlimited AI insights",
      "Custom roadmaps",
      "Export reports",
    ],
    current: true,
    popular: true,
  },
  {
    name: "Enterprise",
    price: 99,
    description: "For teams and agencies",
    features: [
      "Unlimited projects",
      "Team collaboration",
      "API access",
      "Custom integrations",
      "Dedicated support",
      "White-label options",
    ],
    current: false,
  },
]

const usage = {
  startups: { used: 3, limit: 5 },
  insights: { used: 45, limit: -1 },
  exports: { used: 8, limit: 20 },
}

export default function BillingPage() {
  return (
    <div className="min-h-screen">
      <TopNav />
      
      <main className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Billing & Subscription</h1>
          <p className="text-muted-foreground">Manage your plan and billing information</p>
        </div>

        {/* Current Plan Overview */}
        <Card className="mb-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold">Pro Plan</h2>
                    <Badge className="bg-primary text-primary-foreground">Current</Badge>
                  </div>
                  <p className="text-muted-foreground">$29/month - Renews on March 15, 2026</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">Manage Billing</Button>
                <Button variant="outline" className="text-destructive border-destructive/20 hover:bg-destructive/10">
                  Cancel Plan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Overview */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Usage This Month</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">Startup Projects</span>
                  <Rocket className="w-4 h-4 text-primary" />
                </div>
                <div className="text-2xl font-bold mb-2">{usage.startups.used}/{usage.startups.limit}</div>
                <Progress value={(usage.startups.used / usage.startups.limit) * 100} className="h-2" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">AI Insights</span>
                  <Zap className="w-4 h-4 text-emerald" />
                </div>
                <div className="text-2xl font-bold mb-2">
                  {usage.insights.used}
                  <span className="text-sm font-normal text-muted-foreground ml-1">/ Unlimited</span>
                </div>
                <Progress value={100} className="h-2 bg-emerald/20 [&>div]:bg-emerald" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">Report Exports</span>
                  <Building className="w-4 h-4 text-indigo" />
                </div>
                <div className="text-2xl font-bold mb-2">{usage.exports.used}/{usage.exports.limit}</div>
                <Progress value={(usage.exports.used / usage.exports.limit) * 100} className="h-2" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Plan Comparison */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card 
                key={plan.name}
                className={cn(
                  "relative",
                  plan.current && "border-primary shadow-lg",
                  plan.popular && "ring-1 ring-primary"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {plan.name}
                    {plan.current && <Badge variant="outline">Current</Badge>}
                  </CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-emerald shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant={plan.current ? "outline" : "default"}
                    disabled={plan.current}
                  >
                    {plan.current ? "Current Plan" : plan.price === 0 ? "Downgrade" : "Upgrade"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center text-white text-xs font-bold">
                  VISA
                </div>
                <div>
                  <div className="font-medium">Visa ending in 4242</div>
                  <div className="text-sm text-muted-foreground">Expires 12/2027</div>
                </div>
              </div>
              <Button variant="ghost" size="sm">Update</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
