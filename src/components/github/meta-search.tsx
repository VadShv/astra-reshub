"use client";

import * as React from "react";
import { ArrowLeft, Search, ExternalLink, Globe } from "lucide-react";
import { useUIStore } from "./ui-store";

interface MetaResult {
  engine: string;
  url: string;
  accent: string;
}

const ENGINES = [
  { id: "google", name: "Google", baseUrl: "https://www.google.com/search?q=", accent: "from-rose-500 to-pink-600" },
  { id: "yandex", name: "Yandex", baseUrl: "https://yandex.ru/search/?text=", accent: "from-red-500 to-yellow-500" },
  { id: "bing", name: "Bing", baseUrl: "https://www.bing.com/search?q=", accent: "from-blue-500 to-teal-600" },
  { id: "ddg", name: "DuckDuckGo", baseUrl: "https://duckduckgo.com/?q=", accent: "from-orange-500 to-red-600" },
];

const XRAY_PLATFORMS = [
  { site: "vk.com", label: "ВКонтакте" },
  { site: "habr.com/users", label: "Хабр профили" },
  { site: "career.habr.com/resumes", label: "Хабр Карьера" },
  { site: "hh.ru/resume", label: "hh.ru" },
  { site: "linkedin.com/in", label: "LinkedIn" },
  { site: "github.com", label: "GitHub" },
  { site: "stackoverflow.com/users", label: "StackOverflow" },
  { site: "telegram.me", label: "Telegram" },
];

export function MetaSearch() {
  const setApp = useUIStore((s) => s.setApp);
  const [query, setQuery] = React.useState("");
  const [selectedPlatforms, setSelectedPlatforms] = React.useState<Set<string>>(new Set(["vk.com", "career.habr.com/resumes", "hh.ru/resume"]));

  const trimmed = query.trim();
  const encoded = encodeURIComponent(trimmed);

  const engineResults: MetaResult[] = React.useMemo(() => {
    if (!trimmed) return [];
    return ENGINES.map((e) => ({
      engine: e.name,
      url: `${e.baseUrl}${encoded}`,
      accent: e.accent,
    }));
  }, [trimmed, encoded]);

  const xrayResults: MetaResult[] = React.useMemo(() => {
    if (!trimmed) return [];
    return [...selectedPlatforms].map((site) => {
      const platform = XRAY_PLATFORMS.find((p) => p.site === site);
      return {
        engine: `Google x-ray: ${platform?.label || site}`,
        url: `https://www.google.com/search?q=site:${site}+${encoded}`,
        accent: "from-slate-500 to-gray-700",
      };
    });
  }, [trimmed, encoded, selectedPlatforms]);

  const allResults = [...engineResults, ...xrayResults];

  function togglePlatform(site: string) {
    setSelectedPlatforms((prev) => {
      const next = new Set(prev);
      if (next.has(site)) next.delete(site);
      else next.add(site);
      return next;
    });
  }

  function openAll() {
    allResults.forEach((r) => window.open(r.url, "_blank"));
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b bg-background/85 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto max-w-4xl px-4 h-14 flex items-center justify-between">
          <button onClick={() => setApp("launcher")} className="inline-flex items-center gap-2 text-sm hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Назад
          </button>
          <h1 className="font-bold text-base">Мета-поиск</h1>
          <span className="text-sm text-muted-foreground">{allResults.length} ссылок</span>
        </div>
      </header>

      <div className="flex-1 mx-auto max-w-4xl w-full px-4 py-6 space-y-6">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Например: "C++ разработчик" Москва'
            className="w-full pl-11 pr-4 h-12 rounded-xl border bg-card text-base focus:outline-none focus:ring-2 focus:ring-primary"
            autoFocus
          />
        </div>

        {/* Platform selection */}
        <div>
          <div className="text-xs text-muted-foreground mb-2">X-ray по платформам (Google site:):</div>
          <div className="flex flex-wrap gap-2">
            {XRAY_PLATFORMS.map((p) => (
              <button
                key={p.site}
                onClick={() => togglePlatform(p.site)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-all ${
                  selectedPlatforms.has(p.site)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card hover:shadow-sm"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {trimmed && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-sm">Сгенерированные ссылки ({allResults.length})</h2>
              <button
                onClick={openAll}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-3 py-1.5 text-sm hover:opacity-90 transition-opacity"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Открыть все
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {engineResults.map((r) => (
                <ResultCard key={r.url} result={r} />
              ))}
              {xrayResults.map((r) => (
                <ResultCard key={r.url} result={r} />
              ))}
            </div>
          </>
        )}

        {!trimmed && (
          <div className="text-center py-20 text-muted-foreground">
            <Globe className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Введите запрос — получите ссылки на 4 поисковика + x-ray по выбранным платформам.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ResultCard({ result }: { result: MetaResult }) {
  return (
    <a
      href={result.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-xl border bg-card p-3 hover:shadow-sm transition-all"
    >
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${result.accent} text-white`}>
        <Globe className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium group-hover:text-primary transition-colors">{result.engine}</div>
        <div className="text-[11px] text-muted-foreground truncate">{result.url}</div>
      </div>
      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
    </a>
  );
}
