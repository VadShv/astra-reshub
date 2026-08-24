import { NextRequest, NextResponse } from "next/server";
import { buildQuery, SearchFilters, SearchType } from "@/lib/github";
import { rateLimit } from "@/lib/rate-limit";

// In-memory cache to respect GitHub rate limits and speed up repeat queries.
interface CacheEntry {
  data: any;
  ts: number;
}
const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 60 * 1000; // 60 seconds
const MAX_CACHE_SIZE = 500;

function evictCache() {
  if (cache.size <= MAX_CACHE_SIZE) return;
  const now = Date.now();
  for (const [key, entry] of cache) {
    if (now - entry.ts > CACHE_TTL) cache.delete(key);
  }
  if (cache.size > MAX_CACHE_SIZE) {
    const oldest = [...cache.entries()].sort((a, b) => a[1].ts - b[1].ts);
    for (let i = 0; i < oldest.length - MAX_CACHE_SIZE; i++) {
      cache.delete(oldest[i][0]);
    }
  }
}

const TYPE_TO_PATH: Record<SearchType, string> = {
  repositories: "repositories",
  users: "users",
  code: "code",
  issues: "issues",
  commits: "commits",
  topics: "topics",
};

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const limited = rateLimit(req);
  if (limited) return limited;

  const { searchParams } = new URL(req.url);

  const type = (searchParams.get("type") || "repositories") as SearchType;
  const query = searchParams.get("q") || "";
  const sort = searchParams.get("sort") || undefined;
  const order = (searchParams.get("order") as "asc" | "desc") || undefined;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const perPage = Math.min(100, Math.max(1, parseInt(searchParams.get("perPage") || "30", 10)));

  // Gather structured filters and rebuild the GitHub `q` qualifier string.
  const filters: SearchFilters = {
    query,
    type,
    language: searchParams.get("language") || undefined,
    starsMin: searchParams.get("starsMin") || undefined,
    starsMax: searchParams.get("starsMax") || undefined,
    forksMin: searchParams.get("forksMin") || undefined,
    forksMax: searchParams.get("forksMax") || undefined,
    sizeMin: searchParams.get("sizeMin") || undefined,
    sizeMax: searchParams.get("sizeMax") || undefined,
    createdAfter: searchParams.get("createdAfter") || undefined,
    createdBefore: searchParams.get("createdBefore") || undefined,
    pushedAfter: searchParams.get("pushedAfter") || undefined,
    pushedBefore: searchParams.get("pushedBefore") || undefined,
    license: searchParams.get("license") || undefined,
    topics: searchParams.get("topics") || undefined,
    userLocation: searchParams.get("userLocation") || undefined,
    followersMinUser: searchParams.get("followersMinUser") || undefined,
    reposMin: searchParams.get("reposMin") || undefined,
    repoUser: searchParams.get("repoUser") || undefined,
    org: searchParams.get("org") || undefined,
    isFork: (searchParams.get("isFork") as any) || undefined,
    isArchived: (searchParams.get("isArchived") as any) || undefined,
    hasIssues: searchParams.get("hasIssues") === "true" || undefined,
    hasTopics: searchParams.get("hasTopics") === "true" || undefined,
    hasWiki: searchParams.get("hasWiki") === "true" || undefined,
    hasOpenIssues: searchParams.get("hasOpenIssues") === "true" || undefined,
    state: (searchParams.get("state") as any) || undefined,
    sort,
    order,
    page,
    perPage,
  };

  const q = buildQuery(filters).trim();

  if (!q) {
    return NextResponse.json(
      { error: "Пустой поисковый запрос. Введите ключевые слова или примените фильтры." },
      { status: 400 }
    );
  }

  let finalQ = q;

  const cacheKey = `${type}:${finalQ}:${sort || ""}:${order || ""}:${page}:${perPage}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  const path = TYPE_TO_PATH[type];
  const ghUrl = new URL(`https://api.github.com/search/${path}`);
  ghUrl.searchParams.set("q", finalQ);
  if (sort && sort !== "best-match") ghUrl.searchParams.set("sort", sort);
  if (order) ghUrl.searchParams.set("order", order);
  ghUrl.searchParams.set("page", String(page));
  ghUrl.searchParams.set("per_page", String(perPage));

  // For code search, request text-match fragments so we can highlight matches.
  const accept =
    type === "code"
      ? "application/vnd.github.v3.text-match+json"
      : "application/vnd.github+json";

  const headers: Record<string, string> = {
    Accept: accept,
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "github-search-app",
  };

  // Optional token: prefer a user-provided token from the request header
  // (personal access token entered in Settings), fall back to an env token.
  const userToken = req.headers.get("x-github-token");
  const token = userToken || process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(ghUrl.toString(), { headers });

    if (res.status === 401) {
      return NextResponse.json(
        {
          error:
            "Для этого типа поиска требуется авторизация. Откройте «Настройки» и добавьте персональный GitHub-токен (PAT).",
          requiresAuth: true,
        },
        { status: 401 }
      );
    }

    if (res.status === 403) {
      const remaining = res.headers.get("x-ratelimit-remaining");
      const reset = res.headers.get("x-ratelimit-reset");
      if (remaining === "0") {
        const resetIn = reset ? Math.max(0, parseInt(reset, 10) - Math.floor(Date.now() / 1000)) : 60;
        return NextResponse.json(
          {
            error: `Лимит запросов GitHub исчерпан. Попробуйте через ${resetIn} сек.`,
            rateLimited: true,
            resetIn,
          },
          { status: 429 }
        );
      }
    }

    if (res.status === 422) {
      const body = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: body?.message || "Некорректный поисковый запрос.", raw: body },
        { status: 422 }
      );
    }

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json(
        { error: `Ошибка GitHub API (${res.status}).` },
        { status: res.status }
      );
    }

    const data = await res.json();

    const rateLimit = {
      remaining: parseInt(res.headers.get("x-ratelimit-remaining") || "0", 10),
      limit: parseInt(res.headers.get("x-ratelimit-limit") || "0", 10),
      reset: parseInt(res.headers.get("x-ratelimit-reset") || "0", 10),
    };

    const payload = {
      total_count: data.total_count,
      incomplete_results: data.incomplete_results,
      items: data.items || [],
      rateLimit,
      query: finalQ,
    };

    cache.set(cacheKey, { data: payload, ts: Date.now() });
    evictCache();

    return NextResponse.json(payload);
  } catch {
    return NextResponse.json(
      { error: "Не удалось связаться с GitHub." },
      { status: 502 }
    );
  }
}
