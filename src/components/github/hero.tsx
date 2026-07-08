"use client";

import * as React from "react";
import {
  Sparkles,
  ArrowRight,
  ClipboardList,
  Search,
  FolderGit2,
  Users,
  Code2,
  AlertCircle,
  GitCommit,
  Tag,
} from "lucide-react";
import { SearchType } from "@/lib/github";
import { useSearchStore } from "./store";
import { HistorySavedPanel } from "./history-panel";

interface SuggestionGroup {
  type: SearchType;
  title: string;
  icon: React.ReactNode;
  items: { query: string; label: string }[];
}

const GROUPS: SuggestionGroup[] = [
  {
    type: "repositories",
    title: "Репозитории",
    icon: <FolderGit2 className="h-4 w-4" />,
    items: [
      { query: "react dashboard", label: "React dashboard" },
      { query: "language:rust stars:>1000", label: "Популярные на Rust" },
      { query: "tailwindcss component", label: "Tailwind компоненты" },
      { query: "next.js starter", label: "Next.js стартовые шаблоны" },
    ],
  },
  {
    type: "users",
    title: "Разработчики",
    icon: <Users className="h-4 w-4" />,
    items: [
      { query: "language:python location:Moscow", label: "Python · Москва" },
      { query: "language:rust location:Moscow", label: "Rust · Москва" },
      { query: "language:typescript followers:>500", label: "TS-разработчики" },
      { query: "language:golang repos:>20", label: "Go-инженеры" },
    ],
  },
  {
    type: "code",
    title: "Код",
    icon: <Code2 className="h-4 w-4" />,
    items: [
      { query: "useEffect", label: "useEffect" },
      { query: "useState language:typescript", label: "useState в TS" },
      { query: "createRouter language:go", label: "createRouter в Go" },
    ],
  },
  {
    type: "issues",
    title: "Задачи",
    icon: <AlertCircle className="h-4 w-4" />,
    items: [
      { query: "is:open label:good-first-issue", label: "good first issue" },
      { query: "is:open label:help-wanted", label: "help wanted" },
    ],
  },
  {
    type: "commits",
    title: "Коммиты",
    icon: <GitCommit className="h-4 w-4" />,
    items: [
      { query: "fix", label: "fix" },
      { query: "refactor", label: "refactor" },
    ],
  },
  {
    type: "topics",
    title: "Темы",
    icon: <Tag className="h-4 w-4" />,
    items: [
      { query: "machine-learning", label: "machine-learning" },
      { query: "react", label: "react" },
    ],
  },
];

export function Hero({ onSearch }: { onSearch: () => void }) {
  const { setType, setQuery, applyEntry } = useSearchStore();

  const pick = (q: string, type: SearchType) => {
    setQuery(q);
    setType(type);
    onSearch();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-8 sm:pt-12 pb-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-xs text-muted-foreground mb-5">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Продвинутый поиск по всему GitHub
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Что будем{" "}
          <span className="bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent">
            искать?
          </span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
          Выберите тип поиска выше и введите запрос — или начните с готовых
          примеров ниже.
        </p>

        <div className="mt-5 inline-flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-400 text-left">
          <ClipboardList className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          <span>
            <strong>Совет:</strong> ищите <strong>разработчиков</strong> → жмите
            «В выборку» → экспорт в формат <strong>ХАНТ (HuntFlow CSV)</strong>
          </span>
        </div>
      </div>

      {/* Suggestion groups — one card per search type */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {GROUPS.map((g) => (
          <div
            key={g.type}
            className="rounded-xl border bg-card/60 p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {g.icon}
              </span>
              <h3 className="text-sm font-semibold">{g.title}</h3>
            </div>
            <div className="flex flex-col gap-1.5">
              {g.items.map((it) => (
                <button
                  key={it.label}
                  onClick={() => pick(it.query, g.type)}
                  className="group flex items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  <span className="truncate">{it.label}</span>
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 shrink-0 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <HistorySavedPanel
          onApply={() => {
            onSearch();
          }}
        />
      </div>
    </div>
  );
}
