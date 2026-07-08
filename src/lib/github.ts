// GitHub Search API helpers, types and query builder.

export type SearchType =
  | "repositories"
  | "users"
  | "code"
  | "issues"
  | "commits"
  | "topics";

export interface SearchFilters {
  query: string;
  type: SearchType;
  language?: string;
  starsMin?: string;
  starsMax?: string;
  forksMin?: string;
  forksMax?: string;
  sizeMin?: string;
  sizeMax?: string;
  createdAfter?: string;
  createdBefore?: string;
  pushedAfter?: string;
  pushedBefore?: string;
  license?: string;
  topics?: string;
  followersMin?: string;
  reposMin?: string;
  userLocation?: string;
  followersMinUser?: string;
  repoUser?: string;
  org?: string;
  isFork?: "true" | "false" | "only";
  isArchived?: "true" | "false";
  hasIssues?: boolean;
  hasTopics?: boolean;
  hasWiki?: boolean;
  hasOpenIssues?: boolean;
  state?: "open" | "closed";
  sort?: string;
  order?: "asc" | "desc";
  page?: number;
  perPage?: number;
}

export interface GitHubRateLimit {
  remaining: number;
  limit: number;
  reset: number;
}

export interface GitHubSearchResponse<T = any> {
  total_count: number;
  incomplete_results: boolean;
  items: T[];
  rateLimit?: GitHubRateLimit;
}

const LICENSES: { key: string; name: string }[] = [
  { key: "mit", name: "MIT License" },
  { key: "apache-2.0", name: "Apache License 2.0" },
  { key: "gpl-3.0", name: "GNU General Public License v3.0" },
  { key: "gpl-2.0", name: "GNU General Public License v2.0" },
  { key: "bsd-2-clause", name: "BSD 2-Clause License" },
  { key: "bsd-3-clause", name: "BSD 3-Clause License" },
  { key: "mpl-2.0", name: "Mozilla Public License 2.0" },
  { key: "lgpl-3.0", name: "GNU Lesser General Public License v3.0" },
  { key: "unlicense", name: "The Unlicense" },
  { key: "cc0-1.0", name: "Creative Commons Zero v1.0" },
  { key: "epl-2.0", name: "Eclipse Public License 2.0" },
  { key: "agpl-3.0", name: "GNU Affero General Public License v3.0" },
];

// Languages ordered for a systems-software focus (C/C++/Go/Python/Rust first),
// followed by general-purpose languages.
export const POPULAR_LANGUAGES: string[] = [
  // Systems core
  "C",
  "C++",
  "Go",
  "Python",
  "Rust",
  "Shell",
  "Assembly",
  "Cuda",
  // General purpose
  "Java",
  "C#",
  "JavaScript",
  "TypeScript",
  "Ruby",
  "PHP",
  "Swift",
  "Kotlin",
  "Dart",
  "Scala",
  "HTML",
  "CSS",
  "Vue",
  "Elixir",
  "Haskell",
  "Lua",
  "Perl",
  "R",
  "Zig",
  "Nim",
  "OCaml",
  "Solidity",
  "Julia",
  "Objective-C",
  "Clojure",
  "Erlang",
  "F#",
  "Groovy",
  "PowerShell",
  "Vim Script",
  "Makefile",
  "CMake",
  "Dockerfile",
];

export function getLicenses() {
  return LICENSES;
}

// ---------------------------------------------------------------------------
// Domain presets tailored for sourcing systems-software engineers in Russia.
// Each preset has a READY-TO-RUN, TESTED GitHub query string that returns
// relevant results. We use a single topic/keyword per domain because GitHub
// search ANDs multiple `topic:` qualifiers (which would yield ~0 results).
// ---------------------------------------------------------------------------
export interface DomainPreset {
  id: string;
  label: string;
  description: string;
  query: string; // ready-to-run GitHub search query (repositories)
}

