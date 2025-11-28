"use client";

import { useEffect, useRef, useState } from "react";
import { QuoteCard } from "./QuoteCard";
import { getInitials } from "@/lib/initials";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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

interface FeedClientProps {
  initialItems: FeedItem[];
  initialNextCursor: { cursor_surfaced_at: string; cursor_id: string } | null;
}

async function fetchFeedPage(cursor?: {
  cursor_surfaced_at: string;
  cursor_id: string;
}) {
  const params = new URLSearchParams();
  params.set("limit", "20");
  if (cursor) {
    params.set("cursor_surfaced_at", cursor.cursor_surfaced_at);
    params.set("cursor_id", cursor.cursor_id);
  }

  const res = await fetch(`/api/feed?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to load feed");
  return res.json() as Promise<{
    items: FeedItem[];
    nextCursor: { cursor_surfaced_at: string; cursor_id: string } | null;
  }>;
}

function FeedItemCard({ item }: { item: FeedItem }) {
  return (
    <Card className="border-border hover:shadow-lg transition-shadow">
      {/* Header with Avatar and Figure Info */}
      <CardHeader className="flex flex-row items-start gap-4">
        <HoverCardWrapper
          trigger={
            <div className="flex items-center gap-3 flex-1 cursor-pointer">
              <Avatar className="h-10 w-10 shrink-0">
                {item.figure_avatar_url && (
                  <AvatarImage
                    src={item.figure_avatar_url}
                    alt={item.figure_display_name}
                  />
                )}
                <AvatarFallback className="text-sm font-semibold">
                  {getInitials(item.figure_display_name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground text-sm">
                  {item.figure_display_name}
                </p>
              </div>
            </div>
          }
          content={
            <div className="space-y-2">
              <div>
                <Avatar className="h-16 w-16">
                  {item.figure_avatar_url && (
                    <AvatarImage
                      src={item.figure_avatar_url}
                      alt={item.figure_display_name}
                    />
                  )}
                  <AvatarFallback className="text-lg font-semibold">
                    {getInitials(item.figure_display_name)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  {item.figure_display_name}
                </p>
              </div>
              <a
                href={`/figures/${item.figure_slug}`}
                className="text-sm text-primary hover:underline inline-block"
              >
                View profile
              </a>
            </div>
          }
          contentClassName="w-64"
        />
      </CardHeader>

      {/* Quote Content */}
      <CardContent>
        <blockquote className="flex items-start gap-2">
          <p className="text-lg leading-relaxed text-foreground">
            {item.text}
          </p>
        </blockquote>
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex items-center justify-between">
        {/* Left side - Empty space */}
        <div />

        {/* Right side - Action buttons */}
        <div className="flex items-center gap-2">
          {/* Info button */}
          {(item.source_title || item.source_reference) && (
            <SourceHoverCard
              source_title={item.source_title}
              source_reference={item.source_reference}
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

export function FeedClient({
  initialItems,
  initialNextCursor,
}: FeedClientProps) {
  const [items, setItems] = useState<FeedItem[]>(initialItems);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && nextCursor && !isLoading && !hasError) {
          setIsLoading(true);
          try {
            const response = await fetchFeedPage(nextCursor);
            // Filter out duplicates that may exist at page boundaries
            const existingIds = new Set(items.map((item) => item.quote_id));
            const newItems = response.items.filter(
              (item) => !existingIds.has(item.quote_id)
            );
            setItems((prev) => [...prev, ...newItems]);
            setNextCursor(response.nextCursor);
          } catch (error) {
            console.error("Failed to load more items:", error);
            setHasError(true);
          } finally {
            setIsLoading(false);
          }
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [nextCursor, isLoading, hasError, items]);

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-muted p-8 text-center">
        <p className="text-muted-foreground">No quotes available yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-6">
        {items.map((item, index) => (
          <FeedItemCard key={`${item.quote_id}-${index}`} item={item} />
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      {nextCursor && (
        <div ref={sentinelRef} className="mt-8 h-4">
          {isLoading && (
            <div className="text-center text-muted-foreground">
              Loading more quotes...
            </div>
          )}
          {hasError && (
            <div className="text-center text-destructive">
              Failed to load more quotes
            </div>
          )}
        </div>
      )}
    </div>
  );
}
