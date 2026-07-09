"use client";

import { Candidate } from "@/components/github/selection-store";

// ---------------------------------------------------------------------------
// Export utilities — generate a candidate selection file entirely in-browser.
// Supported output:
//   • CSV (HuntFlow / «ХАНТ» compatible, semicolon-separated, UTF-8 BOM)
//   • XLSX-friendly CSV (same, just .csv opened by Excel)
//   • JSON (full structured data)
// ---------------------------------------------------------------------------

export type ExportFormat = "huntflow-csv" | "json";

function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  let str = String(value);
  // Escape double quotes by doubling them, wrap in quotes.
  str = str.replace(/"/g, '""');
  // If the cell contains a delimiter, quote, or newline — wrap in quotes.
  if (/[";\n\r]/.test(str)) {
    str = `"${str}"`;
  }
  return str;
}

function splitName(candidate: Candidate): { firstName: string; lastName: string } {
  const raw = (candidate.name || candidate.login || "").trim();
  if (!raw) return { firstName: candidate.login || "", lastName: "" };
  const parts = raw.split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

function inferPosition(candidate: Candidate): string {
  if (candidate.position) return candidate.position;
  // Try to guess from bio.
  const bio = candidate.bio || "";
  const lower = bio.toLowerCase();
  const keywords: { kw: string; title: string }[] = [
    { kw: "senior", title: "Senior Developer" },
    { kw: "lead", title: "Tech Lead" },
    { kw: "staff", title: "Staff Engineer" },
    { kw: "principal", title: "Principal Engineer" },
    { kw: "frontend", title: "Frontend Developer" },
    { kw: "front-end", title: "Frontend Developer" },
    { kw: "backend", title: "Backend Developer" },
    { kw: "back-end", title: "Backend Developer" },
    { kw: "fullstack", title: "Fullstack Developer" },
    { kw: "full-stack", title: "Fullstack Developer" },
    { kw: "devops", title: "DevOps Engineer" },
    { kw: "data scientist", title: "Data Scientist" },
    { kw: "ml engineer", title: "ML Engineer" },
    { kw: "mobile", title: "Mobile Developer" },
    { kw: "ios", title: "iOS Developer" },
    { kw: "android", title: "Android Developer" },
    { kw: "react", title: "React Developer" },
    { kw: "rust", title: "Rust Developer" },
    { kw: "golang", title: "Go Developer" },
    { kw: "python", title: "Python Developer" },
  ];
  for (const { kw, title } of keywords) {
    if (lower.includes(kw)) return title;
  }
  return candidate.type === "Organization" ? "Organization" : "Developer";
}

function buildComment(candidate: Candidate): string {
  const parts: string[] = [];
  if (candidate.bio) parts.push(candidate.bio);
  const isLinkedIn = candidate.tags?.includes("linkedin");
  const stats: string[] = [];
  if (candidate.public_repos !== undefined)
    stats.push(`${candidate.public_repos} public repos`);
  if (candidate.followers !== undefined)
    stats.push(`${candidate.followers} followers`);
  if (candidate.created_at)
    stats.push(`on ${isLinkedIn ? "LinkedIn" : "GitHub"} since ${new Date(candidate.created_at).getFullYear()}`);
  if (stats.length) parts.push(`(${stats.join("; ")})`);
  if (candidate.note) parts.push(`Note: ${candidate.note}`);
  return parts.join(" | ");
}

/**
 * Build a HuntFlow-compatible CSV string.
 * HuntFlow (ХАНТ) applicant import uses semicolon-delimited CSV with Russian
 * column headers. This template covers the standard applicant fields plus
 * extra context columns. Opens correctly in Excel (RU locale) and imports
 * into HuntFlow's «Заявки/Кандидаты» bulk import.
 */
export function buildHuntFlowCsv(candidates: Candidate[]): string {
  const headers = [
    "Имя",
    "Фамилия",
    "Должность",
    "Компания",
    "Телефон",
    "Email",
    "Город",
    "Источник",
    "Ссылка на профиль",
    "Сайт",
    "Twitter",
    "Подписчики",
    "Репозитории",
    "Дата регистрации",
    "Теги",
    "Комментарий",
  ];

  const rows = candidates.map((c) => {
    const { firstName, lastName } = splitName(c);
    const isLinkedIn = c.tags?.includes("linkedin");
    const tags = (c.tags || []).join(", ");
    const created = c.created_at
      ? new Date(c.created_at).toLocaleDateString("ru-RU")
      : "";
    return [
      firstName,
      lastName,
      inferPosition(c),
      c.company || "",
      "", // phone — GitHub has no phone
      c.email || "",
      c.location || "",
      isLinkedIn ? "LinkedIn" : "GitHub",
      c.html_url,
      c.blog ? (c.blog.startsWith("http") ? c.blog : `https://${c.blog}`) : "",
      c.twitter_username ? `https://twitter.com/${c.twitter_username}` : "",
      c.followers !== undefined ? String(c.followers) : "",
      c.public_repos !== undefined ? String(c.public_repos) : "",
      created,
      tags,
      buildComment(c),
    ].map(escapeCsvCell).join(";");
  });

  // UTF-8 BOM so Excel reads Cyrillic correctly.
  return "\uFEFF" + [headers.join(";"), ...rows].join("\r\n");
}

export function buildJson(candidates: Candidate[]): string {
  return JSON.stringify(
    {
      meta: {
        generator: "GitFind",
        exportedAt: new Date().toISOString(),
        count: candidates.length,
        format: "github-talent-selection",
        version: "1.0",
      },
      candidates: candidates.map((c) => ({
        login: c.login,
        name: c.name,
        position: inferPosition(c),
        avatar: c.avatar_url,
        githubUrl: c.html_url,
        type: c.type,
        company: c.company,
        blog: c.blog,
        location: c.location,
        email: c.email,
        twitter: c.twitter_username,
        publicRepos: c.public_repos,
        followers: c.followers,
        following: c.following,
        githubSince: c.created_at,
        lastActive: c.updated_at,
        bio: c.bio,
        status: c.status,
        note: c.note,
        tags: c.tags,
        addedAt: c.addedAt,
      })),
    },
    null,
    2
  );
}

export function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function timestampName(prefix: string, ext: string): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const stamp = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(
    d.getHours()
  )}${pad(d.getMinutes())}`;
  return `${prefix}_${stamp}.${ext}`;
}