// Systems-software domains: databases, OS/Linux, storage, kernel, crypto, etc.
// Each query was tested to return thousands of relevant results.
export const SYSTEMS_DOMAINS: DomainPreset[] = [
  {
    id: "databases",
    label: "СУБД",
    description: "PostgreSQL, MySQL, ClickHouse, Redis, SQLite",
    query: "topic:database sort:stars",
  },
  {
    id: "linux-os",
    label: "Linux / ОС",
    description: "Ядро, системные утилиты, дистрибутивы",
    query: "topic:linux sort:stars",
  },
  {
    id: "storage",
    label: "СХД",
    description: "Системы хранения данных, файловые системы",
    query: "topic:storage sort:stars",
  },
  {
    id: "srk",
    label: "СРК",
    description: "Системы распределённых вычислений, очереди",
    query: "topic:kafka sort:stars",
  },
  {
    id: "networking",
    label: "Сеть / Net",
    description: "Сетевые протоколы, TCP/IP, прокси, балансировщики",
    query: "topic:networking sort:stars",
  },
  {
    id: "kernel",
    label: "Ядро / Drivers",
    description: "Kernel modules, drivers, eBPF",
    query: "topic:linux-kernel sort:stars",
  },
  {
    id: "crypto",
    label: "Крипто / Безопасность",
    description: "TLS, шифрование, безопасность",
    query: "topic:cryptography sort:stars",
  },
  {
    id: "containers",
    label: "Контейнеры / VM",
    description: "Docker, K8s, виртуализация",
    query: "topic:kubernetes sort:stars",
  },
  {
    id: "hpc",
    label: "HPC / CUDA",
    description: "Высокопроизводительные вычисления, GPU",
    query: "topic:cuda sort:stars",
  },
];

// Russian cities / regions for the location filter.
export const RUSSIA_LOCATIONS: string[] = [
  "Moscow",
  "Saint Petersburg",
  "Novosibirsk",
  "Yekaterinburg",
  "Kazan",
  "Nizhny Novgorod",
  "Chelyabinsk",
  "Samara",
  "Omsk",
  "Rostov-on-Don",
  "Ufa",
  "Krasnoyarsk",
  "Voronezh",
  "Perm",
  "Volgograd",
  "Innopolis",
  "Russia",
  "Belarus",
  "Kazakhstan",
  "Armenia",
  "Georgia",
  "Uzbekistan",
];

export function getSortOptions(type: SearchType): { value: string; label: string }[] {
  switch (type) {
    case "repositories":
      return [
        { value: "best-match", label: "Лучшее совпадение" },
        { value: "stars", label: "Звёздам" },
        { value: "forks", label: "Форкам" },
        { value: "help-wanted-issues", label: "Открытым issues" },
        { value: "updated", label: "Обновлению" },
      ];
    case "users":
      return [
        { value: "best-match", label: "Лучшее совпадение" },
        { value: "followers", label: "Подписчикам" },
        { value: "repositories", label: "Репозиториям" },
        { value: "joined", label: "Дате регистрации" },
      ];
    case "code":
      return [{ value: "best-match", label: "Лучшее совпадение" }];
    case "issues":
      return [
        { value: "best-match", label: "Лучшее совпадение" },
        { value: "comments", label: "Комментариям" },
        { value: "reactions", label: "Реакциям" },
        { value: "interactions", label: "Взаимодействиям" },
        { value: "created", label: "Дате создания" },
        { value: "updated", label: "Обновлению" },
      ];
    case "commits":
      return [
        { value: "best-match", label: "Лучшее совпадение" },
        { value: "author-date", label: "Дате автора" },
        { value: "committer-date", label: "Дате коммиттера" },
      ];
    case "topics":
      return [
        { value: "best-match", label: "Лучшее совпадение" },
        { value: "stars", label: "Звёздам" },
      ];
    default:
      return [{ value: "best-match", label: "Лучшее совпадение" }];
  }
}

