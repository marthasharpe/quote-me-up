"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface HoverCardWrapperProps {
  trigger: ReactNode;
  content: ReactNode;
  onTriggerClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  triggerClassName?: string;
  contentClassName?: string;
}

export function HoverCardWrapper({
  trigger,
  content,
  onTriggerClick,
  triggerClassName = "",
  contentClassName = "",
}: HoverCardWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect if this device actually supports hover (desktop)
  const canHover =
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover)").matches;

  const handleTriggerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onTriggerClick?.(e);

    // Mobile behavior: toggle open state
    if (!canHover) {
      setIsOpen((prev) => !prev);
    }
  };

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (
        containerRef.current &&
        target &&
        !containerRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown, true);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={() => canHover && setIsOpen(true)}
      onMouseLeave={() => canHover && setIsOpen(false)}
    >
      <div onClick={handleTriggerClick} className={triggerClassName}>
        {trigger}
      </div>

      {isOpen && (
        <Card
          className={`absolute top-full left-0 z-50 ${contentClassName}`}
          onClick={(e) => e.stopPropagation()}
        >
          <CardContent>{content}</CardContent>
        </Card>
      )}
    </div>
  );
}
