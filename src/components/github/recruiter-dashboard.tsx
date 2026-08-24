"use client";

import * as React from "react";
import { ArrowLeft, Users, Mail, MapPin, TrendingUp, Clock, AlertTriangle } from "lucide-react";
import { useSelectionStore, Candidate, CandidateStatus, STATUS_LABELS, STATUS_COLORS, isStale, staleDays } from "./selection-store";
import { useUIStore } from "./ui-store";

const STATUSES: CandidateStatus[] = ["new", "reviewed", "contacted", "replied", "interested", "rejected"];

function getSource(c: Candidate): string {
  if (c.tags && c.tags.length > 0) return c.tags[0];
  return "github";
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} мин`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} ч`;
  return `${Math.floor(hours / 24)} дн`;
}

export function RecruiterDashboard() {
  const candidates = useSelectionStore((s) => s.candidates);
  const setApp = useUIStore((s) => s.setApp);

  const stats = React.useMemo(() => {
    const byStatus: Record<string, number> = {};
    const bySource: Record<string, number> = {};
    let withEmail = 0;
    let withLocation = 0;

    for (const c of candidates) {
      byStatus[c.status] = (byStatus[c.status] || 0) + 1;
      const src = getSource(c);
      bySource[src] = (bySource[src] || 0) + 1;
      if (c.email) withEmail++;
      if (c.location) withLocation++;
    }

    const total = candidates.length;
    const contacted = (byStatus["contacted"] || 0) + (byStatus["replied"] || 0) + (byStatus["interested"] || 0);
    const conversionRate = total > 0 ? Math.round((contacted / total) * 100) : 0;

    return { byStatus, bySource, withEmail, withLocation, total, conversionRate, contacted };
  }, [candidates]);

  const recent = React.useMemo(() => {
    return [...candidates]
      .sort((a, b) => (b.statusChangedAt || b.addedAt) - (a.statusChangedAt || a.addedAt))
      .slice(0, 8);
  }, [candidates]);

  const maxStatus = Math.max(1, ...Object.values(stats.byStatus));
  const maxSource = Math.max(1, ...Object.values(stats.bySource));
  const sourceColors: Record<string, string> = {
    github: "bg-emerald-500",
    linkedin: "bg-sky-500",
    vk: "bg-blue-500",
    habr: "bg-violet-500",
    hh: "bg-red-500",
    telegram: "bg-cyan-500",
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b bg-background/85 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
          <button onClick={() => setApp("launcher")} className="inline-flex items-center gap-2 text-sm hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Назад
          </button>
          <h1 className="font-bold text-base">Дашборд рекрутера</h1>
          <button onClick={() => setApp("kanban")} className="text-sm text-primary hover:underline">
            Kanban →
          </button>
        </div>
      </header>

      <div className="flex-1 mx-auto max-w-5xl w-full px-4 py-6 space-y-6">
        {candidates.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Нет кандидатов для аналитики.</p>
            <p className="text-sm mt-1">Добавьте кандидатов из поисковых систем.</p>
          </div>
        ) : (
          <>
            {/* Key stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard icon={<Users className="h-4 w-4" />} label="Всего" value={stats.total} accent="text-sky-500" />
              <StatCard icon={<Mail className="h-4 w-4" />} label="С email" value={stats.withEmail} accent="text-emerald-500" />
              <StatCard icon={<MapPin className="h-4 w-4" />} label="С локацией" value={stats.withLocation} accent="text-violet-500" />
              <StatCard icon={<TrendingUp className="h-4 w-4" />} label="Конверсия" value={`${stats.conversionRate}%`} accent="text-amber-500" />
            </div>

            {/* Funnel */}
            <div className="rounded-xl border bg-card p-5">
              <h2 className="font-semibold text-sm mb-4">Воронка по статусам</h2>
              <div className="space-y-2.5">
                {STATUSES.map((status) => {
                  const count = stats.byStatus[status] || 0;
                  const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                  return (
                    <div key={status} className="flex items-center gap-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full w-28 text-center ${STATUS_COLORS[status]}`}>
                        {STATUS_LABELS[status]}
                      </span>
                      <div className="flex-1 h-6 rounded-md bg-muted overflow-hidden">
                        <div
                          className={`h-full ${STATUS_COLORS[status].split(" ")[0].replace("text-", "bg-")} transition-all`}
                          style={{ width: `${(count / maxStatus) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold w-8 text-right">{count}</span>
                      <span className="text-xs text-muted-foreground w-10 text-right">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Source effectiveness with conversion */}
            <div className="rounded-xl border bg-card p-5">
              <h2 className="font-semibold text-sm mb-4">Эффективность источников</h2>
              <div className="space-y-2.5">
                {Object.entries(stats.bySource)
                  .sort((a, b) => b[1] - a[1])
                  .map(([source, count]) => {
                    const srcCandidates = candidates.filter((c) => getSource(c) === source);
                    const srcContacted = srcCandidates.filter((c) =>
                      ["contacted", "replied", "interested"].includes(c.status)
                    ).length;
                    const convRate = count > 0 ? Math.round((srcContacted / count) * 100) : 0;
                    return (
                      <div key={source} className="flex items-center gap-3">
                        <span className="text-xs font-medium w-24 truncate">{source}</span>
                        <div className="flex-1 h-6 rounded-md bg-muted overflow-hidden">
                          <div
                            className={`h-full ${sourceColors[source] || "bg-slate-500"} transition-all`}
                            style={{ width: `${(count / maxSource) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold w-8 text-right">{count}</span>
                        <span className={`text-xs w-12 text-right font-medium ${convRate >= 40 ? "text-emerald-500" : convRate >= 20 ? "text-amber-500" : "text-muted-foreground"}`}>
                          {convRate}%
                        </span>
                      </div>
                    );
                  })}
              </div>
              <div className="text-[10px] text-muted-foreground mt-2">% — конверсия в &quot;Связались+&quot;</div>
            </div>

            {/* Stale candidates — need attention */}
            {candidates.filter(isStale).length > 0 && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
                <h2 className="font-semibold text-sm mb-3 flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="h-4 w-4" />
                  Требуют внимания ({candidates.filter(isStale).length})
                </h2>
                <div className="space-y-1.5">
                  {candidates.filter(isStale).map((c) => (
                    <div key={c.login} className="flex items-center gap-3 py-1">
                      {c.avatar_url && <img src={c.avatar_url} alt="" className="h-6 w-6 rounded-full" />}
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium truncate">{c.name || c.login}</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${STATUS_COLORS[c.status]}`}>
                        {STATUS_LABELS[c.status]}
                      </span>
                      <span className="text-[11px] text-amber-500 font-medium w-20 text-right">
                        {staleDays(c)} дн
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent activity */}
            <div className="rounded-xl border bg-card p-5">
              <h2 className="font-semibold text-sm mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Недавняя активность
              </h2>
              <div className="space-y-2">
                {recent.map((c) => (
                  <div key={c.login} className="flex items-center gap-3 py-1.5 border-b last:border-0">
                    {c.avatar_url && <img src={c.avatar_url} alt="" className="h-7 w-7 rounded-full" />}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{c.name || c.login}</div>
                      <div className="text-[11px] text-muted-foreground">{getSource(c)} · {c.position || "—"}</div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${STATUS_COLORS[c.status]}`}>
                      {STATUS_LABELS[c.status]}
                    </span>
                    <span className="text-[11px] text-muted-foreground w-16 text-right">
                      {timeAgo(c.statusChangedAt || c.addedAt)} назад
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string | number; accent: string }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className={`flex items-center gap-1.5 mb-1 ${accent}`}>
        {icon}
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
