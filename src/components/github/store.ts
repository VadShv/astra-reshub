"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SearchFilters, SearchType } from "@/lib/github";

export interface HistoryEntry {
  id: string;
  query: string;
  type: SearchType;
  filters: Partial<SearchFilters>;
  ts: number;
}

export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  type: SearchType;
  filters: Partial<SearchFilters>;
  ts: number;
}

const DEFAULT_FILTERS: Partial<SearchFilters> = {
  sort: "best-match",
  order: "desc",
};

interface SearchStore {
  query: string;
  type: SearchType;
  filters: Partial<SearchFilters>;
  page: number;
  perPage: number;
  history: HistoryEntry[];
  saved: SavedSearch[];
  githubToken: string;

  setQuery: (q: string) => void;
  setType: (t: SearchType) => void;
  setFilter: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K] | undefined) => void;
  setFilters: (f: Partial<SearchFilters>) => void;
  setPage: (p: number) => void;
  setPerPage: (n: number) => void;
  resetFilters: () => void;
  setGithubToken: (t: string) => void;

  addHistory: (entry: Omit<HistoryEntry, "id" | "ts">) => void;
  clearHistory: () => void;
  removeHistory: (id: string) => void;

  saveSearch: (name: string) => void;
  removeSaved: (id: string) => void;
  applyEntry: (entry: { query: string; type: SearchType; filters: Partial<SearchFilters> }) => void;
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const useSearchStore = create<SearchStore>()(
  persist(
    (set, get) => ({
      query: "",
      type: "repositories",
      filters: { ...DEFAULT_FILTERS },
      page: 1,
      perPage: 30,
      history: [],
      saved: [],
      githubToken: "",

      setQuery: (q) => set({ query: q }),
      setType: (t) =>
        set({
          type: t,
          page: 1,
          filters: { ...DEFAULT_FILTERS },
        }),
      setFilter: (key, value) =>
        set((s) => ({
          filters: { ...s.filters, [key]: value },
          page: 1,
        })),
      setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f }, page: 1 })),
      setPage: (p) => set({ page: p }),
      setPerPage: (n) => set({ perPage: n, page: 1 }),
      resetFilters: () => set({ filters: { ...DEFAULT_FILTERS }, page: 1 }),
      setGithubToken: (t) => set({ githubToken: t.trim() }),

      addHistory: (entry) =>
        set((s) => {
          const item: HistoryEntry = { ...entry, id: uid(), ts: Date.now() };
          const filtered = s.history.filter(
            (h) => !(h.query === entry.query && h.type === entry.type)
          );
          return { history: [item, ...filtered].slice(0, 20) };
        }),
      clearHistory: () => set({ history: [] }),
      removeHistory: (id) =>
        set((s) => ({ history: s.history.filter((h) => h.id !== id) })),

      saveSearch: (name) => {
        const s = get();
        const item: SavedSearch = {
          id: uid(),
          name: name || s.query || "Без названия",
          query: s.query,
          type: s.type,
          filters: { ...s.filters },
          ts: Date.now(),
        };
        set((st) => ({ saved: [item, ...st.saved].slice(0, 50) }));
      },
      removeSaved: (id) =>
        set((s) => ({ saved: s.saved.filter((x) => x.id !== id) })),

      applyEntry: (entry) =>
        set({
          query: entry.query,
          type: entry.type,
          filters: { ...DEFAULT_FILTERS, ...entry.filters },
          page: 1,
        }),
    }),
    {
      name: "gitfind-store-v1",
      partialize: (s) => ({
        history: s.history,
        saved: s.saved,
        type: s.type,
        perPage: s.perPage,
        githubToken: s.githubToken,
      }),
    }
  )
);
