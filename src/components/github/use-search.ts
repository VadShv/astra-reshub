"use client";

import * as React from "react";
import { SearchFilters, SearchType } from "@/lib/github";
import { useSearchStore } from "./store";
import type { SearchResult } from "./results-list";

function buildParams(opts: {
  query: string;
  type: SearchType;
  filters: Partial<SearchFilters>;
  page: number;
  perPage: number;
}): URLSearchParams {
  const params = new URLSearchParams();
  params.set("type", opts.type);
  params.set("q", opts.query);
  params.set("page", String(opts.page));
  params.set("perPage", String(opts.perPage));
  const f = opts.filters;
  const set = (key: string, val?: string) => {
    if (val !== undefined && val !== "" && val !== null && val !== "__any") {
      params.set(key, val);
    }
  };
  set("language", f.language);
  set("starsMin", f.starsMin);
  set("starsMax", f.starsMax);
  set("forksMin", f.forksMin);
  set("forksMax", f.forksMax);
  set("sizeMin", f.sizeMin);
  set("sizeMax", f.sizeMax);
  set("createdAfter", f.createdAfter);
  set("createdBefore", f.createdBefore);
  set("pushedAfter", f.pushedAfter);
  set("pushedBefore", f.pushedBefore);
  set("license", f.license);
  set("topics", f.topics);
  set("userLocation", f.userLocation);
  set("followersMinUser", f.followersMinUser);
  set("reposMin", f.reposMin);
  set("repoUser", f.repoUser);
  set("org", f.org);
  set("isFork", f.isFork as any);
  set("isArchived", f.isArchived as any);
  set("state", f.state as any);
  set("sort", f.sort);
  set("order", f.order);
  if (f.hasIssues) params.set("hasIssues", "true");
  if (f.hasTopics) params.set("hasTopics", "true");
  if (f.hasWiki) params.set("hasWiki", "true");
  if (f.hasOpenIssues) params.set("hasOpenIssues", "true");
  return params;
}

export interface UseSearchArgs {
  enabled: boolean;
}

export function useGitHubSearch({ enabled }: UseSearchArgs) {
  const { query, type, filters, page, perPage, addHistory, githubToken } =
    useSearchStore();
  const [result, setResult] = React.useState<SearchResult | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [trigger, setTrigger] = React.useState(0);

  // The "active" search params — only updates when user commits a search.
  const [active, setActive] = React.useState<{
    query: string;
    type: SearchType;
    filters: Partial<SearchFilters>;
    page: number;
    perPage: number;
  } | null>(null);

  const runSearch = React.useCallback(
    (overrides?: { page?: number }) => {
      // Read fresh state directly from the store to avoid stale-closure issues
      // when runSearch is called immediately after setQuery/setType in the
      // same tick (e.g. clicking a suggestion chip).
      const s = useSearchStore.getState();
      const q = s.query.trim();
      if (!q) return;
      const next = {
        query: q,
        type: s.type,
        filters: { ...s.filters },
        page: overrides?.page ?? 1,
        perPage: s.perPage,
      };
      setActive(next);
      setTrigger((t) => t + 1);
    },
    []
  );

  React.useEffect(() => {
    if (!active || !enabled) return;
    let cancelled = false;
    const controller = new AbortController();

    const doFetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = buildParams(active);
        const headers: Record<string, string> = {};
        if (githubToken) headers["x-github-token"] = githubToken;
        const res = await fetch(`/api/github/search?${params.toString()}`, {
          signal: controller.signal,
          headers,
        });
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(data?.error || `Ошибка запроса (${res.status})`);
          setResult(null);
        } else {
          setResult(data);
          addHistory({
            query: active.query,
            type: active.type,
            filters: active.filters,
          });
        }
      } catch (e: any) {
        if (cancelled || e?.name === "AbortError") return;
        setError("Сетевая ошибка. Проверьте подключение и повторите.");
        setResult(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    doFetch();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [trigger, enabled]);

  const changePage = React.useCallback(
    (p: number) => {
      if (!active) return;
      const next = { ...active, page: p };
      setActive(next);
      setTrigger((t) => t + 1);
    },
    [active]
  );

  // Reset back to the Hero/presets landing page: clears the active search,
  // results, and the search form state.
  const resetSearch = React.useCallback(() => {
    setActive(null);
    setResult(null);
    setError(null);
    setLoading(false);
    useSearchStore.getState().setQuery("");
    useSearchStore.getState().resetFilters();
  }, []);

  return {
    result,
    loading,
    error,
    active,
    runSearch,
    changePage,
    retry: () => setTrigger((t) => t + 1),
    resetSearch,
  };
}
