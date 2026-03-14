import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { startup } = await req.json();

    const prompt = `You are an expert startup advisor. Analyze the following startup and provide:
1. A comprehensive business analysis
2. Market analysis
3. Competition assessment  
4. A detailed growth roadmap with 4 phases and specific tasks

Startup Information:
- Name: ${startup.name}
- Industry: ${startup.industry}
- Description: ${startup.description}
- Target Audience: ${startup.target_audience}
- Main Problem: ${startup.main_problem}
- Main Goal: ${startup.main_goal}
- Market Size: ${startup.market_size}
- Current Users: ${startup.users_count}
- Monthly Revenue: $${startup.revenue}

Respond ONLY with a valid JSON object in this exact format:
{
  "score": <number 1-10>,
  "marketScore": <number 1-10>,
  "competitionScore": <number 1-10>,
  "growthPotential": <number 1-100>,
  "competitionLevel": "<Low|Medium|High>",
  "summary": "<2-3 sentence executive summary>",
  "strengths": ["<strength1>", "<strength2>", "<strength3>"],
  "weaknesses": ["<weakness1>", "<weakness2>", "<weakness3>"],
  "opportunities": ["<opportunity1>", "<opportunity2>", "<opportunity3>"],
  "recommendations": ["<rec1>", "<rec2>", "<rec3>", "<rec4>", "<rec5>"],
  "marketAnalysis": {
    "size": "<market size estimate>",
    "growthRate": "<annual growth rate>",
    "targetSegment": "<primary target segment>"
  },
  "roadmap": [
    {
      "phase": 1,
      "name": "<phase name>",
      "duration": "<timeframe>",
      "tasks": [
        {
          "title": "<task title>",
          "description": "<task description>",
          "priority": "<high|medium|low>",
          "difficulty": "<Easy|Medium|Hard>",
          "steps": ["<step1>", "<step2>", "<step3>"],
          "tools": [{"category": "<category>", "items": ["<tool1>", "<tool2>"]}],
          "impact": {"userGrowth": <number>, "conversion": <number>}
        }
      ]
    }
  ]
}`;

    const message = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    // JSON parse
    const cleanJson = content.text.replace(/```json\n?|\n?```/g, "").trim();
    const analysis = JSON.parse(cleanJson);

    return NextResponse.json({ success: true, analysis });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { success: false, error: "Analysis failed" },
      { status: 500 }
    );
  }
}
