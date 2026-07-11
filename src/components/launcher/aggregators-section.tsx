"use client";

import * as React from "react";
import {
  Briefcase,
  ExternalLink,
  Layers,
  Save,
  RotateCcw,
  ChevronDown,
  FileText,
  Globe,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from "sonner";
import { useResearchStore } from "./research-store";

interface Aggregator {
  id: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  accent: string;
  aggregates: string;
  facts: { label: string; value: string }[];
}

const AGGREGATORS: Aggregator[] = [
  {
    id: "hirehi",
    name: "HireHi",
    tagline: "hirehi.ru · агрегатор IT-вакансий",
    description:
      "Агрегатор IT-вакансий: собирает предложения с hh.ru, Хабр.Карьеры, Habr Freelance, соцсетей и корпоративных сайтов. Удобный поиск по стеку, удалёнке и зарплате. Полезен для бенчмаркинга рынка и обратного сорсинга — компаний, которые нанимают.",
    url: "https://hirehi.ru/",
    accent: "from-emerald-500 to-teal-600",
    aggregates: "hh.ru, Хабр.Карьера, Habr Freelance, корпоративные сайты",
    facts: [
      { label: "Тип", value: "агрегатор вакансий" },
      { label: "Фокус", value: "IT, разработка" },
      { label: "Регионы", value: "Россия, СНГ, remote" },
    ],
  },
  {
    id: "getmatch",
    name: "GetMatch",
    tagline: "getmatch.ru · IT-матчинг",
    description:
      "Платформа матчинга IT-специалистов и компаний. Кандидаты заполняют профиль (стек, опыт, зарплатные ожидания), компании получают релевантные матчи. Сильны в backend, инфраструктуре и системном ПО. Есть пул кандидатов по C++, Go, Rust, DevOps.",
    url: "https://getmatch.ru/",
    accent: "from-violet-500 to-fuchsia-600",
    aggregates: "прямые профили IT-кандидатов + вакансии компаний",
    facts: [
      { label: "Тип", value: "матчинг-платформа" },
      { label: "Фокус", value: "IT, разработка, инфра" },
      { label: "Модель", value: "кандидат → компании" },
    ],
  },
  {
    id: "hh-aggregator",
    name: "hh.ru (как агрегатор)",
    tagline: "hh.ru · крупнейшая база резюме РФ",
    description:
      "HeadHunter — не только поисковая система (есть в основном разделе), но и крупнейший агрегатор резюме системных разработчиков в России. Объединяет вакансии и резюме с собственных и партнёрских источников. Используйте и для поиска резюме, и для бенчмаркинга зарплат.",
    url: "https://hh.ru/resume",
    accent: "from-red-500 to-rose-600",
    aggregates: "прямые резюме + партнёрские источники, крупнейшая база РФ",
    facts: [
      { label: "Тип", value: "агрегатор + job-сайт" },
      { label: "Фокус", value: "IT, системное ПО" },
      { label: "Резюме", value: "миллионы по РФ" },
    ],
  },
  {
    id: "hunter",
    name: "Job Hunter",
    tagline: "jobhunter.ru · IT-агрегатор + ИИ",
    description:
      "Агрегатор IT-вакансий с ИИ-подбором. Собирает предложения с hh.ru, Superjob, Хабр.Карьеры и других IT-источников. Полезен для анализа зарплатных вилок по системным ролям (C++, Go, Rust) в Москве и регионах.",
    url: "https://jobhunter.ru/",
    accent: "from-cyan-500 to-blue-600",
    aggregates: "hh.ru, Superjob, Хабр.Карьера, IT-источники",
    facts: [
      { label: "Тип", value: "агрегатор + ИИ" },
      { label: "Фокус", value: "IT, разработка" },
      { label: "Фича", value: "ИИ-подбор, аналитика ЗП" },
    ],
  },
];

export function AggregatorsSection() {
  return (
    <section className="mt-14">
      {/* Section header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground text-background shadow-sm">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Агрегаторы вакансий</h2>
            <p className="text-xs text-muted-foreground">
              Сервисы, собирающие вакансии и резюме из множества источников — для
              бенчмаркинга рынка и поиска по компаниям
            </p>
          </div>
        </div>
      </div>

      {/* Aggregators grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {AGGREGATORS.map((agg) => (
          <AggregatorBlock key={agg.id} agg={agg} />
        ))}
      </div>
    </section>
  );
}

function AggregatorBlock({ agg }: { agg: Aggregator }) {
  const data = useResearchStore((s) => s.data[agg.id]);
  const setNotes = useResearchStore((s) => s.setNotes);
  const reset = useResearchStore((s) => s.reset);
  const [open, setOpen] = React.useState(false);

  const current = data || { notes: "", keyFindings: "", pricing: "", integration: "", status: "not-started" as const };

  const hasContent = current.notes || current.keyFindings;

  const handleReset = () => {
    reset(agg.id);
    toast.message("Заметки очищены", { description: agg.name });
  };

  return (
    <div className="relative rounded-2xl border bg-card p-5 overflow-hidden hover:shadow-md transition-shadow">
      <div
        className={`absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br ${agg.accent} opacity-10 blur-2xl`}
      />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${agg.accent} text-white shadow-md shrink-0`}
            >
              <Briefcase className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold leading-tight truncate">{agg.name}</h3>
              <p className="text-[11px] text-muted-foreground truncate">{agg.tagline}</p>
            </div>
          </div>
          {hasContent && (
            <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 mt-2" title="Есть заметки" />
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed mb-3">
          {agg.description}
        </p>

        {/* Quick facts */}
        <div className="flex flex-wrap gap-3 mb-3">
          {agg.facts.map((f, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-[9px] uppercase tracking-wide text-muted-foreground">
                {f.label}
              </span>
              <span className="text-[11px] font-semibold">{f.value}</span>
            </div>
          ))}
        </div>

        {/* Aggregates */}
        <div className="rounded-lg bg-muted/40 border p-2.5 mb-3">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">
            <Layers className="h-3 w-3 text-primary" />
            Источники агрегации
          </div>
          <p className="text-[11px] text-muted-foreground">{agg.aggregates}</p>
        </div>

        {/* Link */}
        <a
          href={agg.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs text-primary hover:underline mb-3"
        >
          <ExternalLink className="h-3 w-3" />
          Открыть {agg.name}
        </a>

        {/* Collapsible notes */}
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border bg-background px-3 py-2 text-xs font-medium hover:bg-accent transition-colors">
            <span className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-primary" />
              {hasContent ? "Мои заметки" : "Добавить заметки"}
            </span>
            <ChevronDown className="h-3.5 w-3.5 [[data-state=open]_&]:rotate-180 transition-transform" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-3">
            <div className="space-y-1.5">
              <Label className="text-[11px] text-muted-foreground">Выводы по охвату</Label>
              <Textarea
                placeholder="Какие источники покрывает, где есть уникальные вакансии..."
                value={current.keyFindings}
                onChange={(e) => setNotes(agg.id, { keyFindings: e.target.value })}
                className="text-xs min-h-[60px] resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] text-muted-foreground">Общие заметки</Label>
              <Textarea
                placeholder="Сравнение с hh.ru, удобство, идеи..."
                value={current.notes}
                onChange={(e) => setNotes(agg.id, { notes: e.target.value })}
                className="text-xs min-h-[80px] resize-none"
              />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Button
                size="sm"
                className="h-7 gap-1.5 text-xs"
                onClick={() => toast.success("Заметки сохранены", { description: agg.name })}
              >
                <Save className="h-3 w-3" />
                Сохранить
              </Button>
              {hasContent && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs text-muted-foreground hover:text-rose-500"
                  onClick={handleReset}
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Очистить
                </Button>
              )}
              <span className="ml-auto text-[10px] text-muted-foreground">
                Сохраняется автоматически
              </span>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
