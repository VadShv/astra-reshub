"use client";

import * as React from "react";
import {
  Star,
  GitFork,
  BookOpen,
  Users,
  Eye,
  TrendingUp,
  Activity,
  Award,
  Sparkles,
  Loader2,
  ExternalLink,
  MapPin,
  Building2,
  Calendar,
  Code2,
  Layers,
  AlertCircle,
  CheckCircle2,
  Info,
  Languages as LangIcon,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useSearchStore } from "./store";
import { useUIStore } from "./ui-store";
import { formatNumber, languageColor } from "@/lib/github";
import {
  analyzeProfile,
  ProfileAnalytics,
  RepoLite,
} from "@/lib/profile-analytics";
import { cn } from "@/lib/utils";

interface ProfileDashboardProps {
  login: string | null;
  onClose: () => void;
}

interface ProfileData {
  login: string;
  name?: string | null;
  avatar_url: string;
  html_url: string;
  bio?: string | null;
  company?: string | null;
  blog?: string | null;
  location?: string | null;
  email?: string | null;
  twitter_username?: string | null;
  followers?: number;
  following?: number;
  public_repos?: number;
  public_gists?: number;
  created_at?: string;
  updated_at?: string;
  type?: string;
}

export function ProfileDashboard({ login, onClose }: ProfileDashboardProps) {
  const open = !!login;
  const githubToken = useSearchStore((s) => s.githubToken);
  const initialItem = useUIStore((s) => s.dashboardInitial);
  const [profile, setProfile] = React.useState<ProfileData | null>(null);
  const [repos, setRepos] = React.useState<RepoLite[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [warning, setWarning] = React.useState<string | null>(null);

  // Build a baseline profile from the search item so the dashboard renders
  // INSTANTLY — even before (or instead of) the enrichment API call.
  const baselineProfile = React.useMemo<ProfileData | null>(() => {
    if (!login) return null;
    const it = initialItem || {};
    return {
      login,
      name: it.name || null,
      avatar_url: it.avatar_url || "",
      html_url: it.html_url || `https://github.com/${login}`,
      bio: it.bio || null,
      company: it.company || null,
      blog: it.blog || null,
      location: it.location || null,
      email: it.email || null,
      twitter_username: it.twitter_username || null,
      followers: it.followers,
      following: it.following,
      public_repos: it.public_repos,
      public_gists: it.public_gists,
      created_at: it.created_at,
      updated_at: it.updated_at,
      type: it.type,
    };
  }, [login, initialItem]);

  React.useEffect(() => {
    if (!login) {
      setProfile(null);
      setRepos([]);
      setWarning(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setWarning(null);
    // Show baseline immediately so the user sees content, not a blank spinner.
    setProfile(baselineProfile);
    setRepos([]);

    const headers: Record<string, string> = {};
    if (githubToken) headers["x-github-token"] = githubToken;

    (async () => {
      try {
        const [pRes, rRes] = await Promise.all([
          fetch(`/api/github/user?login=${encodeURIComponent(login)}`, { headers }),
          fetch(`/api/github/repos?login=${encodeURIComponent(login)}`, { headers }),
        ]);
        if (cancelled) return;

        // Profile: enrich if OK, otherwise keep baseline + friendly warning.
        let profileData = baselineProfile;
        if (pRes.ok) {
          profileData = await pRes.json();
        } else {
          const pErr = await pRes.json().catch(() => ({}));
          if (pErr?.rateLimited) {
            setWarning(
              pErr.error ||
                "Лимит GitHub исчерпан. Базовые данные показаны — добавьте токен для полной аналитики."
            );
          } else if (pRes.status !== 404) {
            setWarning("Профиль загрузится позже. Показаны базовые данные из поиска.");
          }
        }
        if (cancelled) return;
        setProfile(profileData);

        // Repos: load if OK, else warn but keep dashboard usable.
        if (rRes.ok) {
          const rData = await rRes.json();
          setRepos(rData.repos || []);
        } else {
          const rErr = await rRes.json().catch(() => ({}));
          if (rErr?.rateLimited && !warning) {
            setWarning(
              "Лимит GitHub исчерпан — графики языков и активность загрузятся при повторном открытии. Профиль и KPI доступны."
            );
          } else if (!warning) {
            setWarning("Не удалось загрузить репозитории. Профиль и базовые KPI доступны.");
          }
        }
      } catch (e: any) {
        if (!cancelled) {
          // Network error — but we still keep the baseline profile visible.
          setWarning("Сетевая ошибка. Показаны базовые данные из поиска.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [login, githubToken, baselineProfile]);

  const analytics = React.useMemo(
    () => (profile ? analyzeProfile(repos, profile) : null),
    [profile, repos]
  );

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-4xl w-[95vw] h-[90vh] p-0 gap-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-5 pt-5 pb-3 border-b shrink-0">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-primary" />
            Дашборд профиля разработчика
          </DialogTitle>
          <DialogDescription className="sr-only">
            Аналитика по профилю GitHub: языки, звёзды, репозитории и инсайты
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="p-5">
            {loading && !profile ? (
              <DashboardSkeleton />
            ) : profile && analytics ? (
              <DashboardBody
                profile={profile}
                analytics={analytics}
                warning={warning}
                loading={loading}
              />
            ) : null}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function DashboardBody({
  profile,
  analytics,
  warning,
  loading,
}: {
  profile: ProfileData;
  analytics: ProfileAnalytics;
  warning?: string | null;
  loading?: boolean;
}) {
  return (
    <div className="space-y-5">
      {warning && (
        <div className="flex items-start gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-700 dark:text-amber-400">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{warning}</span>
        </div>
      )}
      {loading && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
          Загружаем полные данные профиля и репозитории…
        </div>
      )}
      {/* Profile header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Avatar className="h-16 w-16 rounded-2xl border-2 shrink-0">
          <AvatarImage src={profile.avatar_url} alt={profile.login} />
          <AvatarFallback className="rounded-2xl text-lg">
            {profile.login?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold truncate">
              {profile.name || profile.login}
            </h2>
            <a
              href={profile.html_url}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-primary"
              title="Открыть на GitHub"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <SeniorityBadge level={analytics.seniority} score={analytics.seniorityScore} />
          </div>
          <p className="text-sm text-muted-foreground font-mono">@{profile.login}</p>
          {profile.bio && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{profile.bio}</p>
          )}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-2">
            {profile.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {profile.location}
              </span>
            )}
            {profile.company && (
              <span className="flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {profile.company}
              </span>
            )}
            {profile.created_at && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                с {new Date(profile.created_at).getFullYear()} ({Math.floor(analytics.accountAgeYears)} лет)
              </span>
            )}
            {analytics.lastActiveDays >= 0 && (
              <span className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                активен {analytics.lastActiveDays === 0 ? "сегодня" : `${analytics.lastActiveDays} дн назад`}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Kpi
          icon={<Star className="h-4 w-4" />}
          label="Звёзды"
          value={analytics.totalStars}
          color="text-amber-500"
        />
        <Kpi
          icon={<BookOpen className="h-4 w-4" />}
          label="Репозитории"
          value={analytics.totalRepos}
          color="text-emerald-500"
          sub={`${analytics.originalRepos} ориг.`}
        />
        <Kpi
          icon={<GitFork className="h-4 w-4" />}
          label="Форки"
          value={analytics.totalForks}
          color="text-violet-500"
        />
        <Kpi
          icon={<Users className="h-4 w-4" />}
          label="Подписчики"
          value={profile.followers || 0}
          color="text-sky-500"
        />
        <Kpi
          icon={<Eye className="h-4 w-4" />}
          label="Вотчеры"
          value={analytics.totalWatchers}
          color="text-rose-500"
        />
        <Kpi
          icon={<TrendingUp className="h-4 w-4" />}
          label="Ср. звёзд/репо"
          value={analytics.avgStarsPerRepo}
          color="text-cyan-500"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Languages */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <LangIcon className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Языки программирования</h3>
          </div>
          {analytics.languages.length === 0 ? (
            <EmptyHint text="Нет данных о языках" />
          ) : (
            <div className="flex items-center gap-4">
              <div className="h-44 w-44 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.languages}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={42}
                      outerRadius={70}
                      paddingAngle={2}
                      stroke="none"
                    >
                      {analytics.languages.map((l) => (
                        <Cell key={l.name} fill={l.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid var(--border)",
                        background: "var(--popover)",
                        fontSize: 12,
                      }}
                      formatter={(v: any, _n, p: any) => [
                        `${v} репо (${p.payload.pct}%)`,
                        p.payload.name,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-1.5 min-w-0">
                {analytics.languages.slice(0, 6).map((l) => (
                  <div key={l.name} className="flex items-center gap-2 text-sm">
                    <span
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ backgroundColor: l.color }}
                    />
                    <span className="truncate flex-1">{l.name}</span>
                    <span className="text-muted-foreground font-mono text-xs">
                      {l.pct}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Activity by year */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Активность по годам</h3>
          </div>
          {analytics.activity.length === 0 ? (
            <EmptyHint text="Нет данных об активности" />
          ) : (
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.activity} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.4} />
                  <XAxis
                    dataKey="year"
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                      background: "var(--popover)",
                      fontSize: 12,
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: 11 }}
                    iconType="circle"
                  />
                  <Bar dataKey="created" name="Создано" fill="#10b981" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="pushed" name="Обновлено" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      {/* Insights */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Инсайты и оценка</h3>
        </div>
        <div className="space-y-2">
          {analytics.insights.map((ins, i) => (
            <div key={i} className="flex items-start gap-2.5 text-sm">
              {ins.kind === "positive" ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              ) : ins.kind === "warning" ? (
                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              ) : (
                <Info className="h-4 w-4 text-sky-500 shrink-0 mt-0.5" />
              )}
              <span className="text-muted-foreground">{ins.text}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Top repos */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Award className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Топ репозиториев по звёздам</h3>
        </div>
        <div className="space-y-2">
          {analytics.topRepos.map((r) => (
            <div
              key={r.id}
              className="flex items-center gap-3 rounded-lg border bg-card/40 p-2.5 hover:bg-accent/40 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <a
                  href={r.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium hover:text-primary truncate inline-flex items-center gap-1"
                >
                  {r.name}
                  <ExternalLink className="h-3 w-3 opacity-50" />
                </a>
                {r.description && (
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                    {r.description}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground">
                  {r.language && (
                    <span className="flex items-center gap-1">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: languageColor(r.language) }}
                      />
                      {r.language}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {formatNumber(r.stargazers_count)}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="h-3 w-3" />
                    {formatNumber(r.forks_count)}
                  </span>
                  {(r.topics || []).slice(0, 2).map((t) => (
                    <Badge key={t} variant="secondary" className="text-[9px] py-0 px-1">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Topics + licenses */}
      {(analytics.topics.length > 0 || analytics.licenses.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {analytics.topics.length > 0 && (
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">Темы (топ-технологии)</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {analytics.topics.map((t) => (
                  <Badge key={t.name} variant="secondary" className="font-mono text-[11px]">
                    {t.name} · {t.count}
                  </Badge>
                ))}
              </div>
            </Card>
          )}
          {analytics.licenses.length > 0 && (
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Code2 className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">Лицензии</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {analytics.licenses.map((l) => (
                  <Badge key={l} variant="outline" className="text-[11px]">
                    {l}
                  </Badge>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

function Kpi({
  icon,
  label,
  value,
  color,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  sub?: string;
}) {
  return (
    <Card className="p-3 flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className={cn("text-muted-foreground", color)}>{icon}</span>
        {sub && <span className="text-[10px] text-muted-foreground">{sub}</span>}
      </div>
      <span className="text-xl font-bold tabular-nums">{formatNumber(value)}</span>
      <span className="text-[11px] text-muted-foreground">{label}</span>
    </Card>
  );
}

function SeniorityBadge({
  level,
  score,
}: {
  level: string;
  score: number;
}) {
  const colors: Record<string, string> = {
    Junior: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30",
    Mid: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30",
    Senior: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    Staff: "bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/30",
    Legend: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  };
  return (
    <Badge
      variant="outline"
      className={cn("gap-1 font-semibold", colors[level] || "")}
      title={`Оценка seniority: ${score}/100`}
    >
      <Award className="h-3 w-3" />
      {level}
      <span className="text-[10px] opacity-70">· {score}</span>
    </Badge>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <div className="h-32 flex items-center justify-center text-xs text-muted-foreground">
      {text}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton className="h-56 rounded-xl" />
        <Skeleton className="h-56 rounded-xl" />
      </div>
      <Skeleton className="h-32 rounded-xl" />
      <Skeleton className="h-48 rounded-xl" />
    </div>
  );
}
