// ---------------------------------------------------------------------------
// Configurations for the URL-based search systems: Google CSE, Linux.org.ru,
// Habr / Habr.Career, StackOverflow. Each config declares filter fields,
// recruiter presets and a URL builder. The shared <UrlSearchApp> renders the
// UI from the config so every system looks and behaves consistently.
// ---------------------------------------------------------------------------

export type FieldType = "text" | "select" | "tags" | "boolean";

export interface FieldOption {
  value: string;
  label: string;
}

export interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: FieldOption[];
  help?: string;
}

export interface Preset {
  id: string;
  label: string;
  hint: string;
  values: Record<string, any>;
}

export interface UrlSystemConfig {
  id: UrlSystemId;
  name: string;
  tagline: string;
  description: string;
  accent: string; // tailwind gradient classes
  iconKey: "google" | "terminal" | "habr" | "so" | "linkedin" | "github";
  sourceTag: string; // tag stored on manually-added candidates
  fields: FieldConfig[];
  presets: Preset[];
  buildUrl: (values: Record<string, any>) => string;
  summarize: (values: Record<string, any>) => string;
}

export type UrlSystemId = "cse" | "lor" | "habr" | "stackoverflow";

// --------------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------------
function countActive(values: Record<string, any>, fields: FieldConfig[]): number {
  let n = 0;
  for (const f of fields) {
    const v = values[f.key];
    if (f.type === "boolean") {
      if (v === true) n++;
    } else if (v !== undefined && v !== "" && v !== "__any") {
      n++;
    }
  }
  return n;
}

function summarizeValues(
  values: Record<string, any>,
  fields: FieldConfig[]
): string {
  const parts: string[] = [];
  for (const f of fields) {
    const v = values[f.key];
    if (f.type === "boolean") {
      if (v === true) parts.push(f.label.toLowerCase());
    } else if (v && v !== "__any") {
      const label = f.label.toLowerCase();
      parts.push(`${label}: ${v}`);
    }
  }
  return parts.length ? parts.join(" · ") : "без фильтров";
}

// --------------------------------------------------------------------------
// 1. CSE — Google search generator (with operators: site:, intitle:, etc.)
// --------------------------------------------------------------------------
const CSE_PRESETS: Preset[] = [
  {
    id: "cse-li-cpp-msk",
    label: "Senior C++ в LinkedIn",
    hint: "site:linkedin.com/in",
    values: {
      query: '"Senior C++ Developer"',
      site: "linkedin.com/in",
      location: "Moscow",
    },
  },
  {
    id: "cse-gh-go",
    label: "Go-разработчики на GitHub",
    hint: "site:github.com",
    values: {
      query: '"Go Developer"',
      site: "github.com",
      location: "Russia",
    },
  },
  {
    id: "cse-resume-cpp",
    label: "Резюме C++ Россия",
    hint: '(resume OR cv) -jobs',
    values: {
      query: '"C++ Developer" (resume OR cv)',
      exclude: "jobs -вакансии",
      location: "Russia",
    },
  },
  {
    id: "cse-habr-go",
    label: "Статьи Хабра про Go+Kafka",
    hint: "site:habr.com",
    values: {
      query: "Go Kafka",
      site: "habr.com",
    },
  },
  {
    id: "cse-so-c-linux",
    label: "Профили SO: C + Linux",
    hint: "site:stackoverflow.com/users",
    values: {
      query: '"C" "Linux"',
      site: "stackoverflow.com/users",
      location: "Russia",
    },
  },
  {
    id: "cse-pdf-cv",
    label: "PDF-резюме backend",
    hint: "filetype:pdf",
    values: {
      query: '"Backend Developer" resume',
      fileType: "pdf",
      location: "Russia",
    },
  },
];

function buildCseUrl(v: Record<string, any>): string {
  const tokens: string[] = [];
  if (v.query?.trim()) tokens.push(v.query.trim());
  if (v.site?.trim()) tokens.push(`site:${v.site.trim()}`);
  if (v.exactPhrase?.trim()) tokens.push(`"${v.exactPhrase.trim()}"`);
  if (v.exclude?.trim()) {
    v.exclude
      .split(/\s+/)
      .filter(Boolean)
      .forEach((t: string) => tokens.push(`-${t}`));
  }
  if (v.fileType && v.fileType !== "__any" && v.fileType.trim()) {
    tokens.push(`filetype:${v.fileType.trim()}`);
  }
  if (v.location?.trim()) tokens.push(`"${v.location.trim()}"`);
  if (v.extra?.trim()) tokens.push(v.extra.trim());
  const q = tokens.join(" ");
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  return `https://www.google.com/search?${params.toString()}`;
}

