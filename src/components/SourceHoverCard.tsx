"use client";

import { HoverCardWrapper } from "./HoverCardWrapper";
import { InfoIcon } from "./assets";

interface SourceHoverCardProps {
  source_title?: string | null;
  source_reference?: string | null;
}

export function SourceHoverCard({
  source_title,
  source_reference,
}: SourceHoverCardProps) {
  if (!source_title && !source_reference) {
    return null;
  }

  return (
    <HoverCardWrapper
      trigger={
        <button
          className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-accent/10 transition-colors text-muted-foreground hover:text-accent"
          aria-label="View source information"
        >
          <InfoIcon />
        </button>
      }
      content={
        <div className="space-y-2">
          {source_title && (
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Source
              </p>
              <p className="text-sm text-foreground">{source_title}</p>
            </div>
          )}

          {source_reference && (
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Reference
              </p>
              <p className="text-sm text-foreground">{source_reference}</p>
            </div>
          )}
        </div>
      }
      contentClassName="w-40"
    />
  );
}
