"use client";

import * as React from "react";
import {
  Sparkles,
  ArrowRight,
  ClipboardList,
  FolderGit2,
  Users,
  Code2,
  AlertCircle,
  GitCommit,
  Tag,
  Cpu,
  Database,
  Terminal,
  HardDrive,
  Network,
  ShieldCheck,
  Layers,
  MapPin,
} from "lucide-react";
import { SearchType, SYSTEMS_DOMAINS } from "@/lib/github";
import { useSearchStore } from "./store";
import { HistorySavedPanel } from "./history-panel";

interface SuggestionGroup {
  type: SearchType;
  title: string;
  icon: React.ReactNode;
  items: { query: string; label: string; hint?: string }[];
}

// Quick-start suggestions focused on systems-software engineers in Russia.
const GROUPS: SuggestionGroup[] = [
  {
    type: "users",
    title: "Системные разработчики",
    icon: <Users className="h-4 w-4" />,
    items: [
      { query: "language:C location:Moscow repos:>10", label: "C · Москва", hint: "системное ПО" },
      { query: "language:C++ location:Moscow repos:>10", label: "C++ · Москва", hint: "СУБД, движки" },
      { query: "language:Go location:Russia repos:>10", label: "Go · Россия", hint: "микросервисы, СРК" },
      { query: "language:Python location:Russia repos:>15", label: "Python · Россия", hint: "backend, автоматизация" },
      { query: "language:Rust location:Russia repos:>5", label: "Rust · Россия", hint: "безопасные системы" },
      { query: "language:Shell location:Moscow repos:>20", label: "Shell/DevOps · Москва", hint: "инфраструктура" },
    ],
  },
  {
    type: "repositories",
    title: "Системные проекты",
    icon: <FolderGit2 className="h-4 w-4" />,
    items: [
      { query: "language:C topic:database stars:>500", label: "СУБД на C", hint: "PostgreSQL-подобные" },
      { query: "language:C++ topic:database stars:>500", label: "СУБД на C++", hint: "движки хранения" },
      { query: "language:Go topic:kafka stars:>200", label: "Очереди на Go", hint: "СРК, брокеры" },
      { query: "language:Rust topic:filesystem stars:>100", label: "Файловые системы", hint: "СХД" },
      { query: "topic:linux-kernel stars:>500", label: "Linux kernel", hint: "драйверы, ядро" },
      { query: "language:C topic:networking stars:>300", label: "Сетевое ПО на C", hint: "протоколы, прокси" },
    ],
  },
  {
    type: "code",
    title: "Поиск по коду",
    icon: <Code2 className="h-4 w-4" />,
    items: [
      { query: "epoll_create language:C", label: "epoll (C)", hint: "async I/O" },
      { query: "grpc language:Go", label: "gRPC в Go", hint: "СРК" },
      { query: "shared_memory language:C++", label: "shared memory (C++)", hint: "IPC" },
      { query: "syscall language:Go", label: "syscall в Go", hint: "системные вызовы" },
    ],
  },
  {
    type: "issues",
    title: "Задачи",
    icon: <AlertCircle className="h-4 w-4" />,
    items: [
      { query: "is:open label:good-first-issue language:Go", label: "good first issue · Go" },
      { query: "is:open label:help-wanted language:C", label: "help wanted · C" },
      { query: "is:open label:bug language:Rust", label: "bug · Rust" },
    ],
  },
  {
    type: "commits",
    title: "Коммиты",
    icon: <GitCommit className="h-4 w-4" />,
    items: [
      { query: "fix kernel", label: "fix kernel" },
      { query: "refactor driver", label: "refactor driver" },
    ],
  },
  {
    type: "topics",
    title: "Темы",
    icon: <Tag className="h-4 w-4" />,
    items: [
      { query: "postgresql", label: "postgresql" },
      { query: "linux-kernel", label: "linux-kernel" },
      { query: "distributed-systems", label: "distributed-systems" },
    ],
  },
];

// Domain chips: СУБД, Linux, СХД, СРК... clickable → sets topic/language filter.
const DOMAIN_ICON: Record<string, React.ReactNode> = {
  databases: <Database className="h-4 w-4" />,
  "linux-os": <Terminal className="h-4 w-4" />,
  storage: <HardDrive className="h-4 w-4" />,
  srk: <Layers className="h-4 w-4" />,
  networking: <Network className="h-4 w-4" />,
  kernel: <Cpu className="h-4 w-4" />,
  crypto: <ShieldCheck className="h-4 w-4" />,
  containers: <Layers className="h-4 w-4" />,
  hpc: <Cpu className="h-4 w-4" />,
};

export function Hero({ onSearch }: { onSearch: () => void }) {
  const { setType, setQuery, setFilters, applyEntry } = useSearchStore();

  const pick = (q: string, type: SearchType) => {
    setQuery(q);
    setType(type);
    onSearch();
  };

  // Pick a domain preset → search repositories with that topic + language.
  const pickDomain = (domainId: string) => {
    const d = SYSTEMS_DOMAINS.find((x) => x.id === domainId);
    if (!d) return;
    const topicQ = (d.topics || []).slice(0, 4).map((t) => `topic:${t}`).join(" ");
    const langQ = d.language ? `language:${d.language}` : "";
    const q = [topicQ, langQ].filter(Boolean).join(" ");
    setQuery(q);
    setType("repositories");
    onSearch();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 pt-8 sm:pt-10 pb-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-xs text-muted-foreground mb-5">
          <Cpu className="h-3.5 w-3.5 text-primary" />
          Поиск системных разработчиков · C / C++ / Go / Python / Rust
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Системные инженеры{" "}
          <span className="bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent">
            Москвы и России
          </span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          СУБД, операционные системы на Linux, системы хранения данных (СХД),
          системы распределённых вычислений (СРК), ядро, драйверы и сетевое ПО.
        </p>

        <div className="mt-5 inline-flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-400 text-left">
          <ClipboardList className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          <span>
            <strong>Как работать:</strong> найдите разработчиков → «В выборку» →
            экспорт в формат <strong>ХАНТ (HuntFlow CSV)</strong> для импорта в ATS
          </span>
        </div>
      </div>

      {/* Domain chips — quick filter by systems domain */}
      <div className="mt-7">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2.5">
          <MapPin className="h-3.5 w-3.5" />
          Доменные пресеты — кликните для поиска проектов
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {SYSTEMS_DOMAINS.map((d) => (
            <button
              key={d.id}
              onClick={() => pickDomain(d.id)}
              title={d.description}
              className="group inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-sm hover:border-primary/50 hover:shadow-sm transition-all"
            >
              <span className="text-primary">{DOMAIN_ICON[d.id] || <FolderGit2 className="h-4 w-4" />}</span>
              <span className="font-medium">{d.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Suggestion groups — one card per search type */}
      <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
            <div className="flex flex-col gap-1">
              {g.items.map((it) => (
                <button
                  key={it.label}
                  onClick={() => pick(it.query, g.type)}
                  className="group flex items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left hover:bg-accent transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-foreground truncate">{it.label}</div>
                    {it.hint && (
                      <div className="text-[11px] text-muted-foreground truncate">{it.hint}</div>
                    )}
                  </div>
                  <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 shrink-0 transition-opacity" />
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
