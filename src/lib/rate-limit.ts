import { NextRequest, NextResponse } from "next/server";

interface RateBucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, RateBucket>();
const MAX_REQUESTS = 30;
const WINDOW_MS = 60 * 1000;

function getClientIP(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

export function rateLimit(req: NextRequest): NextResponse | null {
  const ip = getClientIP(req);
  const now = Date.now();
  const bucket = buckets.get(ip);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return null;
  }

  bucket.count++;
  if (bucket.count > MAX_REQUESTS) {
    const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
    return NextResponse.json(
      { error: `Слишком много запросов. Попробуйте через ${retryAfter} сек.` },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfter) },
      }
    );
  }

  return null;
}
