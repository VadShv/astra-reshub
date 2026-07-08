import { languageColor } from "./github";

export interface RepoLite {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  topics: string[];
  size: number;
  fork: boolean;
  archived: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  license: string | null;
  homepage: string | null;
}

export interface LanguageStat {
  name: string;
  count: number;
  bytes: number; // approximated by repo size weighted
  pct: number;
  color: string;
}

export interface ActivityYear {
  year: number;
  created: number;
  pushed: number;
}

export type SeniorityLevel = "Junior" | "Mid" | "Senior" | "Staff" | "Legend";

export interface ProfileAnalytics {
  totalRepos: number;
  originalRepos: number;
  forkedRepos: number;
  totalStars: number;
  totalForks: number;
  totalWatchers: number;
  totalOpenIssues: number;
  avgStarsPerRepo: number;
  topStarredRepo: RepoLite | null;
  languages: LanguageStat[];
  activity: ActivityYear[];
  topRepos: RepoLite[];
  topics: { name: string; count: number }[];
  accountAgeYears: number;
  lastActiveDays: number;
  seniority: SeniorityLevel;
  seniorityScore: number;
  insights: { kind: "positive" | "neutral" | "warning"; text: string }[];
 licenses: string[];
}

/**
 * Analyze a list of a user's repositories and produce a structured dashboard
 * summary: language distribution, star/fork totals, activity timeline, an
 * estimated seniority level and a few human-readable insights.
 */
