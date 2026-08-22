"use client";

import * as React from "react";
import { Lightbulb, ExternalLink, Trash2 } from "lucide-react";
import { CollapsibleSection } from "./collapsible-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useSuggestedToolsStore,
  TOOL_CATEGORIES,
} from "./suggested-tools-store";

function categoryLabel(value: string): string {
  return TOOL_CATEGORIES.find((c) => c.value === value)?.label || "Другое";
}

function formatDate(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function SuggestedToolsSection() {
  const tools = useSuggestedToolsStore((s) => s.tools);
  const removeTool = useSuggestedToolsStore((s) => s.removeTool);

  if (tools.length === 0) return null;

  return (
    <div className="mt-8">
      <CollapsibleSection
        icon={<Lightbulb className="h-5 w-5" />}
        iconAccent="from-amber-500 to-yellow-600"
        title="Предложенные инструменты"
        subtitle="Инструменты, предложенные пользователями"
        count={tools.length}
        defaultOpen={true}
      >
        <div className="grid gap-3">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="flex flex-col sm:flex-row sm:items-start gap-3 rounded-lg border bg-card p-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm">{tool.name}</span>
                  <Badge variant="secondary" className="text-[10px]">
                    {categoryLabel(tool.category)}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">
                    {formatDate(tool.createdAt)}
                  </span>
                </div>
                {tool.description && (
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    {tool.description}
                  </p>
                )}
                {tool.contact && (
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    От: {tool.contact}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  asChild
                >
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-3.5 w-3.5 mr-1" />
                    Открыть
                  </a>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeTool(tool.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleSection>
    </div>
  );
}
