import { supabase } from "@/lib/supabase";
import { QuoteWithFigure } from "@/types";
import { QuoteCard } from "@/components/QuoteCard";

export const metadata = {
  title: "Feed | Quote Me Up",
  description: "Discover quotes from notable figures",
};

async function getQuotes(): Promise<QuoteWithFigure[]> {
  const { data, error } = await supabase
    .from("quotes")
    .select(
      `
      id,
      text,
      source_title,
      source_reference,
      language,
      is_public_domain,
      created_at,
      figure_id,
      figures (
        id,
        slug,
        display_name,
        short_label,
        avatar_url,
        era,
        category,
        bio,
        created_at
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching quotes:", error);
    return [];
  }
  const quoteList = data as QuoteWithFigure[];

  // Shuffle the quotes for random ordering
  return quoteList.sort(() => Math.random() - 0.5);
}

export default async function FeedPage() {
  const quotes = await getQuotes();

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
        {quotes.length === 0 ? (
          <div className="rounded-lg border border-border bg-muted p-8 text-center">
            <p className="text-muted-foreground">No quotes available yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {quotes.map((quote) => (
              <QuoteCard key={quote.id} quote={quote} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
