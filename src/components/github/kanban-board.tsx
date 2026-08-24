"use client";

import * as React from "react";
import { ArrowLeft, GripVertical } from "lucide-react";
import {
  useSelectionStore,
  Candidate,
  CandidateStatus,
  STATUS_LABELS,
  STATUS_COLORS,
} from "./selection-store";
import { useUIStore } from "./ui-store";

const STATUSES: CandidateStatus[] = [
  "new",
  "reviewed",
  "contacted",
  "replied",
  "interested",
  "rejected",
];

const COLUMN_ACCENTS: Record<CandidateStatus, string> = {
  new: "border-t-sky-500",
  reviewed: "border-t-violet-500",
  contacted: "border-t-amber-500",
  replied: "border-t-cyan-500",
  interested: "border-t-emerald-500",
  rejected: "border-t-rose-500",
};

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "только что";
  if (mins < 60) return `${mins} мин назад`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} ч назад`;
  const days = Math.floor(hours / 24);
  return `${days} дн назад`;
}

function getSource(c: Candidate): string {
  if (c.tags && c.tags.length > 0) return c.tags[0];
  return "github";
}

export function KanbanBoard() {
  const candidates = useSelectionStore((s) => s.candidates);
  const setStatus = useSelectionStore((s) => s.setStatus);
  const setApp = useUIStore((s) => s.setApp);
  const [dragId, setDragId] = React.useState<string | null>(null);
  const [dragOver, setDragOver] = React.useState<CandidateStatus | null>(null);

  function onDrop(status: CandidateStatus) {
    if (dragId) {
      setStatus(dragId, status);
    }
    setDragId(null);
    setDragOver(null);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b bg-background/85 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => setApp("launcher")}
            className="inline-flex items-center gap-2 text-sm hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Назад
          </button>
          <h1 className="font-bold text-base">Kanban — Воронка кандидатов</h1>
          <span className="text-sm text-muted-foreground">
            {candidates.length} кандидатов
          </span>
        </div>
      </header>

      <div className="flex-1 overflow-x-auto p-4">
        <div className="flex gap-4 min-w-max">
          {STATUSES.map((status) => {
            const items = candidates.filter((c) => c.status === status);
            return (
              <div
                key={status}
                className={`w-72 shrink-0 rounded-xl border border-t-4 ${COLUMN_ACCENTS[status]} bg-card ${
                  dragOver === status ? "ring-2 ring-primary" : ""
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(status);
                }}
                onDragLeave={() => setDragOver(null)}
                onDrop={() => onDrop(status)}
              >
                <div className="p-3 border-b">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[status]}`}>
                      {STATUS_LABELS[status]}
                    </span>
                    <span className="text-xs text-muted-foreground">{items.length}</span>
                  </div>
                </div>
                <div className="p-2 space-y-2 max-h-[calc(100vh-180px)] overflow-y-auto">
                  {items.map((c) => (
                    <div
                      key={c.login}
                      draggable
                      onDragStart={() => setDragId(c.login)}
                      onDragEnd={() => setDragId(null)}
                      className={`rounded-lg border bg-background p-3 cursor-grab active:cursor-grabbing hover:shadow-sm transition-all ${
                        dragId === c.login ? "opacity-50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {c.avatar_url && (
                          <img
                            src={c.avatar_url}
                            alt=""
                            className="h-8 w-8 rounded-full shrink-0"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium truncate">
                            {c.name || c.login}
                          </div>
                          {c.position && (
                            <div className="text-[11px] text-muted-foreground truncate">
                              {c.position}
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                              {getSource(c)}
                            </span>
                            {c.location && (
                              <span className="text-[10px] text-muted-foreground truncate">
                                {c.location}
                              </span>
                            )}
                          </div>
                          {c.statusChangedAt && (
                            <div className="text-[10px] text-muted-foreground mt-1">
                              {timeAgo(c.statusChangedAt)}
                            </div>
                          )}
                        </div>
                        <GripVertical className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
                      </div>
                    </div>
                  ))}
                  {items.length === 0 && (
                    <div className="text-center py-8 text-xs text-muted-foreground/50">
                      Перетащите сюда
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
