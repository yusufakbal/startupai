"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Rocket,
  Sparkles,
  TrendingUp,
  Globe,
  Award,
  DollarSign,
  Briefcase,
  BarChart2,
} from "lucide-react";
import { TopNav } from "@/components/layout/top-nav";
import { StartupCard, type StartupData } from "@/components/cards/startup-card";
import { PulseCard, type PulseItem } from "@/components/cards/pulse-card";
import { AddStartupModal } from "@/components/modals/add-startup-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase";

const pulseItems: PulseItem[] = [
  {
    id: "f1",
    type: "funding",
    title: "Stripe raises $6.5B at $50B valuation",
    subtitle: "Series I funding round",
    value: "$6.5B",
    badge: "Hot",
  },
  {
    id: "f2",
    type: "funding",
    title: "OpenAI closes $10B Microsoft deal",
    subtitle: "Strategic partnership",
    value: "$10B",
  },
  {
    id: "f3",
    type: "funding",
    title: "Figma acquisition by Adobe cancelled",
    subtitle: "Regulatory concerns",
    badge: "Breaking",
  },
  {
    id: "t1",
    type: "trending",
    title: "Perplexity AI",
    subtitle: "AI-powered search engine",
    growth: 340,
    value: "10M+ users",
  },
  {
    id: "t2",
    type: "trending",
    title: "Notion",
    subtitle: "All-in-one workspace",
    growth: 89,
    value: "30M+ users",
  },
  {
    id: "t3",
    type: "trending",
    title: "Linear",
    subtitle: "Modern project management",
    growth: 156,
    value: "5000+ teams",
  },
  {
    id: "g1",
    type: "grants",
    title: "Y Combinator W24 Applications Open",
    subtitle: "Apply by Dec 15",
    value: "$500K",
    badge: "Apply Now",
  },
  {
    id: "g2",
    type: "grants",
    title: "EU Innovation Fund",
    subtitle: "Climate tech startups",
    value: "€2M",
  },
  {
    id: "g3",
    type: "grants",
    title: "AWS Activate Program",
    subtitle: "Cloud credits for startups",
    value: "$100K credits",
  },
  {
    id: "top1",
    type: "top",
    title: "Anthropic",
    subtitle: "AI Safety Research",
    growth: 420,
    value: "$4.1B raised",
  },
  {
    id: "top2",
    type: "top",
    title: "Vercel",
    subtitle: "Frontend Cloud Platform",
    growth: 180,
    value: "$150M ARR",
  },
  {
    id: "top3",
    type: "top",
    title: "Mistral AI",
    subtitle: "Open-source LLMs",
    growth: 890,
    value: "$2B valuation",
  },
  {
    id: "p1",
    type: "programs",
    title: "Techstars Spring 2024",
    subtitle: "Global accelerator program",
    value: "$120K",
    badge: "Open",
  },
  {
    id: "p2",
    type: "programs",
    title: "500 Global Seed Program",
    subtitle: "Early stage funding",
    value: "$150K",
  },
  {
    id: "p3",
    type: "programs",
    title: "Google for Startups",
    subtitle: "Founder mentorship",
    value: "$200K credits",
  },
  {
    id: "c1",
    type: "news",
    title: "Singapore Startup Visa Extended",
    subtitle: "Tech.Pass now 3 years",
    badge: "Policy",
  },
  {
    id: "c2",
    type: "news",
    title: "UK SEIS Tax Relief Increased",
    subtitle: "50% relief for investors",
    value: "£250K limit",
  },
  {
    id: "c3",
    type: "news",
    title: "UAE Golden Visa for Founders",
    subtitle: "10-year residency",
    badge: "New",
  },
];

const fundingNews = pulseItems.filter((item) => item.type === "funding");
const trendingStartups = pulseItems.filter((item) => item.type === "trending");
const grantsSupport = pulseItems.filter((item) => item.type === "grants");
const topGrowing = pulseItems.filter((item) => item.type === "top");
const programs = pulseItems.filter((item) => item.type === "programs");
const countryNews = pulseItems.filter((item) => item.type === "news");