// --------------------------------------------------------------------------
// 2. Linux.org.ru — forum search
// --------------------------------------------------------------------------
const LOR_PRESETS: Preset[] = [
  {
    id: "lor-cpp",
    label: "C++ разработчики",
    hint: "обсуждения, вакансии",
    values: { query: "C++ разработчик" },
  },
  {
    id: "lor-go",
    label: "Go / golang",
    hint: "бэкенд, микросервисы",
    values: { query: "golang разработчик" },
  },
  {
    id: "lor-kernel",
    label: "Ядро / драйверы",
    hint: "kernel, driver",
    values: { query: "kernel driver" },
  },
  {
    id: "lor-dba",
    label: "PostgreSQL DBA",
    hint: "базы данных",
    values: { query: "PostgreSQL DBA" },
  },
  {
    id: "lor-devops",
    label: "DevOps",
    hint: "инфраструктура",
    values: { query: "devops" },
  },
  {
    id: "lor-rust",
    label: "Rust",
    hint: "системное ПО",
    values: { query: "rust разработчик" },
  },
];

function buildLorUrl(v: Record<string, any>): string {
  const q = (v.query || "").trim();
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  // LOR search defaults to "all" (topics + comments); no extra params needed.
  return `https://www.linux.org.ru/search?${params.toString()}`;
}

// --------------------------------------------------------------------------
// 3. Habr / Habr.Career — articles + resume search
// --------------------------------------------------------------------------
const HABR_PRESETS: Preset[] = [
  {
    id: "habr-career-cpp",
    label: "Резюме C++ · Карьера",
    hint: "career.habr.com/resume",
    values: { query: "C++", target: "career" },
  },
  {
    id: "habr-career-go",
    label: "Резюме Go · Карьера",
    hint: "backend, микросервисы",
    values: { query: "Go", target: "career" },
  },
  {
    id: "habr-career-rust",
    label: "Резюме Rust · Карьера",
    hint: "системное ПО",
    values: { query: "Rust", target: "career" },
  },
  {
    id: "habr-career-dba",
    label: "Резюме DBA · Карьера",
    hint: "PostgreSQL, ClickHouse",
    values: { query: "PostgreSQL", target: "career" },
  },
  {
    id: "habr-articles-kernel",
    label: "Статьи: ядро Linux",
    hint: "habr.com поиск",
    values: { query: "Linux kernel", target: "articles" },
  },
  {
    id: "habr-articles-storage",
    label: "Статьи: СХД, хранение",
    hint: "storage, filesystem",
    values: { query: "storage filesystem", target: "articles" },
  },
];

function buildHabrUrl(v: Record<string, any>): string {
  const q = (v.query || "").trim();
  const target = v.target || "career";
  const enc = encodeURIComponent(q);
  if (target === "articles") {
    // Habr articles search
    return `https://habr.com/ru/search/?q=${enc}&target_type=posts&order=relevance`;
  }
  // Habr Career resume search (most useful for sourcing)
  return `https://career.habr.com/resume?q=${enc}`;
}

// --------------------------------------------------------------------------
// 4. StackOverflow — user search by tags + location
// --------------------------------------------------------------------------
const SO_PRESETS: Preset[] = [
  {
    id: "so-c-linux",
    label: "C + Linux",
    hint: "топ по репутации",
    values: { tags: "c,linux", location: "Russia" },
  },
  {
    id: "so-cpp-db",
    label: "C++ + database",
    hint: "СУБД, движки",
    values: { tags: "c++,database", location: "Russia" },
  },
  {
    id: "so-go-kafka",
    label: "Go + kafka",
    hint: "СРК, брокеры",
    values: { tags: "go,kafka", location: "Russia" },
  },
  {
    id: "so-python-pg",
    label: "Python + postgresql",
    hint: "backend",
    values: { tags: "python,postgresql", location: "Moscow" },
  },
  {
    id: "so-rust",
    label: "Rust",
    hint: "системное ПО",
    values: { tags: "rust", location: "Russia" },
  },
  {
    id: "so-devops-k8s",
    label: "DevOps + kubernetes",
    hint: "инфраструктура",
    values: { tags: "kubernetes,docker", location: "Moscow" },
  },
];

function buildSoUrl(v: Record<string, any>): string {
  const tags = (v.tags || "")
    .split(",")
    .map((t: string) => t.trim())
    .filter(Boolean);
  const loc = (v.location || "").trim();
  // StackOverflow users search combines a free-text `q` param. We merge the
  // location and tags into a single search query.
  const params = new URLSearchParams();
  params.set("tab", "Reputation");
  params.set("filter", "all");
  const tagPart = tags.join(" ");
  const qParts = [loc, tagPart].filter(Boolean);
  if (qParts.length) params.set("q", qParts.join(" "));
  return `https://stackoverflow.com/users?${params.toString()}`;
}

