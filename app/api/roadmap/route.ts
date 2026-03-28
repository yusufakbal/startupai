import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getPlanLimits, type PlanType } from "@/lib/plans";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { startup_id, force } = await req.json();

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Profil bilgilerini çek (plan + kullanım + dil)
    const { data: profile } = await supabase
      .from("profiles")
      .select("language, plan, roadmaps_used_this_month, usage_reset_date")
      .eq("id", user.id)
      .single();

    const language = profile?.language === "tr" ? "Turkish" : "English";
    const plan = (profile?.plan ?? "free") as PlanType;
    const limits = getPlanLimits(plan);

    // Aylık kullanım sıfırlama kontrolü
    const resetDate = profile?.usage_reset_date
      ? new Date(profile.usage_reset_date)
      : new Date(0);
    const daysSinceReset =
      (Date.now() - resetDate.getTime()) / (1000 * 60 * 60 * 24);

    let roadmapsUsed = profile?.roadmaps_used_this_month ?? 0;

    if (daysSinceReset >= 30) {
      roadmapsUsed = 0;
      await supabase
        .from("profiles")
        .update({
          roadmaps_used_this_month: 0,
          usage_reset_date: new Date().toISOString(),
        })
        .eq("id", user.id);
    }

    const { data: startup } = await supabase
      .from("startups")
      .select("*")
      .eq("id", startup_id)
      .eq("user_id", user.id)
      .single();

    if (!startup) {
      return NextResponse.json(
        { success: false, error: "Startup not found" },
        { status: 404 }
      );
    }

    const { data: analysis } = await supabase
      .from("analyses")
      .select("*")
      .eq("startup_id", startup_id)
      .eq("user_id", user.id)
      .single();

    const { data: existingRoadmap } = await supabase
      .from("roadmaps")
      .select("*")
      .eq("startup_id", startup_id)
      .eq("user_id", user.id)
      .single();

    // Cache'den dön (limit kontrolü yok)
    if (existingRoadmap && !force) {
      const { data: phases } = await supabase
        .from("roadmap_phases")
        .select("*")
        .eq("roadmap_id", existingRoadmap.id)
        .order("phase_number");

      const { data: tasks } = await supabase
        .from("roadmap_tasks")
        .select("*")
        .eq("roadmap_id", existingRoadmap.id)
        .order("order_index");

      return NextResponse.json({
        success: true,
        roadmap: existingRoadmap,
        phases,
        tasks,
        cached: true,
      });
    }

    // Yeni roadmap veya yeniden oluşturma — limit kontrolü
    if (
      limits.maxRoadmapsPerMonth !== Infinity &&
      roadmapsUsed >= limits.maxRoadmapsPerMonth
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "LIMIT_REACHED",
          limitType: "roadmaps",
          used: roadmapsUsed,
          limit: limits.maxRoadmapsPerMonth,
          plan,
        },
        { status: 403 }
      );
    }

    if (existingRoadmap && force) {
      await supabase.from("roadmaps").delete().eq("id", existingRoadmap.id);
    }

    const prompt = `You are an expert startup growth advisor. Respond ENTIRELY in ${language}. All text fields must be in ${language}. Create a detailed 4-phase roadmap for this startup.

Startup Information:
- Name: ${startup.name}
- Industry: ${startup.industry}
- Description: ${startup.description}
- Target Audience: ${startup.target_audience || "Not specified"}
- Main Problem: ${startup.main_problem || "Not specified"}
- Main Goal: ${startup.main_goal || "Not specified"}
- Current Users: ${startup.users_count || 0}
- Monthly Revenue: $${startup.revenue || 0}

${
  analysis
    ? `Analysis Results:
- Startup Score: ${analysis.score}/10
- Market Score: ${analysis.market_score}/10
- Competition Level: ${analysis.competition_level}
- Growth Potential: ${analysis.growth_potential}%
- Key Strengths: ${JSON.stringify(analysis.strengths)}
- Key Weaknesses: ${JSON.stringify(analysis.weaknesses)}
- Opportunities: ${JSON.stringify(analysis.opportunities)}`
    : ""
}

First, evaluate the company's growth stage based on the startup data and analysis provided:
- If the company is early-stage (low user penetration, pre-revenue or early revenue), use exactly these 4 phase names: "Validate Idea", "Acquire Users", "Product Growth", "Scale"
- If the company is mid-scale (growing user base, consistent revenue, some market presence), create 4 phases appropriate for a mid-scale company focused on optimization, retention and market expansion
- If the company is advanced (significant market penetration, strong revenue, established brand), create 4 phases appropriate for a mature company focused on market leadership, internationalization and strategic partnerships

Each phase must have minimum 3, maximum 5 tasks.

IMPORTANT: For tools, provide real platform URLs. Use this exact format for tools.

Respond ONLY with a valid JSON object, no markdown, no extra text:
{
  "ai_recommendation": "<motivating 2-3 sentence strategic recommendation>",
  "phases": [
    {
      "phase_number": 1,
      "name": "Validate Idea",
      "duration": "<timeframe e.g. Month 1-2>",
      "tasks": [
        {
          "title": "<task title>",
          "description": "<detailed task description>",
          "priority": "<high|medium|low>",
          "difficulty": "<Easy|Medium|Hard>",
          "order_index": 0,
          "steps": ["<step1>", "<step2>", "<step3>"],
          "tools": [
            {
              "category": "<category e.g. Research|Survey|Email|Analytics|Design|Payment>",
              "items": [
                {"name": "<tool name>", "url": "<https://actual-tool-url.com>"},
                {"name": "<tool name>", "url": "<https://actual-tool-url.com>"}
              ]
            }
          ],
          "impact": {"userGrowth": <number 0-100>, "conversion": <number 0-100>}
        }
      ]
    },
    {"phase_number": 2, "name": "Acquire Users", "duration": "<timeframe>", "tasks": [...]},
    {"phase_number": 3, "name": "Product Growth", "duration": "<timeframe>", "tasks": [...]},
    {"phase_number": 4, "name": "Scale", "duration": "<timeframe>", "tasks": [...]}
  ]
}`;

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 8000,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") throw new Error("Unexpected response type");

    const cleanJson = content.text.replace(/```json\n?|\n?```/g, "").trim();
    const aiResult = JSON.parse(cleanJson);

    const { data: savedRoadmap } = await supabase
      .from("roadmaps")
      .insert({
        startup_id: startup.id,
        user_id: user.id,
        ai_recommendation: aiResult.ai_recommendation,
      })
      .select()
      .single();

    if (!savedRoadmap) throw new Error("Failed to save roadmap");

    const allPhases = [];
    const allTasks = [];

    for (const phase of aiResult.phases) {
      const { data: savedPhase } = await supabase
        .from("roadmap_phases")
        .insert({
          roadmap_id: savedRoadmap.id,
          phase_number: phase.phase_number,
          name: phase.name,
          duration: phase.duration,
          status: phase.phase_number === 1 ? "in_progress" : "upcoming",
        })
        .select()
        .single();

      if (!savedPhase) continue;
      allPhases.push(savedPhase);

      for (const task of phase.tasks) {
        const { data: savedTask } = await supabase
          .from("roadmap_tasks")
          .insert({
            phase_id: savedPhase.id,
            roadmap_id: savedRoadmap.id,
            startup_id: startup.id,
            user_id: user.id,
            title: task.title,
            description: task.description,
            priority: task.priority,
            difficulty: task.difficulty,
            order_index: task.order_index || 0,
            steps: task.steps,
            tools: task.tools,
            impact: task.impact,
            status: "todo",
          })
          .select()
          .single();

        if (savedTask) allTasks.push(savedTask);
      }
    }

    // Kullanım sayacını artır
    await supabase
      .from("profiles")
      .update({ roadmaps_used_this_month: roadmapsUsed + 1 })
      .eq("id", user.id);

    return NextResponse.json({
      success: true,
      roadmap: savedRoadmap,
      phases: allPhases,
      tasks: allTasks,
      cached: false,
    });
  } catch (error) {
    console.error("Roadmap error:", error);
    return NextResponse.json(
      { success: false, error: "Roadmap generation failed" },
      { status: 500 }
    );
  }
}
