"use client";

import * as React from "react";
import {
  FlaskConical,
  ExternalLink,
  Shield,
  Globe,
  Sparkles,
  Search as SearchIcon,
  Save,
  RotateCcw,
  ChevronDown,
  BookOpen,
  DollarSign,
  Lightbulb,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from "sonner";
import {
  useResearchStore,
  ResearchStatus,
  STATUS_LABELS,
  STATUS_COLORS,
} from "./research-store";
import { CollapsibleSection } from "./collapsible-section";

interface ResearchItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  docsUrl: string;
  accent: string;
  icon: React.ReactNode;
  facts: { label: string; value: string }[];
  questions: string[];
}

const ITEMS: ResearchItem[] = [
  {
    id: "brave",
    name: "Brave Search API",
    tagline: "Независимый поисковый API",
    description:
      "Поисковый API от Brave — собственный индекс (не Google/Bing). Приватность, без цензуры. Подходит для x-ray сорсинга по LinkedIn/GitHub/Хабру через структурированные запросы.",
    docsUrl: "https://api.search.brave.com/",
    accent: "from-orange-500 to-red-600",
    icon: <Shield className="h-5 w-5" />,
    facts: [
      { label: "Free tier", value: "2000 запр/мес" },
      { label: "Индекс", value: "собственный (не Google)" },
      { label: "Типы", value: "web, news, images, videos" },
    ],
    questions: [
      "Поддерживает ли операторы site:, intitle:, OR, - как Google?",
      "Качество результатов по русскоязычным сайтам (hh.ru, Хабр)?",
      "Можно ли фильтровать по локации/языку (ru)?",
      "Сравнить релевантность с Google CSE для сорсинга",
    ],
  },
  {
    id: "firecrawl",
    name: "Self-hosting Firecrawl",
    tagline: "Open-source веб-скрапинг",
    description:
      "Open-source инструмент для скрапинга и краулинга сайтов с конвертацией в markdown/JSON. Self-hosting через Docker. Можно парсить LinkedIn, hh.ru, Хабр.Карьеру для структурированных данных кандидатов.",
    docsUrl: "https://github.com/mendableai/firecrawl",
    accent: "from-violet-500 to-fuchsia-600",
    icon: <Globe className="h-5 w-5" />,
    facts: [
      { label: "Лицензия", value: "AGPL-3.0 (self-host)" },
      { label: "Стек", value: "Node.js, Docker" },
      { label: "Формат", value: "markdown, JSON, HTML" },
    ],
    questions: [
      "Как развернуть self-hosted через Docker Compose?",
      "Есть ли готовые scraping templates для LinkedIn/hh.ru?",
      "Как обходить капчу и rate-limit целевых сайтов?",
      "Интеграция в SourcerHub: enrich кандидата после добавления URL",
      "ToS целевых сайтов — что можно парсить легально?",
    ],
  },
  {
    id: "exa",
    name: "EXA.IO",
    tagline: "AI-семантический поиск",
    description:
      "AI-оптимизированный поисковый API с нейронным/семантическим поиском. Находит релевантные результаты по смыслу, а не по ключевым словам. Идеально для запросов «инженеры, строящие RAG-системы» — даже если слова нет в профиле.",
    docsUrl: "https://docs.exa.ai/",
    accent: "from-sky-500 to-blue-600",
    icon: <Sparkles className="h-5 w-5" />,
    facts: [
      { label: "Тип", value: "нейронный + keyword" },
      { label: "Free tier", value: "1000 запр/мес" },
      { label: "Поиск", value: "semantic, similarity, contents" },
    ],
    questions: [
      "Как работает neural search vs keyword hybrid?",
      "Качество по русскоязычным профилям и резюме?",
      "find_similar — можно ли найти похожих на已知ого кандидата?",
      "Цены после free tier — стоит ли для продакшна?",
      "Интеграция: семантический поиск «systems engineers RAG»",
    ],
  },
  {
    id: "yandex",
    name: "Yandex Search API",
    tagline: "Поиск Яндекс (XML/API)",
    description:
      "Официальный поисковый API Яндекса. Лучшее покрытие .ru-доменов и русскоязычного контента: hh.ru, Хабр, LOR, OpenNet, VC.ru. Для российского сорсинга системных разработчиков — релевантнее Google.",
    docsUrl: "https://yandex.ru/dev/search/",
    accent: "from-yellow-500 to-amber-600",
    icon: <SearchIcon className="h-5 w-5" />,
    facts: [
      { label: "Тип", value: "XML / REST API" },
      { label: "Покрытие", value: ".ru домены, рус. язык" },
      { label: "Лимиты", value: "зависит от тарифа" },
    ],
    questions: [
      "Актуальный ли XML Search API или есть новый REST?",
      "Поддержка операторов site:, host:, lang:ru?",
      "Тарифы и лимиты для коммерческого использования?",
      "Сравнить с Google CSE по охвату .ru-источников",
      "Интеграция в SourcerHub как отдельная поисковая система",
    ],
  },
];

