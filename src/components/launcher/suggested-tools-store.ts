"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SuggestedTool {
  id: string;
  name: string;
  url: string;
  category: string;
  description: string;
  contact: string;
  createdAt: number;
}

export const TOOL_CATEGORIES: { value: string; label: string }[] = [
  { value: "code", label: "Хостинг кода" },
  { value: "qa", label: "Q&A" },
  { value: "community", label: "Сообщество" },
  { value: "jobs", label: "Джобборд" },
  { value: "articles", label: "Статьи" },
  { value: "other", label: "Другое" },
];

interface SuggestedToolsStore {
  tools: SuggestedTool[];
  addTool: (tool: Omit<SuggestedTool, "id" | "createdAt">) => void;
  removeTool: (id: string) => void;
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const useSuggestedToolsStore = create<SuggestedToolsStore>()(
  persist(
    (set) => ({
      tools: [],
      addTool: (tool) =>
        set((s) => ({
          tools: [
            { ...tool, id: uid(), createdAt: Date.now() },
            ...s.tools,
          ],
        })),
      removeTool: (id) =>
        set((s) => ({ tools: s.tools.filter((t) => t.id !== id) })),
    }),
    { name: "sourcerhub-suggested-tools-v1" }
  )
);
