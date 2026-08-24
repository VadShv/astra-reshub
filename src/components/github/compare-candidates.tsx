"use client";

import * as React from "react";
import { ArrowLeft, GitCompare, X } from "lucide-react";
import { useSelectionStore, Candidate } from "./selection-store";
import { useUIStore } from "./ui-store";

const FIELDS: { key: string; label: string; render: (c: Candidate) => string | React.ReactNode }[] = [
  { key: "name", label: "Имя", render: (c) => c.name || c.login },
  { key: "position", label: "Позиция", render: (c) => c.position || "—" },
  { key: "source", label: "Источник", render: (c) => (c.tags && c.tags[0]) || "github" },
  { key: "company", label: "Компания", render: (c) => c.company || "—" },
  { key: "location", label: "Локация", render: (c) => c.location || "—" },
  { key: "email", label: "Email", render: (c) => c.email || "—" },
  { key: "followers", label: "Подписчики", render: (c) => String(c.followers || 0) },
  { key: "public_repos", label: "Репозитории", render: (c) => String(c.public_repos || 0) },
  { key: "bio", label: "Bio", render: (c) => c.bio ? <span className="text-xs line-clamp-3">{c.bio}</span> : "—" },
  { key: "status", label: "Статус", render: (c) => c.status },
  { key: "note", label: "Заметка", render: (c) => c.note || "—" },
];

export function CompareCandidates() {
  const candidates = useSelectionStore((s) => s.candidates);
  const setApp = useUIStore((s) => s.setApp);
  const [selected, setSelected] = React.useState<string[]>([]);

  function toggle(login: string) {
    setSelected((prev) => {
      if (prev.includes(login)) return prev.filter((l) => l !== login);
      if (prev.length >= 3) return [prev[1], prev[2], login];
      return [...prev, login];
    });
  }

  const selectedCandidates = candidates.filter((c) => selected.includes(c.login));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b bg-background/85 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
          <button onClick={() => setApp("launcher")} className="inline-flex items-center gap-2 text-sm hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Назад
          </button>
          <h1 className="font-bold text-base flex items-center gap-2">
            <GitCompare className="h-4 w-4" />
            Сравнение кандидатов
          </h1>
          <span className="text-sm text-muted-foreground">{selected.length}/3 выбрано</span>
        </div>
      </header>

      <div className="flex-1 mx-auto max-w-5xl w-full px-4 py-6">
        {candidates.length < 2 ? (
          <div className="text-center py-20 text-muted-foreground">
            <GitCompare className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Нужно минимум 2 кандидата для сравнения.</p>
          </div>
        ) : (
          <>
            {/* Candidate selector */}
            <div className="mb-6">
              <div className="text-xs text-muted-foreground mb-2">Выберите 2-3 кандидатов:</div>
              <div className="flex flex-wrap gap-2">
                {candidates.map((c) => (
                  <button
                    key={c.login}
                    onClick={() => toggle(c.login)}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-all ${
                      selected.includes(c.login)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card hover:shadow-sm"
                    }`}
                  >
                    {c.avatar_url && <img src={c.avatar_url} alt="" className="h-4 w-4 rounded-full" />}
                    {c.name || c.login}
                  </button>
                ))}
              </div>
            </div>

            {/* Comparison table */}
            {selectedCandidates.length >= 2 && (
              <div className="overflow-x-auto rounded-xl border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="text-left p-3 w-32 text-xs font-medium text-muted-foreground">Поле</th>
                      {selectedCandidates.map((c) => (
                        <th key={c.login} className="text-left p-3 min-w-[180px]">
                          <div className="flex items-center gap-2">
                            {c.avatar_url && <img src={c.avatar_url} alt="" className="h-6 w-6 rounded-full" />}
                            <span className="font-semibold text-xs">{c.name || c.login}</span>
                            <button onClick={() => toggle(c.login)} className="ml-auto text-muted-foreground hover:text-foreground">
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {FIELDS.map((field, i) => (
                      <tr key={field.key} className={i % 2 === 0 ? "bg-card/30" : ""}>
                        <td className="p-3 text-xs font-medium text-muted-foreground">{field.label}</td>
                        {selectedCandidates.map((c) => (
                          <td key={c.login} className="p-3 text-xs">
                            {field.render(c)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectedCandidates.length < 2 && (
              <div className="text-center py-12 text-sm text-muted-foreground">
                Выберите минимум 2 кандидата для сравнения
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