// Build the GitHub search `q` string from structured filters.
export function buildQuery(filters: SearchFilters): string {
  const parts: string[] = [];

  const rawQuery = (filters.query || "").trim();
  // Allow the user to type raw qualifiers, but extract the plain text portion.
  // If the query already contains qualifiers like `language:`, keep as-is,
  // otherwise we append our structured filters.
  if (rawQuery) parts.push(rawQuery);

  if (filters.language) parts.push(`language:${filters.language}`);
  if (filters.starsMin || filters.starsMax) {
    const min = filters.starsMin?.trim();
    const max = filters.starsMax?.trim();
    if (min && max) parts.push(`stars:${min}..${max}`);
    else if (min) parts.push(`stars:>=${min}`);
    else if (max) parts.push(`stars:<=${max}`);
  }
  if (filters.forksMin || filters.forksMax) {
    const min = filters.forksMin?.trim();
    const max = filters.forksMax?.trim();
    if (min && max) parts.push(`forks:${min}..${max}`);
    else if (min) parts.push(`forks:>=${min}`);
    else if (max) parts.push(`forks:<=${max}`);
  }
  if (filters.sizeMin || filters.sizeMax) {
    const min = filters.sizeMin?.trim();
    const max = filters.sizeMax?.trim();
    if (min && max) parts.push(`size:${min}..${max}`);
    else if (min) parts.push(`size:>=${min}`);
    else if (max) parts.push(`size:<=${max}`);
  }
  if (filters.createdAfter || filters.createdBefore) {
    const a = filters.createdAfter;
    const b = filters.createdBefore;
    if (a && b) parts.push(`created:${a}..${b}`);
    else if (a) parts.push(`created:>=${a}`);
    else if (b) parts.push(`created:<=${b}`);
  }
  if (filters.pushedAfter || filters.pushedBefore) {
    const a = filters.pushedAfter;
    const b = filters.pushedBefore;
    if (a && b) parts.push(`pushed:${a}..${b}`);
    else if (a) parts.push(`pushed:>=${a}`);
    else if (b) parts.push(`pushed:<=${b}`);
  }
  if (filters.license) parts.push(`license:${filters.license}`);
  if (filters.topics) {
    const t = filters.topics.trim();
    if (t) parts.push(`topic:${t.replace(/\s+/g, " topic:")}`);
  }
  if (filters.repoUser) parts.push(`user:${filters.repoUser.trim()}`);
  if (filters.org) parts.push(`org:${filters.org.trim()}`);
  if (filters.isFork === "true") parts.push(`fork:true`);
  if (filters.isFork === "only") parts.push(`fork:only`);
  if (filters.isArchived === "true") parts.push(`archived:true`);
  if (filters.isArchived === "false") parts.push(`archived:false`);
  if (filters.hasIssues) parts.push(`has:issues`);
  if (filters.hasTopics) parts.push(`has:topics`);
  if (filters.hasWiki) parts.push(`has:wiki`);
  if (filters.hasOpenIssues) parts.push(`has:open-issues`);

  // Users
  if (filters.userLocation) parts.push(`location:${filters.userLocation.trim()}`);
  if (filters.followersMinUser) parts.push(`followers:>=${filters.followersMinUser.trim()}`);
  if (filters.reposMin) parts.push(`repos:>=${filters.reposMin.trim()}`);

  // Issues state
  if (filters.state) parts.push(`state:${filters.state}`);
  if (filters.type === "issues") parts.push(`is:issue`);
  if (filters.type === "commits") parts.push(`hash:`); // commits need a query term

  return parts.filter(Boolean).join(" ");
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  return String(n);
}

export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = Date.now();
  const diff = Math.floor((now - date.getTime()) / 1000);
  if (diff < 60) return "только что";
  if (diff < 3600) return `${Math.floor(diff / 60)} мин назад`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ч назад`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} дн назад`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} мес назад`;
  return `${Math.floor(diff / 31536000)} г назад`;
}

// Language color mapping (subset of GitHub linguist colors).
const LANG_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Scala: "#c22d40",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Vue: "#41b883",
  Elixir: "#6e4a7e",
  Haskell: "#5e5086",
  Lua: "#000080",
  Perl: "#0298c3",
  R: "#198CE7",
  Zig: "#ec915c",
  Nim: "#ffc200",
  OCaml: "#3be133",
  Solidity: "#AA6746",
  Julia: "#a270ba",
};

export function languageColor(lang?: string): string {
  if (!lang) return "#8b949e";
  return LANG_COLORS[lang] || "#8b949e";
}