export default function DashboardPage() {
  const [showAddStartup, setShowAddStartup] = useState(false);
  const [startups, setStartups] = useState<StartupData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showArrows, setShowArrows] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  useEffect(() => {
    loadStartups();
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const checkOverflow = () => {
      setShowArrows(el.scrollWidth > el.clientWidth);
    };
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [startups]);

  const loadStartups = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("startups")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) {
      setStartups(
        data.map((s) => ({
          id: s.id,
          name: s.name,
          description: s.description,
          stage: s.stage as StartupData["stage"],
          users: s.users_count,
          revenue: s.revenue,
          growth: s.growth_rate,
        }))
      );
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      <TopNav
        primaryAction={{
          label: "Add Startup",
          onClick: () => setShowAddStartup(true),
        }}
      />

      <main className="p-4 md:p-6 lg:p-8">
        {/* Your Startups */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Your Startups
              </h2>
              <p className="text-sm text-muted-foreground">
                Manage and track your ventures
              </p>
            </div>
            <Button
              onClick={() => setShowAddStartup(true)}
              size="sm"
              className="sm:hidden"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {loading ? (
            <div className="flex gap-4">
              <Card className="animate-pulse shrink-0 w-72">
                <CardContent className="p-5 h-40" />
              </Card>
            </div>
          ) : startups.length > 0 ? (
            <div className="relative px-6">
              {showArrows && (
                <button
                  onClick={scrollLeft}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-background border shadow-md flex items-center justify-center hover:bg-secondary transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto scroll-smooth"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {startups.map((startup) => (
                  <div key={startup.id} className="shrink-0 w-72">
                    <StartupCard
                      startup={startup}
                      href={`/analysis/${startup.id}`}
                      showMetrics
                    />
                  </div>
                ))}
              </div>
              {showArrows && (
                <button
                  onClick={scrollRight}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-background border shadow-md flex items-center justify-center hover:bg-secondary transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="p-3 rounded-full bg-primary/10 mb-4">
                  <Rocket className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  No startups yet
                </h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Add your first startup to get AI-powered insights
                </p>
                <Button onClick={() => setShowAddStartup(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Startup
                </Button>
              </CardContent>
            </Card>
          )}
        </section>

        {/* CTA Card */}
        <Card className="mb-8 bg-gradient-to-br from-indigo/10 via-violet/5 to-emerald/10 border-indigo/20">
          <CardContent className="flex flex-col md:flex-row items-center justify-between p-6 md:p-8 gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  Start Your Business Idea
                </h3>
                <p className="text-muted-foreground">
                  Get AI-powered analysis and a personalized growth roadmap
                </p>
              </div>
            </div>
            <Button
              size="lg"
              onClick={() => setShowAddStartup(true)}
              className="w-full md:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Startup
            </Button>
          </CardContent>
        </Card>

        {/* Startup Pulse */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <BarChart2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Startup Pulse
              </h2>
              <p className="text-sm text-muted-foreground">
                Latest from the startup ecosystem
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-4 h-4 text-emerald" />
                <h3 className="font-medium text-foreground">Recent Funding</h3>
              </div>
              <div className="space-y-3">
                {fundingNews.map((item) => (
                  <PulseCard key={item.id} item={item} />
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-emerald" />
                <h3 className="font-medium text-foreground">
                  Trending Startups
                </h3>
              </div>
              <div className="space-y-3">
                {trendingStartups.map((item) => (
                  <PulseCard key={item.id} item={item} />
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-amber" />
                <h3 className="font-medium text-foreground">
                  Grants & Support
                </h3>
              </div>
              <div className="space-y-3">
                {grantsSupport.map((item) => (
                  <PulseCard key={item.id} item={item} />
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Rocket className="w-4 h-4 text-violet" />
                <h3 className="font-medium text-foreground">Top Growing</h3>
              </div>
              <div className="space-y-3">
                {topGrowing.map((item) => (
                  <PulseCard key={item.id} item={item} />
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="w-4 h-4 text-indigo" />
                <h3 className="font-medium text-foreground">
                  Programs & Accelerators
                </h3>
              </div>
              <div className="space-y-3">
                {programs.map((item) => (
                  <PulseCard key={item.id} item={item} />
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-4 h-4 text-indigo" />
                <h3 className="font-medium text-foreground">
                  Country Incentives
                </h3>
              </div>
              <div className="space-y-3">
                {countryNews.map((item) => (
                  <PulseCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <AddStartupModal
        open={showAddStartup}
        onOpenChange={setShowAddStartup}
        onComplete={loadStartups}
      />
    </div>
  );
}
