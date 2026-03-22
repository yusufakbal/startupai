import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function getSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );
}

export async function POST(req: NextRequest) {
  try {
    const { secret } = await req.json();
    if (secret !== process.env.PULSE_UPDATE_SECRET) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const supabase = await getSupabase();

    const prompt = `Generate startup ecosystem news as JSON. Return ONLY valid JSON, no markdown.

Format:
{"funding":[{"title":"...","subtitle":"...","value":"...","badge":null,"growth":null},{"title":"...","subtitle":"...","value":"...","badge":null,"growth":null},{"title":"...","subtitle":"...","value":"...","badge":null,"growth":null}],"trending":[{"title":"...","subtitle":"...","value":"...","badge":null,"growth":150},{"title":"...","subtitle":"...","value":"...","badge":null,"growth":200},{"title":"...","subtitle":"...","value":"...","badge":null,"growth":100}],"grants":[{"title":"...","subtitle":"...","value":"...","badge":"Open","growth":null},{"title":"...","subtitle":"...","value":"...","badge":null,"growth":null},{"title":"...","subtitle":"...","value":"...","badge":null,"growth":null}],"top":[{"title":"...","subtitle":"...","value":"...","badge":null,"growth":300},{"title":"...","subtitle":"...","value":"...","badge":null,"growth":180},{"title":"...","subtitle":"...","value":"...","badge":null,"growth":90}],"programs":[{"title":"...","subtitle":"...","value":"...","badge":"Open","growth":null},{"title":"...","subtitle":"...","value":"...","badge":null,"growth":null},{"title":"...","subtitle":"...","value":"...","badge":null,"growth":null}],"news":[{"title":"...","subtitle":"...","value":null,"badge":"Policy","growth":null},{"title":"...","subtitle":"...","value":null,"badge":null,"growth":null},{"title":"...","subtitle":"...","value":null,"badge":"New","growth":null}]}`;

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") throw new Error("Unexpected response type");

    const cleanJson = content.text.replace(/```json\n?|\n?```/g, "").trim();
    const aiResult = JSON.parse(cleanJson);

    await supabase
      .from("pulse_items")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

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
    const supabase = await getSupabase();

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
