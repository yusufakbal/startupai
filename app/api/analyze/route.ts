import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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

    const { data: startup, error: startupError } = await supabase
      .from("startups")
      .select("*")
      .eq("id", startup_id)
      .eq("user_id", user.id)
      .single();

    if (startupError || !startup) {
      return NextResponse.json(
        { success: false, error: "Startup not found" },
        { status: 404 }
      );
    }

    const { data: existingAnalysis } = await supabase
      .from("analyses")
      .select("*")
      .eq("startup_id", startup_id)
      .eq("user_id", user.id)
      .single();

    if (existingAnalysis && !force) {
      return NextResponse.json({
        success: true,
        analysis: existingAnalysis,
        cached: true,
      });
    }

    if (existingAnalysis && force) {
      await supabase.from("analyses").delete().eq("startup_id", startup_id);
    }

    const prompt = `You are an expert startup advisor. Analyze the following startup thoroughly.

Startup Information:
- Name: ${startup.name}
- Industry: ${startup.industry}
- Description: ${startup.description}
- Target Audience: ${startup.target_audience || "Not specified"}
- Main Problem Solved: ${startup.main_problem || "Not specified"}
- Main Goal: ${startup.main_goal || "Not specified"}
- Market Size: ${startup.market_size || "Not specified"}
- Current Users: ${startup.users_count || 0}
- Monthly Revenue: $${startup.revenue || 0}

Respond ONLY with a valid JSON object, no markdown, no extra text:
{
  "score": <number 1-10>,
  "market_score": <number 1-10>,
  "competition_score": <number 1-10>,
  "growth_potential": <number 1-100>,
  "competition_level": "<Low|Medium|High>",
  "summary": "<2-3 sentence executive summary>",
  "strengths": ["<strength1>", "<strength2>", "<strength3>"],
  "weaknesses": ["<weakness1>", "<weakness2>", "<weakness3>"],
  "opportunities": ["<opportunity1>", "<opportunity2>", "<opportunity3>"],
  "recommendations": ["<rec1>", "<rec2>", "<rec3>", "<rec4>", "<rec5>"],
  "market_size_estimate": "<market size estimate e.g. $4.2B>",
  "market_growth_rate": "<annual growth rate e.g. +12.5%>",
  "target_segment": "<primary target segment>",
  "market_drivers": ["<driver1>", "<driver2>", "<driver3>"],
  "key_risks": ["<risk1>", "<risk2>", "<risk3>"],
  "competitors": [
    {
      "name": "<competitor name>",
      "strength": "<main strength>",
      "weakness": "<main weakness>",
      "position": "<Leader|Challenger|Niche|Follower>"
    }
  ],
  "roadmap": [
    {
      "phase": 1,
      "name": "<phase name>",
      "duration": "<timeframe e.g. Month 1-2>",
      "tasks": [
        {
          "title": "<task title>",
          "description": "<task description>",
          "priority": "<high|medium|low>",
          "difficulty": "<Easy|Medium|Hard>",
          "steps": ["<step1>", "<step2>", "<step3>"],
          "tools": [{"category": "<category>", "items": ["<tool1>", "<tool2>"]}],
          "impact": {"userGrowth": <number 0-100>, "conversion": <number 0-100>}
        }
      ]
    },
    {"phase": 2, "name": "<phase name>", "duration": "<timeframe>", "tasks": [...]},
    {"phase": 3, "name": "<phase name>", "duration": "<timeframe>", "tasks": [...]},
    {"phase": 4, "name": "<phase name>", "duration": "<timeframe>", "tasks": [...]}
  ]
}`;

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 8000,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    const cleanJson = content.text.replace(/```json\n?|\n?```/g, "").trim();
    const aiResult = JSON.parse(cleanJson);

    const { data: savedAnalysis, error: saveError } = await supabase
      .from("analyses")
      .insert({
        startup_id: startup.id,
        user_id: user.id,
        score: aiResult.score,
        market_score: aiResult.market_score,
        competition_score: aiResult.competition_score,
        growth_potential: aiResult.growth_potential,
        competition_level: aiResult.competition_level,
        summary: aiResult.summary,
        strengths: aiResult.strengths,
        weaknesses: aiResult.weaknesses,
        opportunities: aiResult.opportunities,
        recommendations: aiResult.recommendations,
        market_size_estimate: aiResult.market_size_estimate,
        market_growth_rate: aiResult.market_growth_rate,
        target_segment: aiResult.target_segment,
        market_drivers: aiResult.market_drivers,
        key_risks: aiResult.key_risks,
        competitors: aiResult.competitors,
        roadmap: aiResult.roadmap,
      })
      .select()
      .single();

    if (saveError) {
      throw new Error("Failed to save analysis: " + saveError.message);
    }

    return NextResponse.json({
      success: true,
      analysis: savedAnalysis,
      cached: false,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { success: false, error: "Analysis failed" },
      { status: 500 }
    );
  }
}
