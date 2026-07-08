"use client";

import * as React from "react";
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SearchType } from "@/lib/github";
import { useSearchStore } from "./store";

const TYPE_TABS: { value: SearchType; label: string; icon: React.ReactNode }[] = [
  { value: "repositories", label: "Репозитории", icon: <RepoIcon /> },
  { value: "users", label: "Пользователи", icon: <UserIcon /> },
  { value: "code", label: "Код", icon: <CodeIcon /> },
  { value: "issues", label: "Issues", icon: <IssueIcon /> },
  { value: "commits", label: "Коммиты", icon: <CommitIcon /> },
  { value: "topics", label: "Темы", icon: <TagIcon /> },
];

function RepoIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
      <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 010-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
      <path d="M5.5 3.5a2 2 0 11-4 0 2 2 0 014 0zM8 8a3 3 0 11-6 0 3 3 0 016 0zm5.5-4.5a2 2 0 11-4 0 2 2 0 014 0zM16 8a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
function CodeIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
      <path d="M4.72 3.22a.75.75 0 011.06 1.06L2.06 8l3.72 3.72a.75.75 0 11-1.06 1.06L.47 8.53a.75.75 0 010-1.06l4.25-4.25zm6.56 0a.75.75 0 10-1.06 1.06L13.94 8l-3.72 3.72a.75.75 0 101.06 1.06l4.25-4.25a.75.75 0 000-1.06l-4.25-4.25z" />
    </svg>
  );
}
function IssueIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
      <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
      <path d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z" />
    </svg>
  );
}
function CommitIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
      <path d="M10.5 7.75a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm1.44.5a4 4 0 00-2.7-3.16L9.5 4.5 9 5l.06 1.06a4 4 0 011.39.39l.05.06a2.5 2.5 0 010 1.49l-.05.06a4 4 0 01-1.39.39L9 10l.5.5-.26.59a4 4 0 002.7-3.34L12 8l-.06-.75z" />
    </svg>
  );
}
function TagIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
      <path d="M2.5 7.775V2.75a.25.25 0 01.25-.25h5.025a.25.25 0 01.177.073l6.25 6.25a.25.25 0 010 .354l-5.025 5.025a.25.25 0 01-.354 0l-6.25-6.25a.25.25 0 01-.073-.177zm-1.5 0V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 010 2.474L9.237 15.487A1.75 1.75 0 018 16a1.75 1.75 0 01-1.237-.513l-6.25-6.25A1.75 1.75 0 011 7.775zM6 5a1 1 0 100-2 1 1 0 000 2z" />
    </svg>
  );
}

export { TYPE_TABS };

/**
 * The search input + submit button row. Designed to live on the top row of a
 * two-row header so it never collides with the type tabs below it.
 */
export function SearchInput({
  onSearch,
  loading,
  onOpenMobileFilters,
  activeCount,
}: {
  onSearch: () => void;
  loading: boolean;
  onOpenMobileFilters?: () => void;
  activeCount?: number;
}) {
  const { query, setQuery, type } = useSearchStore();
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  // Friendly, context-aware placeholder so the search feels approachable.
  const placeholders: Record<string, string> = {
    repositories: "Например: react dashboard  ·  или language:rust stars:>1000",
    users: "Например: python разработчик  ·  или location:Moscow language:go",
    code: "Например: useEffect  ·  или useState in:file language:typescript",
    issues: "Например: memory leak  ·  или is:open label:bug",
    commits: "Например: fix parser  ·  или author:torvalds",
    topics: "Например: machine-learning  ·  или react",
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
      <div className="relative flex-1 group">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholders[type] || "Поиск по GitHub..."}
          className="pl-10 pr-16 h-11 text-sm bg-background/60 border-border/60 shadow-none focus-visible:bg-background transition-colors rounded-full"
          autoComplete="off"
          spellCheck={false}
        />
        <kbd className="hidden sm:flex absolute right-3.5 top-1/2 -translate-y-1/2 items-center gap-0.5 text-[10px] text-muted-foreground border rounded px-1.5 py-0.5 bg-muted/40">
          /
        </kbd>
      </div>
      <Button
        type="submit"
        className="h-11 px-5 gap-2 rounded-full shadow-sm shrink-0"
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
        <span className="hidden sm:inline">Найти</span>
      </Button>
      {onOpenMobileFilters && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-11 w-11 lg:hidden relative rounded-full shrink-0"
          onClick={onOpenMobileFilters}
          aria-label="Фильтры"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {activeCount ? (
            <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
              {activeCount}
            </span>
          ) : null}
        </Button>
      )}
    </form>
  );
}

/**
 * Horizontal, scrollable type tabs. Placed on the second row of the header so
 * it has room to breathe and never overlaps the search input above it.
 */
export function TypeTabs() {
  const { type, setType } = useSearchStore();
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none -mx-1 px-1">
      {TYPE_TABS.map((t) => (
        <button
          key={t.value}
          type="button"
          onClick={() => setType(t.value)}
          className={cn(
            "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all border",
            type === t.value
              ? "bg-foreground text-background border-foreground shadow-sm"
              : "bg-transparent text-muted-foreground border-transparent hover:bg-accent hover:text-foreground"
          )}
        >
          {t.icon}
          {t.label}
        </button>
      ))}
    </div>
  );
}

/** Legacy compat — not used in the two-row header anymore. */
export function SearchHeader(props: {
  onSearch: () => void;
  loading: boolean;
  onOpenMobileFilters?: () => void;
  activeCount?: number;
}) {
  return (
    <div className="w-full">
      <SearchInput {...props} />
      <div className="mt-2.5">
        <TypeTabs />
      </div>
    </div>
  );
}
