import { QuoteWithFigure } from "@/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { HoverCardWrapper } from "./HoverCardWrapper";
import { SourceHoverCard } from "./SourceHoverCard";
import { ProfileHoverCard } from "./ProfileHoverCard";
import { ProfileHeader } from "./ProfileHeader";
import { BookmarkIcon, ShareIcon } from "./assets";

interface QuoteCardProps {
  quote: QuoteWithFigure;
}
export function QuoteCard({ quote }: QuoteCardProps) {
  const figure = quote.figures;

  return (
    <Card className="border-border hover:shadow-lg transition-shadow">
      {/* Header with Avatar and Figure Info */}
      <CardHeader className="flex flex-row items-start gap-4">
        <HoverCardWrapper
          trigger={<ProfileHeader figure={figure} />}
          content={<ProfileHoverCard figure={figure} />}
          contentClassName="w-64"
        />
      </CardHeader>

      {/* Quote Content */}
      <CardContent>
        <blockquote className="flex items-start gap-2">
          <p className="text-lg leading-relaxed text-foreground">
            {quote.text}
          </p>
        </blockquote>
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex items-center justify-between">
        {/* Left side - Copyright notice */}
        {!quote.is_public_domain && (
          <span className="text-xs text-muted-foreground rounded bg-muted px-2 py-1">
            © All rights reserved
          </span>
        )}
        {quote.is_public_domain && <div />}

        {/* Right side - Action buttons */}
        <div className="flex items-center gap-2">
          {/* Info button */}
          {(quote.source_title || quote.source_reference) && (
            <SourceHoverCard
              source_title={quote.source_title}
              source_reference={quote.source_reference}
            />
          )}

          {/* Bookmark button */}
          <button
            className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-accent/10 transition-colors text-muted-foreground hover:text-accent"
            aria-label="Bookmark quote"
          >
            <BookmarkIcon className="w-5 h-5" />
          </button>

          {/* Share button */}
          <button
            className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-accent/10 transition-colors text-muted-foreground hover:text-accent"
            aria-label="Share quote"
          >
            <ShareIcon className="w-5 h-5" />
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}
