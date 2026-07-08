import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// In-memory cache so repeat dashboard opens don't re-hit GitHub.
interface CacheEntry {
  data: any;
  ts: number;
}
const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 10 * 60 * 1000;

// Fetch a user's public repositories (for profile analytics: languages,
// stars, forks, activity over time). Paginated up to 100 per request; we fetch
// up to 4 pages (400 repos) which is enough for a meaningful dashboard while
// staying within rate limits.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const login = searchParams.get("login");
  if (!login) {
    return NextResponse.json({ error: "Параметр login обязателен." }, { status: 400 });
  }

  // Serve from cache if fresh.
  const cached = cache.get(login);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "github-search-app",
  };

  const userToken = req.headers.get("x-github-token");
  const token = userToken || process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const allRepos: any[] = [];
    // Single page of 100 repos is enough for a meaningful analytics dashboard
    // and keeps us within GitHub's tight unauthenticated rate limits.
    const url = `https://api.github.com/users/${encodeURIComponent(
      login
    )}/repos?per_page=100&page=1&sort=updated&type=owner`;
    const res = await fetch(url, { headers });

    if (res.status === 404) {
      return NextResponse.json({ error: "Пользователь не найден." }, { status: 404 });
    }
    if (res.status === 403 || res.status === 429) {
      const remaining = res.headers.get("x-ratelimit-remaining");
      if (remaining === "0") {
        return NextResponse.json(
          {
            error: "Лимит запросов GitHub исчерпан. Попробуйте позже или добавьте токен.",
            rateLimited: true,
          },
          { status: 429 }
        );
      }
    }
    if (!res.ok) {
      return NextResponse.json(
        { error: `Ошибка GitHub API (${res.status}).` },
        { status: res.status }
      );
    }

    const batch = await res.json();
    if (Array.isArray(batch)) {
      allRepos.push(...batch);
    }

    // Keep only fields needed for analytics to keep the payload small.
    const slim = allRepos.map((r) => ({
      id: r.id,
      name: r.name,
      full_name: r.full_name,
      html_url: r.html_url,
      description: r.description,
      language: r.language,
      stargazers_count: r.stargazers_count,
      forks_count: r.forks_count,
      watchers_count: r.watchers_count,
      open_issues_count: r.open_issues_count,
      topics: r.topics || [],
      size: r.size,
      fork: r.fork,
      archived: r.archived,
      created_at: r.created_at,
      updated_at: r.updated_at,
      pushed_at: r.pushed_at,
      license: r.license?.spdx_id || null,
      homepage: r.homepage || null,
    }));

    const rateLimit = {
      remaining: parseInt(res.headers.get("x-ratelimit-remaining") || "0", 10),
      limit: parseInt(res.headers.get("x-ratelimit-limit") || "0", 10),
    };

    const payload = {
      repos: slim,
      count: slim.length,
      rateLimit,
    };
    cache.set(login, { data: payload, ts: Date.now() });
    return NextResponse.json(payload);
  } catch (e: any) {
    return NextResponse.json(
      { error: "Не удалось связаться с GitHub.", detail: e?.message },
      { status: 502 }
    );
  }
}
