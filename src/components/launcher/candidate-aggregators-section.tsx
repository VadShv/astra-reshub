"use client";

import * as React from "react";
import {
  UserCheck,
  ExternalLink,
  Save,
  RotateCcw,
  ChevronDown,
  FileText,
  Sparkles,
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
import { CollapsibleSection } from "./collapsible-section";

interface CandidateAggregator {
  id: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  accent: string;
  model: string;
  facts: { label: string; value: string }[];
}

const AGGREGATORS: CandidateAggregator[] = [
  {
    id: "matchy",
    name: "Мэтчи",
    tagline: "matchy.io · IT-агрегатор кандидатов",
    description:
      "Агрегатор кандидатов для IT-рекрутинга: собирает профили разработчиков из открытых источников (GitHub, Хабр, StackOverflow, LinkedIn, hh.ru) в единую базу. Поиск по стеку, локации, опыту. Сильны в backend, инфраструктуре и системном ПО — есть пул по C++, Go, Rust, DevOps.",
    url: "https://matchy.io/",
    accent: "from-violet-500 to-fuchsia-600",
    model: "агрегация профилей из открытых источников",
    facts: [
      { label: "Тип", value: "агрегатор кандидатов" },
      { label: "Фокус", value: "IT, разработка" },
      { label: "Источники", value: "GitHub, Хабр, SO, hh.ru" },
    ],
  },
  {
    id: "podbor",
    name: "Podbor.io",
    tagline: "podbor.io · подбор IT-кандидатов",
    description:
      "Платформа для подбора IT-специалистов: объединяет резюме с hh.ru, Хабр.Карьеры, LinkedIn и других источников в одном интерфейсе. Удобный поиск по ключевым навыкам (C, C++, Go, Rust, PostgreSQL, Linux, K8s) и фильтр по локации. Полезна для быстрого long-list по системным ролям.",
    url: "https://podbor.io/",
    accent: "from-emerald-500 to-teal-600",
    model: "объединение резюме из нескольких job-источников",
    facts: [
      { label: "Тип", value: "поисковик по резюме" },
      { label: "Фокус", value: "IT, разработка" },
      { label: "Источники", value: "hh.ru, Хабр.Карьера, LinkedIn" },
    ],
  },
  {
    id: "huntshare",
    name: "Huntshare.tech",
    tagline: "huntshare.tech · шеринг кандидатов",
    description:
      "Платформа шеринг-рекрутинга: рекрутеры делятся кандидатами, которых не закрыли (не подошли клиенту), и получают доступ к пулу от коллег. База кандидатов от реальных сорсеров — выше качество, есть прямые контакты. Сильны в senior+ позициях по backend и инфраструктуре.",
    url: "https://huntshare.tech/",
    accent: "from-sky-500 to-cyan-600",
    model: "шеринг кандидатов между рекрутерами",
    facts: [
      { label: "Тип", value: "шеринг-платформа" },
      { label: "Фокус", value: "IT, senior+" },
      { label: "Источник", value: "пулы рекрутеров" },
    ],
  },
];

export function CandidateAggregatorsSection() {
  return (
    <CollapsibleSection
      icon={<UserCheck className="h-5 w-5" />}
      iconAccent="from-fuchsia-500 to-purple-600"
      title="Агрегаторы кандидатов"
      subtitle="Платформы, собирающие профили кандидатов из множества источников и шеринг-базы рекрутеров"
      count={AGGREGATORS.length}
    >
      {/* Aggregators grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {AGGREGATORS.map((agg) => (
          <CandidateAggregatorBlock key={agg.id} agg={agg} />
        ))}
      </div>
    </CollapsibleSection>
  );
}

function CandidateAggregatorBlock({ agg }: { agg: CandidateAggregator }) {
  const data = useResearchStore((s) => s.data[agg.id]);
  const setNotes = useResearchStore((s) => s.setNotes);
  const reset = useResearchStore((s) => s.reset);
  const [open, setOpen] = React.useState(false);

  const current = data || { notes: "", keyFindings: "", pricing: "", integration: "", status: "not-started" as const };

  const hasContent = current.notes || current.keyFindings || current.pricing || current.integration;

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
              <UserCheck className="h-5 w-5" />
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

        {/* Model */}
        <div className="rounded-lg bg-muted/40 border p-2.5 mb-3">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">
            <Sparkles className="h-3 w-3 text-primary" />
            Модель работы
          </div>
          <p className="text-[11px] text-muted-foreground">{agg.model}</p>
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
              <Label className="text-[11px] text-muted-foreground">Цены и условия</Label>
              <Textarea
                placeholder="Бесплатный доступ, платные пакеты, комиссия за закрытие..."
                value={current.pricing}
                onChange={(e) => setNotes(agg.id, { pricing: e.target.value })}
                className="text-xs min-h-[50px] resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] text-muted-foreground">Выводы по охвату</Label>
              <Textarea
                placeholder="Сколько кандидатов по C++/Go/Rust, качество, уникальность..."
                value={current.keyFindings}
                onChange={(e) => setNotes(agg.id, { keyFindings: e.target.value })}
                className="text-xs min-h-[60px] resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] text-muted-foreground">Общие заметки</Label>
              <Textarea
                placeholder="Удобство, сравнение, интеграция в SourcerHub..."
                value={current.notes}
                onChange={(e) => setNotes(agg.id, { notes: e.target.value })}
                className="text-xs min-h-[70px] resize-none"
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
