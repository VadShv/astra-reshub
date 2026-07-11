"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ResearchStatus = "not-started" | "in-progress" | "done";

export interface ResearchNotes {
  // Free-text research notes the recruiter writes per service.
  notes: string;
  status: ResearchStatus;
  // Optional key findings the user wants to highlight.
  keyFindings: string;
  // Pricing / limits summary.
  pricing: string;
  // Integration idea for SourcerHub.
  integration: string;
}

interface ResearchStore {
  data: Record<string, ResearchNotes>;
  setNotes: (id: string, patch: Partial<ResearchNotes>) => void;
  reset: (id: string) => void;
}

const DEFAULT: ResearchNotes = {
  notes: "",
  status: "not-started",
  keyFindings: "",
  pricing: "",
  integration: "",
};

export const useResearchStore = create<ResearchStore>()(
  persist(
    (set) => ({
      data: {},
      setNotes: (id, patch) =>
        set((s) => ({
          data: {
            ...s.data,
            [id]: { ...(s.data[id] || DEFAULT), ...patch },
          },
        })),
      reset: (id) =>
        set((s) => {
          const next = { ...s.data };
          delete next[id];
          return { data: next };
        }),
    }),
    { name: "sourcerhub-research-v1" }
  )
);

export const STATUS_LABELS: Record<ResearchStatus, string> = {
  "not-started": "Не начато",
  "in-progress": "В работе",
  done: "Изучено",
};

export const STATUS_COLORS: Record<ResearchStatus, string> = {
  "not-started": "bg-muted text-muted-foreground border-border",
  "in-progress": "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  done: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
};
