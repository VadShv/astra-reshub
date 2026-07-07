"use client";

import * as React from "react";
import {
  History,
  Bookmark,
  Trash2,
  Search,
  Star,
  Clock,
  X,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSearchStore } from "./store";
import { SearchType } from "@/lib/github";
import { timeAgo } from "@/lib/github";

const TYPE_LABELS: Record<SearchType, string> = {
  repositories: "Репозитории",
  users: "Пользователи",
  code: "Код",
  issues: "Issues",
  commits: "Коммиты",
  topics: "Темы",
};

export function HistorySavedPanel({ onApply }: { onApply: () => void }) {
  const {
    history,
    saved,
    clearHistory,
    removeHistory,
    removeSaved,
    saveSearch,
    applyEntry,
    query,
    type,
  } = useSearchStore();

  const [saveName, setSaveName] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const handleApply = (entry: any) => {
    applyEntry(entry);
    onApply();
  };

  const handleSave = () => {
    saveSearch(saveName || query || "Без названия");
    setSaveName("");
    setOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Saved searches */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Bookmark className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Сохранённые запросы</h3>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                disabled={!query}
                title={!query ? "Введите запрос для сохранения" : "Сохранить текущий запрос"}
              >
                <Plus className="h-3 w-3 mr-1" />
                Сохранить
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Сохранить поисковый запрос</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <Input
                  placeholder={query || "Название запроса"}
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  autoFocus
                />
                <div className="text-xs text-muted-foreground">
                  Запрос: <span className="font-mono">{query || "—"}</span>
                  <Badge variant="outline" className="ml-2 text-[10px]">
                    {TYPE_LABELS[type]}
                  </Badge>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Отмена
                </Button>
                <Button onClick={handleSave}>Сохранить</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        {saved.length === 0 ? (
          <p className="text-xs text-muted-foreground px-1">
            Нет сохранённых запросов. Сохраняйте частые запросы для быстрого доступа.
          </p>
        ) : (
          <ScrollArea className="max-h-72">
            <div className="space-y-1.5 pr-2">
              {saved.map((s) => (
                <div
                  key={s.id}
                  className="group flex items-center gap-2 rounded-md border p-2 hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => handleApply({ query: s.query, type: s.type, filters: s.filters })}
                >
                  <Bookmark className="h-3.5 w-3.5 text-primary shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{s.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate font-mono">
                      {s.query || "(только фильтры)"}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[9px] py-0 shrink-0">
                    {TYPE_LABELS[s.type]}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSaved(s.id);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </section>

      {/* Search history */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">История поиска</h3>
          </div>
          {history.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={clearHistory}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Очистить
            </Button>
          )}
        </div>
        {history.length === 0 ? (
          <p className="text-xs text-muted-foreground px-1">
            История пуста. Выполните первый поиск.
          </p>
        ) : (
          <ScrollArea className="max-h-72">
            <div className="space-y-1.5 pr-2">
              {history.map((h) => (
                <div
                  key={h.id}
                  className="group flex items-center gap-2 rounded-md border p-2 hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => handleApply({ query: h.query, type: h.type, filters: h.filters })}
                >
                  <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm truncate font-mono">
                      {h.query || "(только фильтры)"}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {TYPE_LABELS[h.type]} · {timeAgo(new Date(h.ts).toISOString())}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeHistory(h.id);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </section>
    </div>
  );
}
