import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

type QuoteFeedRow = {
  quote_id: string;
  text: string;
  source_title: string | null;
  source_reference: string | null;
  surfaced_at: string | null;
  created_at: string;
  figure_id: string;
  figure_slug: string;
  figure_display_name: string;
  figure_avatar_url: string | null;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const limit = Number(searchParams.get("limit") ?? 20);
  const cursorSurfacedAt = searchParams.get("cursor_surfaced_at");
  const cursorId = searchParams.get("cursor_id");

  const { data, error } = await supabase
    .rpc("get_quote_feed", {
      limit_count: limit,
      cursor_surfaced_at: cursorSurfacedAt,
      cursor_id: cursorId,
    })
    .returns<QuoteFeedRow[]>();

  if (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  const items = data ?? [];

  // Build next cursor from last item (if any)
  const last = items[items.length - 1];
  const nextCursor =
    last && last.surfaced_at
      ? {
          cursor_surfaced_at: last.surfaced_at,
          cursor_id: last.quote_id,
        }
      : null;

  return NextResponse.json({
    items,
    nextCursor,
  });
}