export function analyzeProfile(
  repos: RepoLite[],
  profile?: {
    login?: string;
    followers?: number;
    following?: number;
    public_repos?: number;
    created_at?: string;
    bio?: string | null;
  }
): ProfileAnalytics {
  const originalRepos = repos.filter((r) => !r.fork);
  const forkedRepos = repos.filter((r) => r.fork);

  const totalStars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);
  const totalForks = repos.reduce((s, r) => s + (r.forks_count || 0), 0);
  const totalWatchers = repos.reduce((s, r) => s + (r.watchers_count || 0), 0);
  const totalOpenIssues = repos.reduce((s, r) => s + (r.open_issues_count || 0), 0);
  const avgStarsPerRepo = repos.length ? Math.round(totalStars / repos.length) : 0;

  // Language distribution by repo count + weighted by repo size.
  const langCount = new Map<string, number>();
  const langBytes = new Map<string, number>();
  for (const r of originalRepos) {
    if (!r.language) continue;
    langCount.set(r.language, (langCount.get(r.language) || 0) + 1);
    langBytes.set(
      r.language,
      (langBytes.get(r.language) || 0) + Math.max(1, r.size || 1)
    );
  }
  const langTotal = Array.from(langCount.values()).reduce((a, b) => a + b, 0) || 1;
  const languages: LanguageStat[] = Array.from(langCount.entries())
    .map(([name, count]) => ({
      name,
      count,
      bytes: langBytes.get(name) || 0,
      pct: Math.round((count / langTotal) * 1000) / 10,
      color: languageColor(name),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Activity by year (creation + last push).
  const yearCreated = new Map<number, number>();
  const yearPushed = new Map<number, number>();
  for (const r of repos) {
    const yc = new Date(r.created_at).getFullYear();
    const yp = new Date(r.pushed_at).getFullYear();
    if (!isNaN(yc)) yearCreated.set(yc, (yearCreated.get(yc) || 0) + 1);
    if (!isNaN(yp)) yearPushed.set(yp, (yearPushed.get(yp) || 0) + 1);
  }
  const years = Array.from(
    new Set([...yearCreated.keys(), ...yearPushed.keys()])
  ).sort((a, b) => a - b);
  const activity: ActivityYear[] = years.map((year) => ({
    year,
    created: yearCreated.get(year) || 0,
    pushed: yearPushed.get(year) || 0,
  }));

  // Top repos by stars.
  const topRepos = [...repos]
    .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
    .slice(0, 6);

  const topStarredRepo = topRepos[0] || null;

  // Topic frequency.
  const topicMap = new Map<string, number>();
  for (const r of repos) {
    for (const t of r.topics || []) {
      topicMap.set(t, (topicMap.get(t) || 0) + 1);
    }
  }
  const topics = Array.from(topicMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Account age + last active.
  const createdAt = profile?.created_at || repos[0]?.created_at;
  const accountAgeYears = createdAt
    ? Math.max(0, (Date.now() - new Date(createdAt).getTime()) / (365.25 * 864e5))
    : 0;
  const lastPush = repos
    .map((r) => new Date(r.pushed_at).getTime())
    .filter((t) => !isNaN(t))
    .sort((a, b) => b - a)[0];
  const lastActiveDays = lastPush
    ? Math.floor((Date.now() - lastPush) / 864e5)
    : -1;

  // Seniority score (0-100) heuristic:
  //   - account age (max 25)
  //   - total stars (max 25, log scale)
  //   - original repos count (max 20)
  //   - followers (max 15, log scale)
  //   - language breadth (max 15)
  const followers = profile?.followers || 0;
  const scoreAge = Math.min(25, (accountAgeYears / 8) * 25);
  const scoreStars = Math.min(25, (Math.log10(totalStars + 1) / 4) * 25);
  const scoreRepos = Math.min(20, (originalRepos.length / 30) * 20);
  const scoreFollowers = Math.min(15, (Math.log10(followers + 1) / 4) * 15);
  const scoreBreadth = Math.min(15, (languages.length / 5) * 15);
  const seniorityScore = Math.round(
    scoreAge + scoreStars + scoreRepos + scoreFollowers + scoreBreadth
  );

  let seniority: SeniorityLevel = "Junior";
  if (seniorityScore >= 80) seniority = "Legend";
  else if (seniorityScore >= 65) seniority = "Staff";
  else if (seniorityScore >= 45) seniority = "Senior";
  else if (seniorityScore >= 28) seniority = "Mid";

  // Insights — short human-readable observations.
  const insights: ProfileAnalytics["insights"] = [];
  if (topStarredRepo && topStarredRepo.stargazers_count >= 100) {
    insights.push({
      kind: "positive",
      text: `Хит «${topStarredRepo.name}» собрал ${topStarredRepo.stargazers_count.toLocaleString(
        "ru-RU"
      )} ★ — сильный сигнал признания сообществом.`,
    });
  }
  if (languages.length >= 4) {
    insights.push({
      kind: "positive",
      text: `Широкий стек: ${languages
        .slice(0, 4)
        .map((l) => l.name)
        .join(", ")} — мультиязычный инженер.`,
    });
  }
  if (lastActiveDays >= 0 && lastActiveDays <= 30) {
    insights.push({
      kind: "positive",
      text: `Активен ${lastActiveDays === 0 ? "сегодня" : `${lastActiveDays} дн. назад`} — свежие коммиты, кандидат в работе.`,
    });
  } else if (lastActiveDays > 180) {
    insights.push({
      kind: "warning",
      text: `Последний пуш ${Math.round(lastActiveDays / 30)} мес. назад — возможен перерыв или смена фокуса.`,
    });
  }
  if (forkedRepos.length > originalRepos.length && originalRepos.length < 5) {
    insights.push({
      kind: "neutral",
      text: `Больше форков (${forkedRepos.length}), чем оригинальных репо (${originalRepos.length}) — скорее ученик/контрибьютор, чем автор.`,
    });
  } else if (originalRepos.length >= 20) {
    insights.push({
      kind: "positive",
      text: `${originalRepos.length} собственных репозиториев — высокая продуктивность и инициативность.`,
    });
  }
  if (accountAgeYears >= 5) {
    insights.push({
      kind: "neutral",
      text: `На GitHub ${Math.floor(accountAgeYears)} лет — зрелый, устоявшийся профиль.`,
    });
  }
  if (followers >= 500) {
    insights.push({
      kind: "positive",
      text: `${followers.toLocaleString("ru-RU")} подписчиков — заметная репутация в комьюнити.`,
    });
  }
  const mainLang = languages[0];
  if (mainLang) {
    insights.push({
      kind: "neutral",
      text: `Основной язык — ${mainLang.name} (${mainLang.pct}% репозиториев).`,
    });
  }
  if (insights.length === 0) {
    insights.push({
      kind: "neutral",
      text: "Профиль с базовой активностью. Подходит для среднего уровня.",
    });
  }

  const licenses = Array.from(
    new Set(repos.map((r) => r.license).filter(Boolean) as string[])
  ).slice(0, 5);

  return {
    totalRepos: repos.length,
    originalRepos: originalRepos.length,
    forkedRepos: forkedRepos.length,
    totalStars,
    totalForks,
    totalWatchers,
    totalOpenIssues,
    avgStarsPerRepo,
    topStarredRepo,
    languages,
    activity,
    topRepos,
    topics,
    accountAgeYears,
    lastActiveDays,
    seniority,
    seniorityScore,
    insights,
    licenses,
  };
}
