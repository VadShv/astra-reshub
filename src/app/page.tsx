"use client";

import * as React from "react";
import Link from "next/link";
import {
  Github,
  Heart,
  Gauge,
  SlidersHorizontal,
  X,
  Bookmark,
  History,
  Star,
  Zap,
  ShieldCheck,
  Code2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchHeader } from "@/components/github/search-header";
import { FilterPanel } from "@/components/github/filter-panel";
import { ResultsList, SearchResult } from "@/components/github/results-list";
import { Hero } from "@/components/github/hero";
import { HistorySavedPanel } from "@/components/github/history-panel";
import { SettingsDialog } from "@/components/github/settings-dialog";
import { useSearchStore } from "@/components/github/store";
import { useGitHubSearch } from "@/components/github/use-search";
import { SearchType } from "@/lib/github";

export default function Home() {
  const { type, filters, perPage, setPerPage, resetFilters, saveSearch, query } =
    useSearchStore();
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);
  const [mobileSideOpen, setMobileSideOpen] = React.useState(false);

  const { result, loading, error, active, runSearch, changePage, retry } =
    useGitHubSearch({ enabled: true });

  const hasSearched = active !== null;

  const handleSearch = React.useCallback(
    (q?: string, t?: SearchType) => {
      // q/t come from hero picks; if provided, the store is already updated.
      runSearch();
    },
    [runSearch]
  );

  const rateLimit = result?.rateLimit;

  const activeFilterCount = React.useMemo(() => {
    const keys = [
      "language", "starsMin", "starsMax", "forksMin", "forksMax",
      "sizeMin", "sizeMax", "createdAfter", "createdBefore",
      "pushedAfter", "pushedBefore", "license", "topics",
      "repoUser", "org", "isFork", "isArchived", "hasIssues",
      "hasTopics", "hasWiki", "hasOpenIssues", "state",
      "userLocation", "followersMinUser", "reposMin",
    ] as const;
    return keys.filter((k) => {
      const v = (filters as any)[k];
      return v !== undefined && v !== "" && v !== null;
    }).length;
  }, [filters]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ----------------------------- Header ----------------------------- */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center gap-3 h-14">
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background group-hover:scale-105 transition-transform">
                <Github className="h-4.5 w-4.5" />
              </div>
              <div className="hidden sm:block leading-none">
                <span className="font-bold text-base tracking-tight">GitFind</span>
                <span className="block text-[10px] text-muted-foreground mt-0.5">
                  advanced github search
                </span>
              </div>
            </Link>

            <div className="flex-1 max-w-2xl">
              <SearchHeader
                onSearch={() => handleSearch()}
                loading={loading}
                onOpenMobileFilters={() => setMobileFiltersOpen(true)}
                activeCount={activeFilterCount}
              />
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {rateLimit && (
                <RateLimitBadge remaining={rateLimit.remaining} limit={rateLimit.limit} />
              )}
              <SettingsDialog />
              <Button
                variant="outline"
                size="sm"
                className="hidden md:inline-flex h-9"
                onClick={() => {
                  if (!query) {
                    toast.warning("Введите запрос для сохранения");
                    return;
                  }
                  saveSearch(query);
                  toast.success("Запрос сохранён");
                }}
              >
                <Bookmark className="h-3.5 w-3.5 mr-1.5" />
                Сохранить
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* ------------------------------ Main ------------------------------ */}
      <main className="flex-1">
        {!hasSearched ? (
          <Hero onSearch={handleSearch} />
        ) : (
          <div className="mx-auto max-w-7xl px-4 py-5">
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[280px_1fr_260px] gap-5">
              {/* Filters sidebar (desktop) */}
              <aside className="hidden lg:block">
                <div className="sticky top-[7.5rem] max-h-[calc(100vh-8.5rem)] rounded-xl border bg-card/50 p-3">
                  <FilterPanel />
                </div>
              </aside>

              {/* Results */}
              <section className="min-w-0">
                <Toolbar
                  total={result?.total_count}
                  loading={loading}
                  perPage={perPage}
                  onPerPageChange={setPerPage}
                  onRetry={retry}
                  onOpenHistory={() => setMobileSideOpen(true)}
                />
                <ResultsList
                  type={active?.type || type}
                  loading={loading}
                  result={result}
                  error={error}
                  page={active?.page || 1}
                  perPage={perPage}
                  onPageChange={changePage}
                  onRetry={retry}
                />
              </section>

              {/* History & saved (desktop xl) */}
              <aside className="hidden xl:block">
                <div className="sticky top-[7.5rem] max-h-[calc(100vh-8.5rem)] rounded-xl border bg-card/50 p-3 overflow-hidden">
                  <HistorySavedPanel onApply={() => runSearch()} />
                </div>
              </aside>
            </div>
          </div>
        )}
      </main>

      {/* ----------------------------- Footer ----------------------------- */}
      <footer className="mt-auto border-t bg-card/40">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-foreground text-background">
                <Github className="h-3.5 w-3.5" />
              </div>
              <span>
                <span className="font-semibold text-foreground">GitFind</span> — продвинутый
                поиск по GitHub
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                Через официальный GitHub API
              </span>
              <span className="flex items-center gap-1">
                Сделано с <Heart className="h-3 w-3 text-rose-500 fill-rose-500" /> на Next.js
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* ----------------------- Mobile filter sheet ---------------------- */}
      <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <SheetContent side="left" className="w-[90%] sm:w-[380px] overflow-y-auto p-0">
          <SheetHeader className="px-4 pt-4 pb-2 border-b">
            <SheetTitle className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Фильтры поиска
            </SheetTitle>
          </SheetHeader>
          <div className="p-4">
            <FilterPanel
              className="!block"
              onAfterChange={() => {
                /* live update; search re-runs on demand */
              }}
            />
            <Separator className="my-4" />
            <Button
              className="w-full"
              onClick={() => {
                setMobileFiltersOpen(false);
                runSearch();
              }}
            >
              Применить и найти
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* ----------------------- Mobile history sheet --------------------- */}
      <Sheet open={mobileSideOpen} onOpenChange={setMobileSideOpen}>
        <SheetContent side="right" className="w-[90%] sm:w-[380px] overflow-y-auto p-0">
          <SheetHeader className="px-4 pt-4 pb-2 border-b">
            <SheetTitle className="flex items-center gap-2">
              <History className="h-4 w-4" />
              История и закладки
            </SheetTitle>
          </SheetHeader>
          <div className="p-4">
            <HistorySavedPanel
              onApply={() => {
                setMobileSideOpen(false);
                runSearch();
              }}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function RateLimitBadge({ remaining, limit }: { remaining: number; limit: number }) {
  const pct = limit > 0 ? remaining / limit : 0;
  const color =
    pct > 0.5 ? "text-emerald-500" : pct > 0.2 ? "text-amber-500" : "text-rose-500";
  return (
    <Badge
      variant="outline"
      className="hidden md:inline-flex items-center gap-1.5 h-7 px-2 text-[11px] font-mono"
      title={`Осталось запросов к GitHub API: ${remaining}/${limit}`}
    >
      <Gauge className={`h-3 w-3 ${color}`} />
      <span className={color}>{remaining}</span>
      <span className="text-muted-foreground">/ {limit}</span>
    </Badge>
  );
}

function Toolbar({
  total,
  loading,
  perPage,
  onPerPageChange,
  onRetry,
  onOpenHistory,
}: {
  total?: number;
  loading: boolean;
  perPage: number;
  onPerPageChange: (n: number) => void;
  onRetry: () => void;
  onOpenHistory: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
      <div className="text-sm text-muted-foreground">
        {loading ? (
          <span className="flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 animate-pulse text-primary" />
            Поиск...
          </span>
        ) : total !== undefined ? (
          <>
            Найдено{" "}
            <span className="font-semibold text-foreground">
              {total > 1000 ? "1000+" : total.toLocaleString("ru-RU")}
            </span>{" "}
            результатов
          </>
        ) : (
          "Готов к поиску"
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="xl:hidden h-8"
          onClick={onOpenHistory}
        >
          <History className="h-3.5 w-3.5 mr-1.5" />
          История
        </Button>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>На странице:</span>
          <Select value={String(perPage)} onValueChange={(v) => onPerPageChange(Number(v))}>
            <SelectTrigger className="h-8 w-[70px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="30">30</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
