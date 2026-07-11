"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CollapsibleSectionProps {
  icon: React.ReactNode;
  iconAccent?: string; // tailwind gradient classes for the icon tile
  title: string;
  subtitle: string;
  count?: number | string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

/**
 * A reusable collapsible launcher section: a beautiful header "plaque" that
 * expands/collapses its body. All launcher sections (Aggregators, Communities,
 * Research) are collapsed by default to keep the launcher scannable.
 */
export function CollapsibleSection({
  icon,
  iconAccent,
  title,
  subtitle,
  count,
  children,
  defaultOpen = false,
}: CollapsibleSectionProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <section className="mt-10">
      {/* Header plaque (click to toggle) */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="group relative w-full text-left rounded-2xl border bg-card/80 backdrop-blur p-4 hover:border-primary/40 hover:shadow-md transition-all overflow-hidden"
      >
        {/* Subtle accent glow on hover */}
        <div
          className={cn(
            "absolute -top-10 -right-10 h-28 w-28 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity",
            iconAccent ? `bg-gradient-to-br ${iconAccent}` : "bg-primary"
          )}
        />

        <div className="relative flex items-center gap-3">
          {/* Icon tile */}
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md shrink-0",
              iconAccent ? `bg-gradient-to-br ${iconAccent}` : "bg-foreground"
            )}
          >
            {icon}
          </div>

          {/* Title + subtitle */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold tracking-tight leading-tight">
                {title}
              </h2>
              {count !== undefined && count !== null && (
                <Badge variant="secondary" className="text-[10px] h-5">
                  {count}
                </Badge>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug mt-0.5 line-clamp-1">
              {subtitle}
            </p>
          </div>

          {/* Chevron */}
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full border bg-background text-muted-foreground shrink-0 transition-all",
              "group-hover:text-primary group-hover:border-primary/40",
              open && "rotate-180 bg-primary/10 text-primary border-primary/30"
            )}
          >
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </button>

      {/* Collapsible body */}
      {open && (
        <div className="mt-4 animate-in fade-in-0 slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </section>
  );
}
