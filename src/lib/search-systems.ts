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

export interface ResourceLink {
  title: string;
  url: string;
  description?: string;
}

export interface UrlSystemConfig {
  id: UrlSystemId;
  name: string;
  tagline: string;
  description: string;
  accent: string; // tailwind gradient classes
  iconKey:
    | "google"
    | "terminal"
    | "habr"
    | "so"
    | "linkedin"
    | "github"
    | "briefcase"
    | "newspaper"
    | "globe"
    | "message"
    | "book"
    | "telegram";
  sourceTag: string; // tag stored on manually-added candidates
  fields: FieldConfig[];
  presets: Preset[];
  buildUrl: (values: Record<string, any>) => string;
  summarize: (values: Record<string, any>) => string;
  // Optional curated resource links (e.g. a Telegram channel database).
  resources?: { title: string; groups: ResourceLink[] };
}

export type UrlSystemId =
  | "cse"
  | "lor"
  | "habr"
  | "stackoverflow"
  | "hh"
  | "superjob"
  | "opennet"
  | "vc"
  | "habrqa"
  | "ruso"
  | "ubuntu"
  | "telegram"
  | "gitlab"
  | "codeforces"
  | "reddit"
  | "devto"
  | "sourcehut"
  | "hackersnews"
  | "bitbucket"
  | "kaggle"
  | "dockerhub"
  | "gopkg"
  | "crates"
  | "pypi"
  | "codeberg"
  | "leetcode"
  | "medium";

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
    id: "cse-habr-cpp",
    label: "C++ резюме Хабр",
    hint: "site:career.habr.com/resumes",
    values: {
      query: '"C++ разработчик"',
      site: "career.habr.com/resumes",
      location: "Москва",
    },
  },
  {
    id: "cse-habr-go",
    label: "Go резюме Хабр",
    hint: "site:career.habr.com/resumes",
    values: {
      query: '"Go разработчик"',
      site: "career.habr.com/resumes",
      location: "Россия",
    },
  },
  {
    id: "cse-habr-rust",
    label: "Rust резюме Хабр",
    hint: "site:career.habr.com/resumes",
    values: {
      query: '"Rust разработчик"',
      site: "career.habr.com/resumes",
    },
  },
  {
    id: "cse-habr-users",
    label: "Профили Хабр (users)",
    hint: "site:habr.com/users",
    values: {
      query: '"C++"',
      site: "habr.com/users",
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
  const target = v.target && v.target !== "__any" ? v.target : "career";
  const enc = encodeURIComponent(q);
  if (target === "articles") {
    // Habr articles search
    return `https://habr.com/ru/search/?q=${enc}&target_type=posts&order=relevance`;
  }
  // Habr Career resume search (most useful for sourcing)
  return `https://career.habr.com/resumes?q=${enc}`;
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
// 5. hh.ru (HeadHunter) — резюме
// --------------------------------------------------------------------------
const HH_PRESETS: Preset[] = [
  { id: "hh-cpp-msk", label: "C++ разработчик · Москва", hint: "системное ПО", values: { query: "C++ разработчик", area: "Москва" } },
  { id: "hh-go-ru", label: "Go · Россия", hint: "микросервисы, СРК", values: { query: "Go разработчик", area: "Россия" } },
  { id: "hh-dba", label: "DBA PostgreSQL", hint: "базы данных", values: { query: "PostgreSQL DBA", area: "Россия" } },
  { id: "hh-rust", label: "Rust · Россия", hint: "системное ПО", values: { query: "Rust разработчик", area: "Россия" } },
  { id: "hh-devops", label: "DevOps · Москва", hint: "K8s, инфраструктура", values: { query: "DevOps инженер", area: "Москва" } },
  { id: "hh-storage", label: "Storage Engineer", hint: "СХД, Ceph", values: { query: "storage engineer", area: "Россия" } },
];

function buildHhUrl(v: Record<string, any>): string {
  const q = (v.query || "").trim();
  const area = (v.area || "").trim();
  // hh.ru resume search. area code: Москва=1, СПб=2, Россия=113. We map names.
  const areaMap: Record<string, string> = {
    "Москва": "1",
    "Moscow": "1",
    "Санкт-Петербург": "2",
    "Saint Petersburg": "2",
    "Россия": "113",
    "Russia": "113",
    "Новосибирск": "4",
    "Екатеринбург": "3",
  };
  const params = new URLSearchParams();
  params.set("tab", "all");
  if (q) params.set("text", q);
  if (area && areaMap[area]) params.set("area", areaMap[area]);
  return `https://hh.ru/resume?${params.toString()}`;
}

const HH_FIELDS: FieldConfig[] = [
  { key: "query", label: "Запрос", type: "text", placeholder: "C++ разработчик" },
  {
    key: "area",
    label: "Регион",
    type: "select",
    options: [
      { value: "__any", label: "Любой" },
      { value: "Москва", label: "Москва" },
      { value: "Санкт-Петербург", label: "Санкт-Петербург" },
      { value: "Новосибирск", label: "Новосибирск" },
      { value: "Екатеринбург", label: "Екатеринбург" },
      { value: "Россия", label: "Россия" },
    ],
  },
];

// --------------------------------------------------------------------------
// 6. Superjob — резюме
// --------------------------------------------------------------------------
const SJ_PRESETS: Preset[] = [
  { id: "sj-cpp", label: "C++ разработчик", hint: "системное ПО", values: { query: "C++ разработчик", town: "Москва" } },
  { id: "sj-go", label: "Go разработчик", hint: "backend, СРК", values: { query: "Go разработчик", town: "Москва" } },
  { id: "sj-dba", label: "DBA / администратор БД", hint: "PostgreSQL", values: { query: "администратор баз данных", town: "" } },
  { id: "sj-python", label: "Python разработчик", hint: "backend", values: { query: "Python разработчик", town: "Россия" } },
  { id: "sj-devops", label: "DevOps инженер", hint: "инфраструктура", values: { query: "DevOps", town: "Москва" } },
  { id: "sj-linux", label: "Linux администратор", hint: "системы", values: { query: "Linux администратор", town: "" } },
];

function buildSjUrl(v: Record<string, any>): string {
  const q = (v.query || "").trim();
  const town = (v.town || "").trim();
  const params = new URLSearchParams();
  if (q) params.set("keywords", q);
  if (town && town !== "Россия") params.set("town", town === "Москва" ? "4" : town === "Санкт-Петербург" ? "53" : "");
  return `https://www.superjob.ru/resume/?${params.toString()}`;
}

const SJ_FIELDS: FieldConfig[] = [
  { key: "query", label: "Запрос", type: "text", placeholder: "C++ разработчик" },
  {
    key: "town",
    label: "Город",
    type: "select",
    options: [
      { value: "__any", label: "Любой" },
      { value: "Москва", label: "Москва" },
      { value: "Санкт-Петербург", label: "Санкт-Петербург" },
      { value: "Россия", label: "Россия" },
    ],
  },
];

// --------------------------------------------------------------------------
// 7. opennet.ru — новости + поиск по UNIX/Linux порталу
// --------------------------------------------------------------------------
const OPENNET_PRESETS: Preset[] = [
  { id: "on-cpp", label: "C++ на opennet", hint: "новости, обсуждения", values: { query: "C++" } },
  { id: "on-postgres", label: "PostgreSQL", hint: "СУБД", values: { query: "PostgreSQL" } },
  { id: "on-linux", label: "Linux ядро", hint: "kernel", values: { query: "linux kernel" } },
  { id: "on-go", label: "Go / golang", hint: "backend", values: { query: "golang" } },
  { id: "on-ceph", label: "Ceph / СХД", hint: "хранение", values: { query: "ceph" } },
  { id: "on-rust", label: "Rust", hint: "системное ПО", values: { query: "rust" } },
];

function buildOpennetUrl(v: Record<string, any>): string {
  const q = (v.query || "").trim();
  // opennet.ru search uses the stxt query param.
  const params = new URLSearchParams();
  if (q) params.set("sctxt", q);
  params.set("sch", "1");
  return `https://www.opennet.ru/search.cgi?${params.toString()}`;
}

const OPENNET_FIELDS: FieldConfig[] = [
  { key: "query", label: "Запрос", type: "text", placeholder: "C++, PostgreSQL, kernel..." },
];

// --------------------------------------------------------------------------
// 8. VC.ru — IT-медиа, поиск по авторам/статьям
// --------------------------------------------------------------------------
const VC_PRESETS: Preset[] = [
  { id: "vc-cpp", label: "C++ разработчики", hint: "статьи, авторы", values: { query: "C++ разработчик" } },
  { id: "vc-go", label: "Go / golang", hint: "backend", values: { query: "golang" } },
  { id: "vc-database", label: "Базы данных", hint: "PostgreSQL, ClickHouse", values: { query: "базы данных" } },
  { id: "vc-kernel", label: "Linux kernel", hint: "системное ПО", values: { query: "linux kernel" } },
  { id: "vc-devops", label: "DevOps", hint: "инфраструктура", values: { query: "devops" } },
  { id: "vc-rust", label: "Rust", hint: "системное ПО", values: { query: "rust" } },
];

function buildVcUrl(v: Record<string, any>): string {
  const q = (v.query || "").trim();
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  return `https://vc.ru/search?${params.toString()}`;
}

const VC_FIELDS: FieldConfig[] = [
  { key: "query", label: "Запрос", type: "text", placeholder: "C++, Go, PostgreSQL..." },
];

// --------------------------------------------------------------------------
// 9. Habr Q&A — вопросы/ответы (аналог SO на русском)
// --------------------------------------------------------------------------
const HABRQA_PRESETS: Preset[] = [
  { id: "qa-cpp", label: "C++", hint: "вопросы/ответы", values: { query: "C++" } },
  { id: "qa-go", label: "Go / golang", hint: "backend", values: { query: "golang" } },
  { id: "qa-postgres", label: "PostgreSQL", hint: "СУБД", values: { query: "PostgreSQL" } },
  { id: "qa-linux", label: "Linux", hint: "системное", values: { query: "Linux" } },
  { id: "qa-rust", label: "Rust", hint: "системное ПО", values: { query: "Rust" } },
  { id: "qa-kernel", label: "Ядро / drivers", hint: "kernel", values: { query: "kernel driver" } },
];

function buildHabrQaUrl(v: Record<string, any>): string {
  const q = (v.query || "").trim();
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  return `https://qna.habr.com/search?${params.toString()}`;
}

const HABRQA_FIELDS: FieldConfig[] = [
  { key: "query", label: "Запрос", type: "text", placeholder: "C++, Go, PostgreSQL..." },
];

// --------------------------------------------------------------------------
// 10. ruSO — StackOverflow на русском (ru.stackoverflow.com)
// --------------------------------------------------------------------------
const RUSO_PRESETS: Preset[] = [
  { id: "ruso-c", label: "C + linux", hint: "системное", values: { tags: "c,linux" } },
  { id: "ruso-cpp", label: "C++ + базы", hint: "СУБД", values: { tags: "c++,базы-данных" } },
  { id: "ruso-go", label: "Go", hint: "backend", values: { tags: "go" } },
  { id: "ruso-pg", label: "PostgreSQL", hint: "СУБД", values: { tags: "postgresql" } },
  { id: "ruso-rust", label: "Rust", hint: "системное ПО", values: { tags: "rust" } },
  { id: "ruso-bash", label: "Bash / shell", hint: "инфраструктура", values: { tags: "bash,shell" } },
];

function buildRusoUrl(v: Record<string, any>): string {
  const tags = (v.tags || "").split(",").map((t: string) => t.trim()).filter(Boolean);
  const params = new URLSearchParams();
  params.set("tab", "Reputation");
  params.set("filter", "all");
  if (tags.length) params.set("q", tags.join(" "));
  return `https://ru.stackoverflow.com/users?${params.toString()}`;
}

const RUSO_FIELDS: FieldConfig[] = [
  { key: "tags", label: "Теги (через запятую)", type: "tags", placeholder: "c,linux,c++" },
];

// --------------------------------------------------------------------------
// 11. Ubuntu.ru forum — русскоязычное Linux-сообщество
// --------------------------------------------------------------------------
const UBUNTU_PRESETS: Preset[] = [
  { id: "ub-c", label: "C / системное", hint: "разработка", values: { query: "C разработчик" } },
  { id: "ub-cpp", label: "C++", hint: "движки, СУБД", values: { query: "C++" } },
  { id: "ub-driver", label: "Драйверы / kernel", hint: "модули ядра", values: { query: "драйвер kernel" } },
  { id: "ub-devops", label: "DevOps / shell", hint: "инфраструктура", values: { query: "shell devops" } },
  { id: "ub-pg", label: "PostgreSQL", hint: "СУБД", values: { query: "PostgreSQL" } },
  { id: "ub-rust", label: "Rust", hint: "системное ПО", values: { query: "rust" } },
];

function buildUbuntuUrl(v: Record<string, any>): string {
  const q = (v.query || "").trim();
  const params = new URLSearchParams();
  if (q) params.set("keywords", q);
  return `https://forum.ubuntu.ru/index.php?action=search&${params.toString()}`;
}

const UBUNTU_FIELDS: FieldConfig[] = [
  { key: "query", label: "Запрос", type: "text", placeholder: "C++, kernel, PostgreSQL..." },
];

// --------------------------------------------------------------------------
// 12. Telegram — поиск через TG + база профильных каналов
// --------------------------------------------------------------------------
const TELEGRAM_PRESETS: Preset[] = [
  // Search hypotheses — how to find developers via Telegram
  {
    id: "tg-google-cpp",
    label: "Google: C++ в Telegram",
    hint: "site:t.me C++ разработчик",
    values: { query: "C++ разработчик", mode: "google" },
  },
  {
    id: "tg-google-go",
    label: "Google: Go/golang в TG",
    hint: "site:t.me golang",
    values: { query: "golang разработчик", mode: "google" },
  },
  {
    id: "tg-google-rust",
    label: "Google: Rust в TG",
    hint: "site:t.me rust",
    values: { query: "rust разработчик", mode: "google" },
  },
  {
    id: "tg-google-dba",
    label: "Google: PostgreSQL DBA",
    hint: "site:t.me postgresql",
    values: { query: "PostgreSQL DBA", mode: "google" },
  },
  {
    id: "tg-google-devops",
    label: "Google: DevOps в TG",
    hint: "site:t.me devops kubernetes",
    values: { query: "devops kubernetes", mode: "google" },
  },
  {
    id: "tg-search-cpp",
    label: "TG Search: C++ вакансии",
    hint: "tgdev.io поиск",
    values: { query: "C++ вакансия", mode: "tgsearch" },
  },
  {
    id: "tg-search-go",
    label: "TG Search: Go backend",
    hint: "tgdev.io поиск",
    values: { query: "Go backend", mode: "tgsearch" },
  },
  {
    id: "tg-search-rust",
    label: "TG Search: Rust системы",
    hint: "tgdev.io поиск",
    values: { query: "Rust системы", mode: "tgsearch" },
  },
];

function buildTelegramUrl(v: Record<string, any>): string {
  const q = (v.query || "").trim();
  const mode = v.mode || "google";
  if (!q) {
    // Default: open a Telegram channel directory.
    return "https://t.me/s/tgdev";
  }
  if (mode === "tgsearch") {
    // tgdev.io / telegramchannels.me — public Telegram search aggregators.
    return `https://tgdev.io/search?q=${encodeURIComponent(q)}`;
  }
  // Default: Google x-ray search inside Telegram (site:t.me).
  const params = new URLSearchParams();
  params.set("q", `site:t.me ${q}`);
  return `https://www.google.com/search?${params.toString()}`;
}

const TELEGRAM_FIELDS: FieldConfig[] = [
  { key: "query", label: "Запрос", type: "text", placeholder: "C++ разработчик, golang, Rust..." },
  {
    key: "mode",
    label: "Режим поиска",
    type: "select",
    options: [
      { value: "google", label: "Google x-ray (site:t.me)" },
      { value: "tgsearch", label: "TG-агрегатор (tgdev.io)" },
    ],
  },
];

// Curated database of profile Telegram channels for systems engineers.
const TELEGRAM_RESOURCES = {
  title: "База профильных TG-каналов",
  groups: [
    { title: "Вакансии и рекрутинг", url: "https://t.me/dev_jobs", description: "Вакансии для разработчиков" },
    { title: "Python вакансии", url: "https://t.me/python_jobs", description: "Python-вакансии и резюме" },
    { title: "Go вакансии", url: "https://t.me/golang_job", description: "Go/golang вакансии" },
    { title: "C++ сообщество", url: "https://t.me/plusplus", description: "C++ обсуждения и вакансии" },
    { title: "Rust на русском", url: "https://t.me/rustlang_ru", description: "Rust-сообщество РФ" },
    { title: "DevOps чат", url: "https://t.me/devops_chat", description: "DevOps/SRE/K8s" },
    { title: "Linux/org", url: "https://t.me/lorchannel", description: "LOR-зеркало" },
    { title: "Highload", url: "https://t.me/highload", description: "Высокие нагрузки, БД" },
    { title: "PostgreSQL-ru", url: "https://t.me/postgres_ru", description: "PostgreSQL на русском" },
    { title: "ClickHouse", url: "https://t.me/clickhouse_ru", description: "ClickHouse-сообщество" },
    { title: "Kubernetes RU", url: "https://t.me/kubernetes_ru", description: "K8s на русском" },
    { title: "Мой круг", url: "https://t.me/moj_krug", description: "Вакансии от Хабр Карьеры" },
    { title: "IT вакансии", url: "https://t.me/it_vacansy", description: "Общие IT-вакансии" },
    { title: "Backend чат", url: "https://t.me/backend_chat", description: "Backend-разработка" },
    { title: "Systems engineering", url: "https://t.me/system_design", description: "Системный дизайн" },
  ] as ResourceLink[],
};

// --------------------------------------------------------------------------
// 13. GitLab — code hosting, project & user search
// --------------------------------------------------------------------------
const GITLAB_PRESETS: Preset[] = [
  { id: "gl-cpp", label: "C/C++ системы", hint: "kernel, embedded", values: { query: "linux kernel C", target: "projects" } },
  { id: "gl-go", label: "Go backend", hint: "highload", values: { query: "go backend highload", target: "projects" } },
  { id: "gl-rust", label: "Rust системы", hint: "systems", values: { query: "rust systems programming", target: "projects" } },
  { id: "gl-users", label: "Профили разработчиков", hint: "по людям", values: { query: "C++ developer", target: "users" } },
];

function buildGitlabUrl(v: Record<string, any>): string {
  const q = encodeURIComponent((v.query || "").trim());
  const target = v.target && v.target !== "__any" ? v.target : "projects";
  if (target === "users") {
    return `https://gitlab.com/search?search=${q}&nav_source=users`;
  }
  return `https://gitlab.com/search?search=${q}&nav_source=projects`;
}

const GITLAB_FIELDS: FieldConfig[] = [
  { key: "query", label: "Запрос", type: "text", placeholder: "C++, Go, Rust, Linux..." },
  {
    key: "target",
    label: "Тип поиска",
    type: "select",
    options: [
      { value: "projects", label: "Проекты" },
      { value: "users", label: "Пользователи" },
    ],
  },
];

// --------------------------------------------------------------------------
// 14. Codeforces — competitive programming profiles
// --------------------------------------------------------------------------
const CF_PRESETS: Preset[] = [
  { id: "cf-ru-top", label: "Топ России", hint: "рейтинг", values: { target: "ratings", country: "RU" } },
  { id: "cf-cpp", label: "C++ программисты", hint: "Google x-ray", values: { query: "C++ Russia", target: "google" } },
  { id: "cf-go", label: "Go программисты", hint: "Google x-ray", values: { query: "Go developer Russia", target: "google" } },
  { id: "cf-algo", label: "Алгоритмисты", hint: "рейтинг", values: { target: "ratings", country: "" } },
];

function buildCfUrl(v: Record<string, any>): string {
  const target = v.target && v.target !== "__any" ? v.target : "ratings";
  if (target === "google") {
    const q = encodeURIComponent((v.query || "").trim());
    return `https://www.google.com/search?q=site:codeforces.com/profile+${q}`;
  }
  const country = v.country && v.country !== "__any" ? v.country : "";
  if (country) {
    return `https://codeforces.com/ratings/country/${country}`;
  }
  return `https://codeforces.com/ratings`;
}

const CF_FIELDS: FieldConfig[] = [
  { key: "query", label: "Запрос", type: "text", placeholder: "C++ программист..." },
  {
    key: "target",
    label: "Режим",
    type: "select",
    options: [
      { value: "ratings", label: "Рейтинг по стране" },
      { value: "google", label: "Google x-ray (site:codeforces.com)" },
    ],
  },
  {
    key: "country",
    label: "Страна",
    type: "select",
    options: [
      { value: "RU", label: "Россия" },
      { value: "BY", label: "Беларусь" },
      { value: "KZ", label: "Казахстан" },
      { value: "UA", label: "Украина" },
      { value: "", label: "Все страны" },
    ],
  },
];

// --------------------------------------------------------------------------
// 15. Reddit — developer communities
// --------------------------------------------------------------------------
const REDDIT_PRESETS: Preset[] = [
  { id: "rd-cpp", label: "C/C++ сообщество", hint: "r/cpp", values: { query: "systems programming", subreddit: "cpp" } },
  { id: "rd-go", label: "Go разработчики", hint: "r/golang", values: { query: "backend systems", subreddit: "golang" } },
  { id: "rd-rust", label: "Rust разработчики", hint: "r/rust", values: { query: "systems", subreddit: "rust" } },
  { id: "rd-linux", label: "Linux dev", hint: "r/linuxdev", values: { query: "kernel driver", subreddit: "linuxdev" } },
  { id: "rd-python", label: "Python systems", hint: "r/Python", values: { query: "systems infrastructure", subreddit: "Python" } },
];

function buildRedditUrl(v: Record<string, any>): string {
  const q = encodeURIComponent((v.query || "").trim());
  const sub = v.subreddit && v.subreddit !== "__any" ? v.subreddit : "";
  if (sub) {
    return `https://www.reddit.com/r/${sub}/search/?q=${q}&sort=relevance&restrict_sr=1`;
  }
  return `https://www.reddit.com/search/?q=${q}&sort=relevance`;
}

const REDDIT_FIELDS: FieldConfig[] = [
  { key: "query", label: "Запрос", type: "text", placeholder: "systems programming, kernel..." },
  {
    key: "subreddit",
    label: "Subreddit",
    type: "select",
    options: [
      { value: "cpp", label: "r/cpp" },
      { value: "golang", label: "r/golang" },
      { value: "rust", label: "r/rust" },
      { value: "linuxdev", label: "r/linuxdev" },
      { value: "Python", label: "r/Python" },
      { value: "C_Programming", label: "r/C_Programming" },
      { value: "experienceddevs", label: "r/experienceddevs" },
      { value: "", label: "Весь Reddit" },
    ],
  },
];

// --------------------------------------------------------------------------
// 16. Dev.to — developer articles & profiles
// --------------------------------------------------------------------------
const DEVTO_PRESETS: Preset[] = [
  { id: "dt-cpp", label: "C++ статьи", hint: "системное ПО", values: { query: "C++ systems programming" } },
  { id: "dt-go", label: "Go статьи", hint: "backend", values: { query: "Go backend highload" } },
  { id: "dt-rust", label: "Rust статьи", hint: "системное", values: { query: "Rust systems" } },
  { id: "dt-linux", label: "Linux/ядро", hint: "kernel", values: { query: "Linux kernel development" } },
  { id: "dt-db", label: "Базы данных", hint: "PostgreSQL, СУБД", values: { query: "database PostgreSQL internals" } },
];

function buildDevtoUrl(v: Record<string, any>): string {
  const q = encodeURIComponent((v.query || "").trim());
  return `https://dev.to/search?q=${q}`;
}

const DEVTO_FIELDS: FieldConfig[] = [
  { key: "query", label: "Запрос", type: "text", placeholder: "C++, Go, Rust, Linux..." },
];

// --------------------------------------------------------------------------
// 17. Sourcehut — minimalist code hosting
// --------------------------------------------------------------------------
const SH_PRESETS: Preset[] = [
  { id: "sh-c", label: "C проекты", hint: "системное", values: { query: "C linux" } },
  { id: "sh-go", label: "Go проекты", hint: "CLI, сервисы", values: { query: "Go cli" } },
  { id: "sh-rust", label: "Rust проекты", hint: "системное", values: { query: "Rust systems" } },
  { id: "sh-linux", label: "Linux/ядро", hint: "kernel", values: { query: "linux kernel" } },
];

function buildSourcehutUrl(v: Record<string, any>): string {
  const q = encodeURIComponent((v.query || "").trim());
  return `https://sr.ht/projects?search=${q}`;
}

const SH_FIELDS: FieldConfig[] = [
  { key: "query", label: "Запрос", type: "text", placeholder: "C, Go, Rust, Linux..." },
];

// --------------------------------------------------------------------------
// 18. HackerNews — developer discussions, who-is-hiring
// --------------------------------------------------------------------------
const HN_PRESETS: Preset[] = [
  { id: "hn-cpp", label: "C++ разработчик", hint: "обсуждения", values: { query: "C++ developer" } },
  { id: "hn-go", label: "Go backend", hint: "highload", values: { query: "Go backend highload" } },
  { id: "hn-rust", label: "Rust systems", hint: "системное", values: { query: "Rust systems programming" } },
  { id: "hn-linux", label: "Linux kernel", hint: "ядро", values: { query: "Linux kernel development" } },
  { id: "hn-hiring", label: "Кто нанимает", hint: "who is hiring", values: { query: "Ask HN: Who is hiring" } },
];

function buildHnUrl(v: Record<string, any>): string {
  const q = encodeURIComponent((v.query || "").trim());
  return `https://hn.algolia.com/?q=${q}`;
}

const HN_FIELDS: FieldConfig[] = [
  { key: "query", label: "Запрос", type: "text", placeholder: "C++, Go, Rust, Linux..." },
];

// --------------------------------------------------------------------------
// 19. Bitbucket — Atlassian code hosting
// --------------------------------------------------------------------------
const BB_PRESETS: Preset[] = [
  { id: "bb-cpp", label: "C++ системы", hint: "embedded, kernel", values: { query: "C++ embedded" } },
  { id: "bb-go", label: "Go backend", hint: "microservices", values: { query: "Go backend" } },
  { id: "bb-rust", label: "Rust", hint: "системное", values: { query: "Rust systems" } },
  { id: "bb-python", label: "Python infra", hint: "infrastructure", values: { query: "Python infrastructure" } },
];

function buildBitbucketUrl(v: Record<string, any>): string {
  const q = encodeURIComponent((v.query || "").trim());
  return `https://bitbucket.org/search?q=${q}`;
}

const BB_FIELDS: FieldConfig[] = [
  { key: "query", label: "Запрос", type: "text", placeholder: "C++, Go, Rust, Python..." },
];

// --------------------------------------------------------------------------
// 20. Kaggle — data science / ML profiles
// --------------------------------------------------------------------------
const KG_PRESETS: Preset[] = [
  { id: "kg-python", label: "Python data", hint: "ML, data", values: { query: "Python data science" } },
  { id: "kg-cpp", label: "C++ ML", hint: "performance", values: { query: "C++ machine learning" } },
  { id: "kg-pg", label: "PostgreSQL", hint: "databases", values: { query: "PostgreSQL" } },
  { id: "kg-linux", label: "Linux systems", hint: "systems", values: { query: "Linux systems" } },
];

function buildKaggleUrl(v: Record<string, any>): string {
  const q = encodeURIComponent((v.query || "").trim());
  return `https://www.kaggle.com/search?q=${q}`;
}

const KG_FIELDS: FieldConfig[] = [
  { key: "query", label: "Запрос", type: "text", placeholder: "Python, C++, PostgreSQL..." },
];

// --------------------------------------------------------------------------
// 21. Docker Hub — infrastructure / DevOps
// --------------------------------------------------------------------------
const DH_PRESETS: Preset[] = [
  { id: "dh-pg", label: "PostgreSQL", hint: "БД", values: { query: "postgres" } },
  { id: "dh-redis", label: "Redis", hint: "кэш", values: { query: "redis" } },
  { id: "dh-nginx", label: "Nginx", hint: "proxy", values: { query: "nginx" } },
  { id: "dh-kafka", label: "Kafka", hint: "СРК", values: { query: "kafka" } },
  { id: "dh-linux", label: "Linux", hint: "OS", values: { query: "linux" } },
];

function buildDockerhubUrl(v: Record<string, any>): string {
  const q = encodeURIComponent((v.query || "").trim());
  return `https://hub.docker.com/search?q=${q}`;
}

const DH_FIELDS: FieldConfig[] = [
  { key: "query", label: "Запрос", type: "text", placeholder: "postgres, redis, nginx, kafka..." },
];

// --------------------------------------------------------------------------
// 22. pkg.go.dev — Go package authors
// --------------------------------------------------------------------------
const GOPKG_PRESETS: Preset[] = [
  { id: "gopkg-pg", label: "PostgreSQL", hint: "БД", values: { query: "postgres" } },
  { id: "gopkg-kafka", label: "Kafka", hint: "СРК", values: { query: "kafka" } },
  { id: "gopkg-grpc", label: "gRPC", hint: "networking", values: { query: "grpc" } },
  { id: "gopkg-linux", label: "Linux/syscall", hint: "системное", values: { query: "syscall linux" } },
];

function buildGopkgUrl(v: Record<string, any>): string {
  const q = encodeURIComponent((v.query || "").trim());
  return `https://pkg.go.dev/search?q=${q}`;
}

const GOPKG_FIELDS: FieldConfig[] = [
  { key: "query", label: "Запрос", type: "text", placeholder: "postgres, kafka, grpc..." },
];

// --------------------------------------------------------------------------
// 23. crates.io — Rust package authors
// --------------------------------------------------------------------------
const CRATES_PRESETS: Preset[] = [
  { id: "crates-linux", label: "Linux", hint: "системное", values: { query: "linux" } },
  { id: "crates-db", label: "Database", hint: "БД", values: { query: "database" } },
  { id: "crates-net", label: "Networking", hint: "сеть", values: { query: "networking" } },
  { id: "crates-cli", label: "CLI", hint: "утилиты", values: { query: "cli" } },
];

function buildCratesUrl(v: Record<string, any>): string {
  const q = encodeURIComponent((v.query || "").trim());
  return `https://crates.io/search?q=${q}`;
}

const CRATES_FIELDS: FieldConfig[] = [
  { key: "query", label: "Запрос", type: "text", placeholder: "linux, database, networking..." },
];

// --------------------------------------------------------------------------
// 24. PyPI — Python package authors
// --------------------------------------------------------------------------
const PYPI_PRESETS: Preset[] = [
  { id: "pypi-pg", label: "PostgreSQL", hint: "БД", values: { query: "postgres" } },
  { id: "pypi-linux", label: "Linux/system", hint: "системное", values: { query: "linux system" } },
  { id: "pypi-async", label: "AsyncIO", hint: "async", values: { query: "asyncio" } },
  { id: "pypi-ctypes", label: "ctypes/C", hint: "C bindings", values: { query: "ctypes" } },
];

function buildPypiUrl(v: Record<string, any>): string {
  const q = encodeURIComponent((v.query || "").trim());
  return `https://pypi.org/search/?q=${q}`;
}

const PYPI_FIELDS: FieldConfig[] = [
  { key: "query", label: "Запрос", type: "text", placeholder: "postgres, linux, asyncio..." },
];

// --------------------------------------------------------------------------
// 25. Codeberg — open source code hosting
// --------------------------------------------------------------------------
const CB_PRESETS: Preset[] = [
  { id: "cb-c", label: "C проекты", hint: "системное", values: { query: "C linux" } },
  { id: "cb-go", label: "Go проекты", hint: "CLI, сервисы", values: { query: "Go cli" } },
  { id: "cb-rust", label: "Rust проекты", hint: "системное", values: { query: "Rust systems" } },
  { id: "cb-kernel", label: "Linux kernel", hint: "ядро", values: { query: "linux kernel" } },
];

function buildCodebergUrl(v: Record<string, any>): string {
  const q = encodeURIComponent((v.query || "").trim());
  return `https://codeberg.org/explore/repos?q=${q}`;
}

const CB_FIELDS: FieldConfig[] = [
  { key: "query", label: "Запрос", type: "text", placeholder: "C, Go, Rust, Linux..." },
];

// --------------------------------------------------------------------------
// 26. LeetCode — coding profiles via Google x-ray
// --------------------------------------------------------------------------
const LC_PRESETS: Preset[] = [
  { id: "lc-cpp", label: "C++ программист", hint: "Google x-ray", values: { query: "C++ Russia" } },
  { id: "lc-go", label: "Go программист", hint: "Google x-ray", values: { query: "Go developer Russia" } },
  { id: "lc-python", label: "Python программист", hint: "Google x-ray", values: { query: "Python developer Russia" } },
  { id: "lc-rust", label: "Rust программист", hint: "Google x-ray", values: { query: "Rust developer" } },
];

function buildLeetcodeUrl(v: Record<string, any>): string {
  const q = encodeURIComponent((v.query || "").trim());
  return `https://www.google.com/search?q=site:leetcode.com+${q}`;
}

const LC_FIELDS: FieldConfig[] = [
  { key: "query", label: "Запрос", type: "text", placeholder: "C++, Go, Python, Rust..." },
];

// --------------------------------------------------------------------------
// 27. Medium — tech articles & profiles
// --------------------------------------------------------------------------
const MED_PRESETS: Preset[] = [
  { id: "med-cpp", label: "C++ systems", hint: "системное ПО", values: { query: "C++ systems programming" } },
  { id: "med-go", label: "Go backend", hint: "highload", values: { query: "Go backend highload" } },
  { id: "med-rust", label: "Rust systems", hint: "системное", values: { query: "Rust systems programming" } },
  { id: "med-linux", label: "Linux kernel", hint: "ядро", values: { query: "Linux kernel development" } },
  { id: "med-db", label: "Базы данных", hint: "PostgreSQL, СУБД", values: { query: "database PostgreSQL internals" } },
];

function buildMediumUrl(v: Record<string, any>): string {
  const q = encodeURIComponent((v.query || "").trim());
  return `https://medium.com/search?q=${q}`;
}

const MED_FIELDS: FieldConfig[] = [
  { key: "query", label: "Запрос", type: "text", placeholder: "C++, Go, Rust, Linux..." },
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
  hh: {
    id: "hh",
    name: "hh.ru",
    tagline: "HeadHunter · резюме",
    description:
      "Крупнейший российский job-сайт. Поиск резюме системных разработчиков (C, C++, Go, Python, Rust, DBA, DevOps) с фильтром по регионам РФ.",
    accent: "from-red-500 to-rose-600",
    iconKey: "briefcase",
    sourceTag: "hh",
    fields: HH_FIELDS,
    presets: HH_PRESETS,
    buildUrl: buildHhUrl,
    summarize: (v) => summarizeValues(v, HH_FIELDS),
  },
  superjob: {
    id: "superjob",
    name: "Superjob",
    tagline: "резюме · Россия",
    description:
      "Второй по величине российский job-сайт. Поиск резюме системных разработчиков и Linux-администраторов по городам РФ.",
    accent: "from-pink-500 to-rose-500",
    iconKey: "briefcase",
    sourceTag: "superjob",
    fields: SJ_FIELDS,
    presets: SJ_PRESETS,
    buildUrl: buildSjUrl,
    summarize: (v) => summarizeValues(v, SJ_FIELDS),
  },
  opennet: {
    id: "opennet",
    name: "OpenNet",
    tagline: "opennet.ru · UNIX/Linux",
    description:
      "Крупнейший русскоязычный портал по open-source, UNIX/Linux. Новости, статьи и обсуждения про ядро, СУБД, системное ПО. Активные комментаторы — инженеры.",
    accent: "from-cyan-500 to-teal-600",
    iconKey: "globe",
    sourceTag: "opennet",
    fields: OPENNET_FIELDS,
    presets: OPENNET_PRESETS,
    buildUrl: buildOpennetUrl,
    summarize: (v) => summarizeValues(v, OPENNET_FIELDS),
  },
  vc: {
    id: "vc",
    name: "VC.ru",
    tagline: "IT-медиа · авторы",
    description:
      "Крупнейшее российское IT-медиа. Авторы статей про C++, Go, Rust, базы данных, DevOps и инфраструктуру — часто действующие инженеры и техлиды.",
    accent: "from-indigo-500 to-violet-600",
    iconKey: "newspaper",
    sourceTag: "vc",
    fields: VC_FIELDS,
    presets: VC_PRESETS,
    buildUrl: buildVcUrl,
    summarize: (v) => summarizeValues(v, VC_FIELDS),
  },
  habrqa: {
    id: "habrqa",
    name: "Habr Q&A",
    tagline: "qna.habr.com · вопросы",
    description:
      "Русскоязычный Q&A-сервис от Хабра. Поиск экспертов по C++, Go, Rust, PostgreSQL, Linux и ядру через ответы на технические вопросы.",
    accent: "from-teal-500 to-emerald-600",
    iconKey: "message",
    sourceTag: "habrqa",
    fields: HABRQA_FIELDS,
    presets: HABRQA_PRESETS,
    buildUrl: buildHabrQaUrl,
    summarize: (v) => summarizeValues(v, HABRQA_FIELDS),
  },
  ruso: {
    id: "ruso",
    name: "ru.SO",
    tagline: "StackOverflow на русском",
    description:
      "Русская версия StackOverflow. Поиск пользователей по тегам (c, c++, go, postgresql, rust, bash, linux) с топом по репутации.",
    accent: "from-amber-500 to-orange-600",
    iconKey: "so",
    sourceTag: "ruso",
    fields: RUSO_FIELDS,
    presets: RUSO_PRESETS,
    buildUrl: buildRusoUrl,
    summarize: (v) => summarizeValues(v, RUSO_FIELDS),
  },
  ubuntu: {
    id: "ubuntu",
    name: "Ubuntu.ru",
    tagline: "forum.ubuntu.ru · Linux",
    description:
      "Крупнейшее русскоязычное Ubuntu-сообщество. Форум с обсуждениями драйверов, ядра, системного ПО и администрирования — активные участники часто инженеры.",
    accent: "from-orange-500 to-red-600",
    iconKey: "terminal",
    sourceTag: "ubuntu",
    fields: UBUNTU_FIELDS,
    presets: UBUNTU_PRESETS,
    buildUrl: buildUbuntuUrl,
    summarize: (v) => summarizeValues(v, UBUNTU_FIELDS),
  },
  telegram: {
    id: "telegram",
    name: "Telegram",
    tagline: "TG-каналы и поиск · главная RU-среда",
    description:
      "Telegram — основная среда общения русскоязычных разработчиков. X-ray поиск через Google (site:t.me), поиск через TG-агрегаторы + курируемая база из 15 профильных каналов: C++, Go, Rust, Python, DBA, DevOps, Linux.",
    accent: "from-sky-500 to-cyan-600",
    iconKey: "telegram",
    sourceTag: "telegram",
    fields: TELEGRAM_FIELDS,
    presets: TELEGRAM_PRESETS,
    buildUrl: buildTelegramUrl,
    summarize: (v) => summarizeValues(v, TELEGRAM_FIELDS),
    resources: TELEGRAM_RESOURCES,
  },
  gitlab: {
    id: "gitlab",
    name: "GitLab",
    tagline: "gitlab.com · код и профили",
    description:
      "GitLab — вторая по величине платформа хостинга кода. Поиск проектов и профилей разработчиков C, C++, Go, Rust. Многие системные проекты (kernel, embedded, infrastructure) размещены здесь.",
    accent: "from-orange-500 to-red-600",
    iconKey: "github",
    sourceTag: "gitlab",
    fields: GITLAB_FIELDS,
    presets: GITLAB_PRESETS,
    buildUrl: buildGitlabUrl,
    summarize: (v) => summarizeValues(v, GITLAB_FIELDS),
  },
  codeforces: {
    id: "codeforces",
    name: "Codeforces",
    tagline: "Спортивное программирование",
    description:
      "Codeforces — крупнейшая платформа спортивного программирования, основанная в России. Рейтинг по странам, поиск профилей сильных C++/Go разработчиков через Google x-ray.",
    accent: "from-blue-500 to-indigo-600",
    iconKey: "terminal",
    sourceTag: "codeforces",
    fields: CF_FIELDS,
    presets: CF_PRESETS,
    buildUrl: buildCfUrl,
    summarize: (v) => summarizeValues(v, CF_FIELDS),
  },
  reddit: {
    id: "reddit",
    name: "Reddit",
    tagline: "r/cpp · r/golang · r/rust",
    description:
      "Reddit — англоязычные developer-сообщества. Поиск по тематическим сабреддитам: r/cpp, r/golang, r/rust, r/linuxdev, r/Python. Активные авторы и комментаторы — практикующие инженеры.",
    accent: "from-orange-500 to-amber-600",
    iconKey: "globe",
    sourceTag: "reddit",
    fields: REDDIT_FIELDS,
    presets: REDDIT_PRESETS,
    buildUrl: buildRedditUrl,
    summarize: (v) => summarizeValues(v, REDDIT_FIELDS),
  },
  devto: {
    id: "devto",
    name: "Dev.to",
    tagline: "dev.to · статьи разработчиков",
    description:
      "Dev.to — сообщество разработчиков со статьями про C++, Go, Rust, Linux, базы данных. Авторы технических статей — часто опытные инженеры, доступные для контакта.",
    accent: "from-slate-500 to-gray-700",
    iconKey: "book",
    sourceTag: "devto",
    fields: DEVTO_FIELDS,
    presets: DEVTO_PRESETS,
    buildUrl: buildDevtoUrl,
    summarize: (v) => summarizeValues(v, DEVTO_FIELDS),
  },
  sourcehut: {
    id: "sourcehut",
    name: "Sourcehut",
    tagline: "sr.ht · минималистичный хостинг",
    description:
      "Sourcehut — минималистичная платформа хостинга кода, популярная среди C/Go/Rust разработчиков. Поиск проектов по языку и тематике — ядро, CLI, системное ПО.",
    accent: "from-emerald-500 to-green-700",
    iconKey: "github",
    sourceTag: "sourcehut",
    fields: SH_FIELDS,
    presets: SH_PRESETS,
    buildUrl: buildSourcehutUrl,
    summarize: (v) => summarizeValues(v, SH_FIELDS),
  },
  hackersnews: {
    id: "hackersnews",
    name: "HackerNews",
    tagline: "news.ycombinator.com · дискуссии",
    description:
      "HackerNews — главное англоязычное dev-сообщество. Поиск по обсуждениям, тредам «Ask HN: Who is hiring?» и профилям. Активные комментаторы — опытные инженеры.",
    accent: "from-orange-500 to-amber-600",
    iconKey: "globe",
    sourceTag: "hackersnews",
    fields: HN_FIELDS,
    presets: HN_PRESETS,
    buildUrl: buildHnUrl,
    summarize: (v) => summarizeValues(v, HN_FIELDS),
  },
  bitbucket: {
    id: "bitbucket",
    name: "Bitbucket",
    tagline: "bitbucket.org · Atlassian",
    description:
      "Bitbucket — платформа хостинга кода от Atlassian. Поиск репозиториев C, C++, Go, Rust. Enterprise-проекты и интеграция с Jira.",
    accent: "from-blue-500 to-sky-600",
    iconKey: "github",
    sourceTag: "bitbucket",
    fields: BB_FIELDS,
    presets: BB_PRESETS,
    buildUrl: buildBitbucketUrl,
    summarize: (v) => summarizeValues(v, BB_FIELDS),
  },
  kaggle: {
    id: "kaggle",
    name: "Kaggle",
    tagline: "kaggle.com · Data Science",
    description:
      "Kaggle — платформа для data science и ML. Поиск профилей дата-сайентистов, Python-разработчиков и инженеров баз данных.",
    accent: "from-sky-500 to-blue-600",
    iconKey: "book",
    sourceTag: "kaggle",
    fields: KG_FIELDS,
    presets: KG_PRESETS,
    buildUrl: buildKaggleUrl,
    summarize: (v) => summarizeValues(v, KG_FIELDS),
  },
  dockerhub: {
    id: "dockerhub",
    name: "Docker Hub",
    tagline: "hub.docker.com · DevOps",
    description:
      "Docker Hub — реестр контейнерных образов. Поиск по образам PostgreSQL, Redis, Kafka, Nginx. Авторы образов — DevOps и инфраструктурные инженеры.",
    accent: "from-blue-500 to-cyan-600",
    iconKey: "terminal",
    sourceTag: "dockerhub",
    fields: DH_FIELDS,
    presets: DH_PRESETS,
    buildUrl: buildDockerhubUrl,
    summarize: (v) => summarizeValues(v, DH_FIELDS),
  },
  gopkg: {
    id: "gopkg",
    name: "pkg.go.dev",
    tagline: "Go-пакеты · авторы",
    description:
      "pkg.go.dev — реестр Go-пакетов. Поиск авторов пакетов для PostgreSQL, Kafka, gRPC, системного программирования. Авторы — опытные Go-разработчики.",
    accent: "from-cyan-500 to-teal-600",
    iconKey: "terminal",
    sourceTag: "gopkg",
    fields: GOPKG_FIELDS,
    presets: GOPKG_PRESETS,
    buildUrl: buildGopkgUrl,
    summarize: (v) => summarizeValues(v, GOPKG_FIELDS),
  },
  crates: {
    id: "crates",
    name: "crates.io",
    tagline: "Rust-пакеты · авторы",
    description:
      "crates.io — реестр Rust-пакетов. Поиск авторов пакетов для Linux, баз данных, сетевого программирования. Авторы — Rust-разработчики.",
    accent: "from-orange-500 to-red-600",
    iconKey: "terminal",
    sourceTag: "crates",
    fields: CRATES_FIELDS,
    presets: CRATES_PRESETS,
    buildUrl: buildCratesUrl,
    summarize: (v) => summarizeValues(v, CRATES_FIELDS),
  },
  pypi: {
    id: "pypi",
    name: "PyPI",
    tagline: "pypi.org · Python-пакеты",
    description:
      "PyPI — реестр Python-пакетов. Поиск авторов пакетов для PostgreSQL, Linux, asyncio, C bindings. Авторы — Python-разработчики с системной экспертизой.",
    accent: "from-blue-500 to-indigo-600",
    iconKey: "terminal",
    sourceTag: "pypi",
    fields: PYPI_FIELDS,
    presets: PYPI_PRESETS,
    buildUrl: buildPypiUrl,
    summarize: (v) => summarizeValues(v, PYPI_FIELDS),
  },
  codeberg: {
    id: "codeberg",
    name: "Codeberg",
    tagline: "codeberg.org · open source",
    description:
      "Codeberg — некоммерческая платформа хостинга кода (Gitea). Популярна среди open-source разработчиков C, Go, Rust. Поиск проектов по языку.",
    accent: "from-teal-500 to-cyan-700",
    iconKey: "github",
    sourceTag: "codeberg",
    fields: CB_FIELDS,
    presets: CB_PRESETS,
    buildUrl: buildCodebergUrl,
    summarize: (v) => summarizeValues(v, CB_FIELDS),
  },
  leetcode: {
    id: "leetcode",
    name: "LeetCode",
    tagline: "leetcode.com · алгоритмика",
    description:
      "LeetCode — платформа для подготовки к алгоритмическим собеседованиям. Google x-ray поиск профилей по языку и региону. Сильные алгоритмисты.",
    accent: "from-amber-500 to-yellow-600",
    iconKey: "terminal",
    sourceTag: "leetcode",
    fields: LC_FIELDS,
    presets: LC_PRESETS,
    buildUrl: buildLeetcodeUrl,
    summarize: (v) => summarizeValues(v, LC_FIELDS),
  },
  medium: {
    id: "medium",
    name: "Medium",
    tagline: "medium.com · статьи",
    description:
      "Medium — платформа статей. Технические статьи про C++, Go, Rust, Linux kernel, базы данных. Авторы — опытные инженеры, доступные для контакта.",
    accent: "from-slate-500 to-gray-700",
    iconKey: "book",
    sourceTag: "medium",
    fields: MED_FIELDS,
    presets: MED_PRESETS,
    buildUrl: buildMediumUrl,
    summarize: (v) => summarizeValues(v, MED_FIELDS),
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
