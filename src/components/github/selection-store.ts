"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CandidateStatus =
  | "new"
  | "reviewed"
  | "contacted"
  | "replied"
  | "interested"
  | "rejected";

export interface Candidate {
  // Core identity (from search results)
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  type?: string;
  // Enriched profile fields (fetched on add)
  name?: string | null;
  bio?: string | null;
  company?: string | null;
  blog?: string | null;
  location?: string | null;
  email?: string | null;
  twitter_username?: string | null;
  public_repos?: number;
  followers?: number;
  following?: number;
  public_gists?: number;
  created_at?: string;
  updated_at?: string;
  // Recruiter metadata
  note?: string;
  status: CandidateStatus;
  statusChangedAt?: number;
  position?: string; // desired/target position (recruiter fills)
  tags?: string[];
  addedAt: number;
  enriched: boolean;
}

interface DuplicateMatch {
  candidate: Candidate;
  reason: string;
  confidence: "high" | "medium" | "low";
}

interface SelectionStore {
  candidates: Candidate[];
  addCandidate: (c: Candidate) => void;
  removeCandidate: (login: string) => void;
  updateCandidate: (login: string, patch: Partial<Candidate>) => void;
  hasCandidate: (login: string) => boolean;
  clearAll: () => void;
  setStatus: (login: string, status: CandidateStatus) => void;
  setNote: (login: string, note: string) => void;
  setPosition: (login: string, position: string) => void;
  findDuplicates: (c: Candidate) => DuplicateMatch[];
  mergeCandidates: (keepLogin: string, mergeLogin: string) => void;
}

export const useSelectionStore = create<SelectionStore>()(
  persist(
    (set, get) => ({
      candidates: [],
      addCandidate: (c) =>
        set((s) => {
          if (s.candidates.some((x) => x.login === c.login)) return s;
          return { candidates: [c, ...s.candidates] };
        }),
      removeCandidate: (login) =>
        set((s) => ({ candidates: s.candidates.filter((x) => x.login !== login) })),
      updateCandidate: (login, patch) =>
        set((s) => ({
          candidates: s.candidates.map((x) =>
            x.login === login ? { ...x, ...patch } : x
          ),
        })),
      hasCandidate: (login) => get().candidates.some((x) => x.login === login),
      clearAll: () => set({ candidates: [] }),
      setStatus: (login, status) =>
        set((s) => ({
          candidates: s.candidates.map((x) =>
            x.login === login ? { ...x, status, statusChangedAt: Date.now() } : x
          ),
        })),
      setNote: (login, note) =>
        set((s) => ({
          candidates: s.candidates.map((x) =>
            x.login === login ? { ...x, note } : x
          ),
        })),
      setPosition: (login, position) =>
        set((s) => ({
          candidates: s.candidates.map((x) =>
            x.login === login ? { ...x, position } : x
          ),
        })),
      findDuplicates: (c) => {
        const existing = get().candidates;
        const matches: DuplicateMatch[] = [];
        const normName = (c.name || "").trim().toLowerCase();
        const cEmail = (c.email || "").trim().toLowerCase();

        for (const ex of existing) {
          if (ex.login === c.login) continue;
          const exName = (ex.name || "").trim().toLowerCase();
          const exEmail = (ex.email || "").trim().toLowerCase();

          if (cEmail && exEmail && cEmail === exEmail) {
            matches.push({ candidate: ex, reason: "Совпадение email", confidence: "high" });
            continue;
          }
          if (normName && exName && normName === exName && normName.length > 3) {
            matches.push({ candidate: ex, reason: "Совпадение имени", confidence: "medium" });
            continue;
          }
          if (normName && ex.bio && ex.bio.toLowerCase().includes(normName) && normName.length > 5) {
            matches.push({ candidate: ex, reason: "Имя найдено в bio", confidence: "low" });
          }
        }
        return matches;
      },
      mergeCandidates: (keepLogin, mergeLogin) =>
        set((s) => {
          const keep = s.candidates.find((x) => x.login === keepLogin);
          const merge = s.candidates.find((x) => x.login === mergeLogin);
          if (!keep || !merge) return s;
          const merged: Candidate = {
            ...keep,
            name: keep.name || merge.name,
            bio: keep.bio || merge.bio,
            company: keep.company || merge.company,
            email: keep.email || merge.email,
            location: keep.location || merge.location,
            blog: keep.blog || merge.blog,
            twitter_username: keep.twitter_username || merge.twitter_username,
            note: [keep.note, merge.note].filter(Boolean).join(" | ") || undefined,
            tags: [...new Set([...(keep.tags || []), ...(merge.tags || [])])],
            position: keep.position || merge.position,
            enriched: keep.enriched || merge.enriched,
          };
          return {
            candidates: s.candidates
              .filter((x) => x.login !== mergeLogin)
              .map((x) => (x.login === keepLogin ? merged : x)),
          };
        }),
    }),
    { name: "gitfind-selection-v1" }
  )
);

export const STATUS_LABELS: Record<CandidateStatus, string> = {
  new: "Новый",
  reviewed: "Просмотрен",
  contacted: "Связались",
  replied: "Ответил",
  interested: "Заинтересован",
  rejected: "Отказ",
};

export const STATUS_COLORS: Record<CandidateStatus, string> = {
  new: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  reviewed: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  contacted: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  replied: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400",
  interested: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  rejected: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
};
