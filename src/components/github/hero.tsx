"use client";

import * as React from "react";
import { Sparkles, TrendingUp, ArrowRight, ClipboardList } from "lucide-react";
import { SearchType } from "@/lib/github";
import { useSearchStore } from "./store";
import { HistorySavedPanel } from "./history-panel";

const SUGGESTIONS: { query: string; type: SearchType; label: string }[] = [
  { query: "react", type: "repositories", label: "react" },
  { query: "next.js", type: "repositories", label: "next.js" },
  { query: "machine learning", type: "repositories", label: "machine learning" },
  { query: "language:rust", type: "repositories", label: "Rust проекты" },
  { query: "stars:>10000 language:typescript", type: "repositories", label: "Топ TS" },
  { query: "tailwindcss", type: "repositories", label: "tailwindcss" },
  { query: "openai", type: "users", label: "openai" },
  { query: "language:rust location:Moscow", type: "users", label: "Rust-разработчики, Москва" },
  { query: "useEffect", type: "code", label: "useEffect" },
  { query: "bug", type: "issues", label: "bug issues" },
  { query: "fix", type: "commits", label: "fix commits" },
];

export function Hero({ onSearch }: { onSearch: (q: string, type: SearchType) => void }) {
  const { setType, setQuery, applyEntry } = useSearchStore();

  const pick = (q: string, type: SearchType) => {
    setQuery(q);
    setType(type);
    onSearch(q, type);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pt-10 pb-6 text-center">
      <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-xs text-muted-foreground mb-5">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        Продвинутый поиск по всему GitHub
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
        Найдите{" "}
        <span className="bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent">
          любой репозиторий
        </span>
        ,<br className="hidden sm:block" /> пользователя или строку кода
      </h1>
      <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
        Шесть типов поиска, мощные фильтры по звёздам, языку, дате и лицензии,
        подсветка совпадений в коде, история и сохранённые запросы.
      </p>

      <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-400">
        <ClipboardList className="h-3.5 w-3.5 shrink-0" />
        <span>
          Ищите <strong>пользователей</strong> → добавляйте в выборку → экспорт в
          формат <strong>ХАНТ (HuntFlow CSV)</strong> для импорта в ATS
        </span>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-3">
          <TrendingUp className="h-3.5 w-3.5" />
          Популярные запросы
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s.label}
              onClick={() => pick(s.query, s.type)}
              className="group inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-sm hover:border-primary/50 hover:shadow-sm transition-all"
            >
              <span className="text-muted-foreground group-hover:text-primary transition-colors">
                {s.label}
              </span>
              <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 text-left">
        <HistorySavedPanel
          onApply={() => {
            // applyEntry already sets store state; trigger search via callback
            const st = useSearchStore.getState();
            onSearch(st.query, st.type);
          }}
        />
      </div>
    </div>
  );
}
