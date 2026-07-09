"use client";

import * as React from "react";
import {
  Github,
  Linkedin,
  ArrowRight,
  Cpu,
  Search,
  Sparkles,
  ClipboardList,
  Users,
  Filter,
  ExternalLink,
} from "lucide-react";
import { useUIStore } from "@/components/github/ui-store";
import { useSelectionStore } from "@/components/github/selection-store";
import { SYSTEMS_DOMAINS } from "@/lib/github";
import { LINKEDIN_PRESETS } from "@/lib/linkedin";

interface SystemCard {
  id: "gitfind" | "linkedin";
  name: string;
  tagline: string;
  description: string;
  icon: React.ReactNode;
  accent: string;
  features: { icon: React.ReactNode; text: string }[];
  stats: { label: string; value: string }[];
}

const SYSTEMS: SystemCard[] = [
  {
    id: "gitfind",
    name: "GitFind",
    tagline: "Поиск по GitHub",
    description:
      "Системные разработчики на GitHub: C, C++, Go, Python, Rust. Анализ профиля, языков, звёзд и активности. Экспорт выборки в ХАНТ.",
    icon: <Github className="h-7 w-7" />,
    accent: "from-emerald-500 to-emerald-700",
    features: [
      { icon: <Users className="h-4 w-4" />, text: "6 типов поиска: репо, пользователи, код, issues, коммиты, темы" },
      { icon: <Cpu className="h-4 w-4" />, text: "Дашборд профиля: языки, звёзды, seniority-оценка" },
      { icon: <ClipboardList className="h-4 w-4" />, text: "Выборка → экспорт в ХАНТ (HuntFlow CSV)" },
    ],
    stats: [
      { label: "Источники", value: "GitHub API" },
      { label: "Профиль", value: "Анализ кода" },
    ],
  },
  {
    id: "linkedin",
    name: "LinkedIn Search",
    tagline: "Поиск по LinkedIn",
    description:
      "Структурированный поиск кандидатов в LinkedIn: грейд, навыки, локация, компания, ВУЗ. Готовый URL для открытия в LinkedIn. Тот же экспорт в ХАНТ.",
    icon: <Linkedin className="h-7 w-7" />,
    accent: "from-sky-500 to-blue-600",
    features: [
      { icon: <Filter className="h-4 w-4" />, text: "Фильтры: грейд, навыки, локация, текущая/прошлая компания, ВУЗ" },
      { icon: <Search className="h-4 w-4" />, text: "Пресеты под системный профиль: C++, Go, Rust, DBA, DevOps" },
      { icon: <ClipboardList className="h-4 w-4" />, text: "Ручное добавление в выборку → общий экспорт в ХАНТ" },
    ],
    stats: [
      { label: "Источники", value: "LinkedIn" },
      { label: "Профиль", value: "URL-билдер" },
    ],
  },
];

export function Launcher() {
  const setApp = useUIStore((s) => s.setApp);
  const selectionCount = useSelectionStore((s) => s.candidates.length);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-background/85 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground text-background shadow-sm">
              <Search className="h-5 w-5" />
            </div>
            <div className="leading-none">
              <span className="font-bold text-base tracking-tight">SourcerHub</span>
              <span className="block text-[10px] text-muted-foreground mt-0.5">
                поисковые системы для рекрутера
              </span>
            </div>
          </div>
          {selectionCount > 0 && (
            <button
              onClick={() => setApp("gitfind")}
              className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-sm hover:shadow-sm transition-all"
            >
              <ClipboardList className="h-3.5 w-3.5 text-primary" />
              <span>Выборка</span>
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-1">
                {selectionCount}
              </span>
            </button>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 pt-12 pb-10">
          {/* Hero */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-xs text-muted-foreground mb-5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Выберите поисковую систему
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
              Сорсинг{" "}
              <span className="bg-gradient-to-r from-emerald-500 via-sky-500 to-blue-600 bg-clip-text text-transparent">
                системных инженеров
              </span>
            </h1>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Две поисковые системы в одном месте: GitHub для анализа кода и
              LinkedIn для структуры профиля. Единая выборка и экспорт в ХАНТ.
            </p>
          </div>

          {/* System cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {SYSTEMS.map((sys) => (
              <button
                key={sys.id}
                onClick={() => setApp(sys.id)}
                className="group relative text-left rounded-2xl border bg-card p-6 hover:shadow-lg hover:border-primary/40 transition-all overflow-hidden"
              >
                {/* Accent gradient glow */}
                <div
                  className={`absolute -top-12 -right-12 h-40 w-40 rounded-full bg-gradient-to-br ${sys.accent} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`}
                />

                <div className="relative">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${sys.accent} text-white shadow-md`}
                      >
                        {sys.icon}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold leading-tight">{sys.name}</h2>
                        <p className="text-xs text-muted-foreground">{sys.tagline}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {sys.description}
                  </p>

                  <ul className="space-y-2 mb-5">
                    {sys.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-primary mt-0.5 shrink-0">{f.icon}</span>
                        <span className="text-muted-foreground">{f.text}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center gap-4 pt-4 border-t">
                    {sys.stats.map((s, i) => (
                      <div key={i} className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                          {s.label}
                        </span>
                        <span className="text-xs font-semibold">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Quick presets preview */}
          <div className="mt-12">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 justify-center">
              <Sparkles className="h-3.5 w-3.5" />
              Готовые пресеты для старта
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {SYSTEMS_DOMAINS.slice(0, 5).map((d) => (
                <button
                  key={d.id}
                  onClick={() => setApp("gitfind")}
                  className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-sm hover:border-primary/50 hover:shadow-sm transition-all"
                >
                  <Github className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{d.label}</span>
                </button>
              ))}
              <span className="text-muted-foreground/40 px-1">·</span>
              {LINKEDIN_PRESETS.slice(0, 4).map((p) => (
                <button
                  key={p.id}
                  onClick={() => setApp("linkedin")}
                  className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-sm hover:border-primary/50 hover:shadow-sm transition-all"
                >
                  <Linkedin className="h-3.5 w-3.5 text-sky-600" />
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t bg-card/40">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>
              <span className="font-semibold text-foreground">SourcerHub</span> — системные
              разработчики C/C++/Go/Python/Rust · Москва и Россия
            </span>
            <span className="flex items-center gap-1">
              <ExternalLink className="h-3 w-3" />
              GitHub API · LinkedIn
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