// --------------------------------------------------------------------------
// Field configs per system
// --------------------------------------------------------------------------
const CSE_FIELDS: FieldConfig[] = [
  { key: "query", label: "Запрос", type: "text", placeholder: '"Senior C++ Developer"' },
  { key: "site", label: "Сайт (site:)", type: "text", placeholder: "linkedin.com/in" },
  { key: "exactPhrase", label: "Точная фраза", type: "text", placeholder: "database" },
  { key: "exclude", label: "Исключить (через пробел)", type: "text", placeholder: "jobs вакансии" },
  {
    key: "fileType",
    label: "Тип файла",
    type: "select",
    options: [
      { value: "__any", label: "Любой" },
      { value: "pdf", label: "PDF" },
      { value: "doc", label: "DOC" },
      { value: "docx", label: "DOCX" },
    ],
  },
  { key: "location", label: "Локация", type: "text", placeholder: "Moscow" },
  { key: "extra", label: "Доп. операторы", type: "text", placeholder: "intitle:resume" },
];

const LOR_FIELDS: FieldConfig[] = [
  { key: "query", label: "Запрос", type: "text", placeholder: "C++ разработчик" },
];

const HABR_FIELDS: FieldConfig[] = [
  {
    key: "target",
    label: "Где искать",
    type: "select",
    options: [
      { value: "career", label: "Хабр.Карьера (резюме)" },
      { value: "articles", label: "Хабр (статьи)" },
    ],
  },
  { key: "query", label: "Запрос", type: "text", placeholder: "C++, Go, PostgreSQL…" },
];

const SO_FIELDS: FieldConfig[] = [
  { key: "tags", label: "Теги (через запятую)", type: "tags", placeholder: "c,linux,c++" },
  { key: "location", label: "Локация", type: "text", placeholder: "Russia" },
];

// --------------------------------------------------------------------------
// Final configs map
// --------------------------------------------------------------------------
export const URL_SYSTEMS: Record<UrlSystemId, UrlSystemConfig> = {
  cse: {
    id: "cse",
    name: "CSE — Google",
    tagline: "Генератор Google-поиска",
    description:
      "Строит Google-запрос с операторами site:, filetype:, intitle:, исключениями и точными фразами. Идеально для x-ray сорсинга по LinkedIn, GitHub, Хабру и StackOverflow.",
    accent: "from-rose-500 to-orange-500",
    iconKey: "google",
    sourceTag: "google",
    fields: CSE_FIELDS,
    presets: CSE_PRESETS,
    buildUrl: buildCseUrl,
    summarize: (v) => summarizeValues(v, CSE_FIELDS),
  },
  lor: {
    id: "lor",
    name: "Linux.org.ru",
    tagline: "Поиск по форуму LOR",
    description:
      "Поиск по крупнейшему русскоязычному Linux-сообществу. Найдите разработчиков, обсуждающих ядро, драйверы, СУБД и системное ПО.",
    accent: "from-amber-500 to-yellow-600",
    iconKey: "terminal",
    sourceTag: "lor",
    fields: LOR_FIELDS,
    presets: LOR_PRESETS,
    buildUrl: buildLorUrl,
    summarize: (v) => summarizeValues(v, LOR_FIELDS),
  },
  habr: {
    id: "habr",
    name: "Хабр / Карьера",
    tagline: "Хабр + Хабр.Карьера",
    description:
      "Поиск резюме на Хабр.Карьере и статей на Хабре. Системные разработчики часто публикуют резюме и статьи про C++, Go, Rust, базы данных и инфраструктуру.",
    accent: "from-violet-500 to-fuchsia-600",
    iconKey: "habr",
    sourceTag: "habr",
    fields: HABR_FIELDS,
    presets: HABR_PRESETS,
    buildUrl: buildHabrUrl,
    summarize: (v) => summarizeValues(v, HABR_FIELDS),
  },
  stackoverflow: {
    id: "stackoverflow",
    name: "StackOverflow",
    tagline: "Поиск по StackOverflow",
    description:
      "Поиск пользователей StackOverflow по тегам (C, C++, Go, Rust, postgresql, linux) и локации. Топ по репутации — сильные инженеры с доказанной экспертизой.",
    accent: "from-orange-500 to-amber-600",
    iconKey: "so",
    sourceTag: "stackoverflow",
    fields: SO_FIELDS,
    presets: SO_PRESETS,
    buildUrl: buildSoUrl,
    summarize: (v) => summarizeValues(v, SO_FIELDS),
  },
};

export function countSystemFilters(
  values: Record<string, any>,
  systemId: UrlSystemId
): number {
  return countActive(values, URL_SYSTEMS[systemId].fields);
}

// Locations reused across systems.
export const COMMON_LOCATIONS: string[] = [
  "Moscow",
  "Saint Petersburg",
  "Novosibirsk",
  "Yekaterinburg",
  "Kazan",
  "Russia",
  "Remote",
];
