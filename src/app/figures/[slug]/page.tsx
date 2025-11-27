import { supabase } from "@/lib/supabase";
import { QuoteWithFigure } from "@/types";
import { QuoteCard } from "@/components/QuoteCard";
import { getInitials } from "@/lib/initials";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ProfilePageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getFigureData(slug: string) {
  const { data: figure, error: figureError } = await supabase
    .from("figures")
    .select("*")
    .eq("slug", slug)
    .single();

  if (figureError || !figure) {
    return { figure: null, quotes: [] };
  }

  const { data: quotes, error: quotesError } = await supabase
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
    .eq("figure_id", figure.id)
    .order("created_at", { ascending: false });

  if (quotesError) {
    console.error("Error fetching quotes:", quotesError);
    return { figure, quotes: [] };
  }

  return { figure, quotes: quotes as QuoteWithFigure[] };
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const { slug } = await params;
  const { figure } = await getFigureData(slug);

  return {
    title: figure
      ? `${figure.display_name} | Quote Me Up`
      : "Profile | Quote Me Up",
    description: figure?.bio || "View quotes from this figure",
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { slug } = await params;
  const { figure, quotes } = await getFigureData(slug);

  if (!figure) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 text-center">
          <h1 className="text-3xl font-bold text-foreground">
            Profile not found
          </h1>
          <p className="text-muted-foreground mt-2">
            The figure you're looking for doesn't exist.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Profile Header */}
        <div className="mb-12 rounded-lg border border-border bg-card p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
            {/* Avatar */}
            <div className="shrink-0">
              <Avatar className="h-32 w-32 sm:h-40 sm:w-40">
                {figure.avatar_url && (
                  <AvatarImage
                    src={figure.avatar_url}
                    alt={figure.display_name}
                  />
                )}
                <AvatarFallback className="text-2xl sm:text-3xl font-semibold">
                  {getInitials(figure.display_name)}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Profile Info */}
            <div className="grow">
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-2">
                {figure.display_name}
              </h1>

              {figure.short_label && (
                <p className="text-lg text-primary mb-4">
                  {figure.short_label}
                </p>
              )}

              {figure.era && (
                <p className="text-sm text-muted-foreground mb-4">
                  <span className="font-medium">Era:</span> {figure.era}
                </p>
              )}

              {figure.category && (
                <p className="text-sm text-muted-foreground mb-4">
                  <span className="font-medium">Category:</span>{" "}
                  {figure.category}
                </p>
              )}

              {figure.bio && (
                <p className="text-base leading-relaxed text-foreground">
                  {figure.bio}
                </p>
              )}

              {/* Quote count */}
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {quotes.length}
                  </span>{" "}
                  quote{quotes.length !== 1 ? "s" : ""} collected
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quotes Section */}
        {quotes.length === 0 ? (
          <div className="rounded-lg border border-border bg-muted p-8 text-center">
            <p className="text-muted-foreground">
              No quotes available for this figure yet.
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Quotes</h2>
            <div className="space-y-6">
              {quotes.map((quote) => (
                <QuoteCard key={quote.id} quote={quote} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