export function ResearchSection() {
  return (
    <CollapsibleSection
      icon={<FlaskConical className="h-5 w-5" />}
      iconAccent="from-violet-500 to-fuchsia-600"
      title="Ресёрч"
      subtitle="Изучение API для расширения SourcerHub — фиксируйте заметки, выводы и идеи интеграции"
      count={ITEMS.length}
    >
      {/* Research blocks grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {ITEMS.map((item) => (
          <ResearchBlock key={item.id} item={item} />
        ))}
      </div>
    </CollapsibleSection>
  );
}

function ResearchBlock({ item }: { item: ResearchItem }) {
  const data = useResearchStore((s) => s.data[item.id]);
  const setNotes = useResearchStore((s) => s.setNotes);
  const reset = useResearchStore((s) => s.reset);
  const [open, setOpen] = React.useState(false);

  const current = data || {
    notes: "",
    status: "not-started" as ResearchStatus,
    keyFindings: "",
    pricing: "",
    integration: "",
  };

  const hasContent =
    current.notes || current.keyFindings || current.pricing || current.integration;

  const handleSave = () => {
    toast.success("Заметки сохранены", {
      description: item.name,
    });
  };

  const handleReset = () => {
    reset(item.id);
    toast.message("Заметки очищены", { description: item.name });
  };

  return (
    <div className="relative rounded-2xl border bg-card p-5 overflow-hidden hover:shadow-md transition-shadow">
      {/* Accent glow */}
      <div
        className={`absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br ${item.accent} opacity-10 blur-2xl`}
      />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${item.accent} text-white shadow-md shrink-0`}
            >
              {item.icon}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold leading-tight truncate">{item.name}</h3>
              <p className="text-[11px] text-muted-foreground truncate">{item.tagline}</p>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold shrink-0 ${STATUS_COLORS[current.status]}`}
          >
            {STATUS_LABELS[current.status]}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed mb-3">
          {item.description}
        </p>

        {/* Quick facts */}
        <div className="flex flex-wrap gap-3 mb-3">
          {item.facts.map((f, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-[9px] uppercase tracking-wide text-muted-foreground">
                {f.label}
              </span>
              <span className="text-[11px] font-semibold">{f.value}</span>
            </div>
          ))}
        </div>

        {/* Docs link */}
        <a
          href={item.docsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs text-primary hover:underline mb-3"
        >
          <ExternalLink className="h-3 w-3" />
          Документация
        </a>

        {/* Questions to investigate */}
        <div className="rounded-lg bg-muted/40 border p-3 mb-3">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
            <Lightbulb className="h-3 w-3 text-amber-500" />
            Вопросы для проработки
          </div>
          <ul className="space-y-1">
            {item.questions.map((q, i) => (
              <li key={i} className="text-[11px] text-muted-foreground flex items-start gap-1.5">
                <span className="text-primary/60 mt-0.5">›</span>
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Collapsible notes editor */}
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border bg-background px-3 py-2 text-xs font-medium hover:bg-accent transition-colors">
            <span className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-primary" />
              {hasContent ? "Мои заметки" : "Добавить заметки"}
              {hasContent && (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              )}
            </span>
            <ChevronDown className="h-3.5 w-3.5 [[data-state=open]_&]:rotate-180 transition-transform" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-3">
            {/* Status selector */}
            <div className="space-y-1.5">
              <Label className="text-[11px] text-muted-foreground">Статус изучения</Label>
              <Select
                value={current.status}
                onValueChange={(v) => setNotes(item.id, { status: v as ResearchStatus })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not-started">Не начато</SelectItem>
                  <SelectItem value="in-progress">В работе</SelectItem>
                  <SelectItem value="done">Изучено</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Pricing / limits */}
            <div className="space-y-1.5">
              <Label className="text-[11px] text-muted-foreground flex items-center gap-1">
                <DollarSign className="h-3 w-3 text-emerald-500" />
                Цены и лимиты
              </Label>
              <Input
                placeholder="Free tier 1000/мес, далее $0.001/запрос..."
                value={current.pricing}
                onChange={(e) => setNotes(item.id, { pricing: e.target.value })}
                className="h-8 text-xs"
              />
            </div>

            {/* Key findings */}
            <div className="space-y-1.5">
              <Label className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Lightbulb className="h-3 w-3 text-amber-500" />
                Ключевые выводы
              </Label>
              <Textarea
                placeholder="Что узнали: поддерживает site:, хороший охват .ru..."
                value={current.keyFindings}
                onChange={(e) => setNotes(item.id, { keyFindings: e.target.value })}
                className="text-xs min-h-[60px] resize-none"
              />
            </div>

            {/* Integration idea */}
            <div className="space-y-1.5">
              <Label className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-primary" />
                Идея интеграции в SourcerHub
              </Label>
              <Textarea
                placeholder="Как встроить: отдельная система на лаунчере / enrich кандидатов..."
                value={current.integration}
                onChange={(e) => setNotes(item.id, { integration: e.target.value })}
                className="text-xs min-h-[60px] resize-none"
              />
            </div>

            {/* Free-form notes */}
            <div className="space-y-1.5">
              <Label className="text-[11px] text-muted-foreground flex items-center gap-1">
                <BookOpen className="h-3 w-3 text-sky-500" />
                Общие заметки
              </Label>
              <Textarea
                placeholder="Любые наблюдения, ссылки, сравнения..."
                value={current.notes}
                onChange={(e) => setNotes(item.id, { notes: e.target.value })}
                className="text-xs min-h-[80px] resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              <Button size="sm" className="h-7 gap-1.5 text-xs" onClick={handleSave}>
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
