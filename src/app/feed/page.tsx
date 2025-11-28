import { FeedClient } from "@/components/FeedClient";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

export const metadata = {
  title: "Feed | Quote Me Up",
  description: "Discover quotes from notable figures",
};

type FeedItem = {
  quote_id: string;
  text: string;
  source_title: string | null;
  source_reference: string | null;
  surfaced_at: string | null;
  created_at: string;
  figure_slug: string;
  figure_display_name: string;
  figure_avatar_url: string | null;
};

async function getInitialFeedItems() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

  const { data, error } = await supabase
    .rpc("get_quote_feed", {
      limit_count: 20,
      cursor_surfaced_at: null,
      cursor_id: null,
    })
    .returns<FeedItem[]>();

  if (error) {
    console.error("Error fetching feed:", error);
    return { items: [], nextCursor: null };
  }

  const items = data ?? [];
  const last = items[items.length - 1];
  const nextCursor =
    last && last.surfaced_at
      ? {
          cursor_surfaced_at: last.surfaced_at,
          cursor_id: last.quote_id,
        }
      : null;

  return { items, nextCursor };
}

export default async function FeedPage() {
  const { items, nextCursor } = await getInitialFeedItems();

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
        <FeedClient initialItems={items} initialNextCursor={nextCursor} />
      </div>
    </main>
  );
}
