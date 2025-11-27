"use client";

import { Figure } from "@/types";
import Link from "next/link";
import Image from "next/image";

interface ProfileHoverCardProps {
  figure: Figure;
}

export function ProfileHoverCard({ figure }: ProfileHoverCardProps) {
  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        {figure.avatar_url && (
          <Image
            src={figure.avatar_url}
            alt={figure.display_name}
            width={40}
            height={40}
            className="rounded-full object-cover shrink-0"
          />
        )}
        <div className="space-y-1">
          <h3 className="font-semibold text-foreground text-sm">
            {figure.display_name}
          </h3>
          {figure.era && (
            <p className="text-xs text-muted-foreground">{figure.era}</p>
          )}
        </div>
      </div>

      {figure.bio && (
        <p className="text-xs text-muted-foreground line-clamp-3">
          {figure.bio}
        </p>
      )}

      <Link
        href={`/figures/${figure.slug}`}
        className="inline-block text-xs font-medium text-accent hover:text-primary transition-colors"
      >
        View full profile →
      </Link>
    </div>
  );
}
