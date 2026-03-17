import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Service role client — RLS bypass için
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // Güvenlik — sadece secret key ile çalışsın
    const { secret } = await req.json();
    if (secret !== process.env.PULSE_UPDATE_SECRET) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const prompt = `You are a startup ecosystem analyst. Generate fresh, realistic startup news and data for a startup dashboard. Today's date context: ${
      new Date().toISOString().split("T")[0]
    }.

Generate data for 6 categories. Each category needs exactly 3 items.

Respond ONLY with a valid JSON object, no markdown, no extra text:
{
  "funding": [
    {"title": "<news title>", "subtitle": "<detail>", "value": "<amount e.g. $500M>", "badge": "<optional: Hot|Breaking|New|null>", "growth": null},
    {"title": "...", "subtitle": "...", "value": "...", "badge": null, "growth": null},
    {"title": "...", "subtitle": "...", "value": "...", "badge": null, "growth": null}
  ],
  "trending": [
    {"title": "<startup name>", "subtitle": "<description>", "value": "<metric e.g. 10M+ users>", "badge": null, "growth": <number>},
    {"title": "...", "subtitle": "...", "value": "...", "badge": null, "growth": <number>},
    {"title": "...", "subtitle": "...", "value": "...", "badge": null, "growth": <number>}
  ],
  "grants": [
    {"title": "<program name>", "subtitle": "<detail>", "value": "<amount>", "badge": "<optional: Apply Now|Open|null>", "growth": null},
    {"title": "...", "subtitle": "...", "value": "...", "badge": null, "growth": null},
    {"title": "...", "subtitle": "...", "value": "...", "badge": null, "growth": null}
  ],
  "top": [
    {"title": "<startup name>", "subtitle": "<description>", "value": "<metric>", "badge": null, "growth": <number>},
    {"title": "...", "subtitle": "...", "value": "...", "badge": null, "growth": <number>},
    {"title": "...", "subtitle": "...", "value": "...", "badge": null, "growth": <number>}
  ],
  "programs": [
    {"title": "<program name>", "subtitle": "<detail>", "value": "<amount or benefit>", "badge": "<optional: Open|New|null>", "growth": null},
    {"title": "...", "subtitle": "...", "value": "...", "badge": null, "growth": null},
    {"title": "...", "subtitle": "...", "value": "...", "badge": null, "growth": null}
  ],
  "news": [
    {"title": "<policy/incentive title>", "subtitle": "<detail>", "value": "<optional amount>", "badge": "<optional: Policy|New|null>", "growth": null},
    {"title": "...", "subtitle": "...", "value": "...", "badge": null, "growth": null},
    {"title": "...", "subtitle": "...", "value": "...", "badge": null, "growth": null}
  ]
}`;

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") throw new Error("Unexpected response type");

    const cleanJson = content.text.replace(/```json\n?|\n?```/g, "").trim();
    const aiResult = JSON.parse(cleanJson);

    // Mevcut tüm pulse item'ları sil
    await supabase
      .from("pulse_items")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    // Yeni item'ları ekle
    const itemsToInsert: {
      type: string;
      title: string;
      subtitle: string | null;
      value: string | null;
      growth: number | null;
      badge: string | null;
      order_index: number;
      is_active: boolean;
    }[] = [];
    const types = ["funding", "trending", "grants", "top", "programs", "news"];

    for (const type of types) {
      const items = aiResult[type] || [];
      items.forEach((item: any, index: number) => {
        itemsToInsert.push({
          type,
          title: item.title,
          subtitle: item.subtitle || null,
          value: item.value || null,
          growth: item.growth || null,
          badge: item.badge || null,
          order_index: index,
          is_active: true,
        });
      });
    }

    await supabase.from("pulse_items").insert(itemsToInsert);

    // Meta güncelle
    await supabase.from("pulse_meta").upsert({
      id: "00000000-0000-0000-0000-000000000001",
      last_updated_at: new Date().toISOString(),
      updated_by: "manual",
    });

    return NextResponse.json({
      success: true,
      message: `${itemsToInsert.length} pulse items updated`,
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Pulse update error:", error);
    return NextResponse.json(
      { success: false, error: "Pulse update failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data: items } = await supabase
      .from("pulse_items")
      .select("*")
      .eq("is_active", true)
      .order("type")
      .order("order_index");

    const { data: meta } = await supabase
      .from("pulse_meta")
      .select("*")
      .single();

    return NextResponse.json({ success: true, items, meta });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch" },
      { status: 500 }
    );
  }
}
