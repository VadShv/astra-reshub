import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// In-memory cache so repeat profile views don't burn the GitHub rate limit.
// TTL 10 minutes — profiles rarely change and this is recruiter-facing analytics.
interface CacheEntry {
  data: any;
  ts: number;
  status: number;
}
const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 10 * 60 * 1000;

// Fetch a single GitHub user's full profile (bio, location, company, email...).
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const login = searchParams.get("login");
  if (!login) {
    return NextResponse.json({ error: "Параметр login обязателен." }, { status: 400 });
  }

  // Serve from cache if fresh.
  const cached = cache.get(login);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return NextResponse.json(cached.data, { status: cached.status });
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
    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(login)}`, {
      headers,
    });

    if (res.status === 404) {
      return NextResponse.json({ error: "Пользователь не найден." }, { status: 404 });
    }

    // Rate limited — surface a friendly, structured error.
    if (res.status === 403 || res.status === 429) {
      const remaining = res.headers.get("x-ratelimit-remaining");
      const reset = res.headers.get("x-ratelimit-reset");
      if (remaining === "0") {
        const resetIn = reset
          ? Math.max(0, parseInt(reset, 10) - Math.floor(Date.now() / 1000))
          : 60;
        return NextResponse.json(
          {
            error: `Лимит запросов GitHub исчерпан. Попробуйте через ${Math.ceil(
              resetIn / 60
            )} мин или добавьте токен в «Настройках».`,
            rateLimited: true,
            resetIn,
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

    const data = await res.json();
    const profile = {
      login: data.login,
      id: data.id,
      name: data.name,
      avatar_url: data.avatar_url,
      html_url: data.html_url,
      type: data.type,
      company: data.company,
      blog: data.blog,
      location: data.location,
      email: data.email,
      bio: data.bio,
      twitter_username: data.twitter_username,
      public_repos: data.public_repos,
      public_gists: data.public_gists,
      followers: data.followers,
      following: data.following,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };

    cache.set(login, { data: profile, ts: Date.now(), status: 200 });
    return NextResponse.json(profile);
  } catch (e: any) {
    return NextResponse.json(
      { error: "Не удалось связаться с GitHub.", detail: e?.message },
      { status: 502 }
    );
  }
}
