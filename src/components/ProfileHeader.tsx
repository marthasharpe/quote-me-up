"use client";

import { Figure } from "@/types";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getInitials } from "@/lib/initials";

interface ProfileHeaderProps {
  figure: Figure;
}

export function ProfileHeader({ figure }: ProfileHeaderProps) {
  return (
    <Link
      href={`/figures/${figure.slug}`}
      className="flex items-center gap-3 flex-1"
    >
      <Avatar className="h-12 w-12 shrink-0">
        {figure.avatar_url && (
          <AvatarImage src={figure.avatar_url} alt={figure.display_name} />
        )}
        <AvatarFallback className="font-semibold text-xs">
          {getInitials(figure.display_name)}
        </AvatarFallback>
      </Avatar>
      <div className="grow">
        <div className="font-semibold text-primary hover:text-accent transition-colors">
          {figure.slug}
        </div>
        {figure.short_label && (
          <p className="text-sm text-muted-foreground">{figure.short_label}</p>
        )}
      </div>
    </Link>
  );
}
