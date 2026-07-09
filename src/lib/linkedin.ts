// LinkedIn People Search URL builder + recruiter presets.
//
// LinkedIn does not offer a public search API and prohibits scraping. This
// module builds a valid LinkedIn People-search URL from structured recruiter
// filters; the recruiter opens it in a browser where they are logged in to
// LinkedIn. This is the ToS-compliant way to power a structured LinkedIn
// sourcing workflow.

export interface LinkedInFilters {
  keywords: string; // free-text job title / phrase, e.g. "Senior C++ Developer"
  skills: string; // comma-separated skills, e.g. "Linux, PostgreSQL, Go"
  location: string; // city/region/country, e.g. "Moscow"
  currentCompany: string; // e.g. "Yandex"
  pastCompany: string; // e.g. "Google"
  school: string; // e.g. "MIPT"
  seniority: string; // e.g. "Senior" | "Lead" | "Director"
  industry: string; // e.g. "Information Technology"
  connectionOf: string; // a LinkedIn profile URL to search 2nd/3rd degree
  openToWork: boolean; // "Open to work" filter
}

export const EMPTY_LINKEDIN_FILTERS: LinkedInFilters = {
  keywords: "",
  skills: "",
  location: "",
  currentCompany: "",
  pastCompany: "",
  school: "",
  seniority: "",
  industry: "",
  connectionOf: "",
  openToWork: false,
};

// Build the LinkedIn People-search URL from structured filters.
// We combine everything into the `keywords` param using quoted phrases, which
// LinkedIn ANDs together. Location is appended as a quoted token.
export function buildLinkedInUrl(f: LinkedInFilters): string {
  const tokens: string[] = [];
  if (f.keywords.trim()) tokens.push(`"${f.keywords.trim()}"`);
  if (f.skills.trim()) {
    f.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((s) => tokens.push(`"${s}"`));
  }
  if (f.seniority.trim()) tokens.push(`"${f.seniority.trim()}"`);
  if (f.currentCompany.trim()) tokens.push(`"${f.currentCompany.trim()}"`);
  if (f.pastCompany.trim()) tokens.push(`"${f.pastCompany.trim()}"`);
  if (f.school.trim()) tokens.push(`"${f.school.trim()}"`);
  if (f.industry.trim()) tokens.push(`"${f.industry.trim()}"`);
  if (f.location.trim()) tokens.push(`"${f.location.trim()}"`);

  const params = new URLSearchParams();
  params.set("origin", "GLOBAL_SEARCH_HEADER");
  if (tokens.length) params.set("keywords", tokens.join(" "));
  if (f.openToWork) {
    // "Open to work" facet (id 3 == Open to work)
    params.set("facet", '["3561|4"]');
  }

  return `https://www.linkedin.com/search/results/people/?${params.toString()}`;
}

// Human-readable summary of the active filters (for the results toolbar).
export function summarizeLinkedInFilters(f: LinkedInFilters): string {
  const parts: string[] = [];
  if (f.keywords.trim()) parts.push(f.keywords.trim());
  if (f.skills.trim()) parts.push(`навыки: ${f.skills.trim()}`);
  if (f.seniority.trim()) parts.push(`грейд: ${f.seniority.trim()}`);
  if (f.location.trim()) parts.push(`локация: ${f.location.trim()}`);
  if (f.currentCompany.trim()) parts.push(`сейчаст: ${f.currentCompany.trim()}`);
  if (f.pastCompany.trim()) parts.push(`раньше: ${f.pastCompany.trim()}`);
  if (f.school.trim()) parts.push(`вуз: ${f.school.trim()}`);
  if (f.industry.trim()) parts.push(`отрасль: ${f.industry.trim()}`);
  if (f.openToWork) parts.push("open to work");
  return parts.length ? parts.join(" · ") : "без фильтров";
}

// Count active filters for the badge.
export function countLinkedInFilters(f: LinkedInFilters): number {
  let n = 0;
  if (f.keywords.trim()) n++;
  if (f.skills.trim()) n++;
  if (f.location.trim()) n++;
  if (f.currentCompany.trim()) n++;
  if (f.pastCompany.trim()) n++;
  if (f.school.trim()) n++;
  if (f.seniority.trim()) n++;
  if (f.industry.trim()) n++;
  if (f.connectionOf.trim()) n++;
  if (f.openToWork) n++;
  return n;
}

export interface LinkedInPreset {
  id: string;
  label: string;
  hint: string;
  filters: Partial<LinkedInFilters>;
}

// Recruiter presets focused on systems-software engineers in Russia.
export const LINKEDIN_PRESETS: LinkedInPreset[] = [
  {
    id: "cpp-senior-msk",
    label: "Senior C++ · Москва",
    hint: "СУБД, движки",
    filters: { keywords: "Senior C++ Developer", location: "Moscow", seniority: "Senior" },
  },
  {
    id: "go-russia",
    label: "Go Developer · Россия",
    hint: "микросервисы, СРК",
    filters: { keywords: "Go Developer", location: "Russia", skills: "Go, Kafka, gRPC" },
  },
  {
    id: "c-linux",
    label: "C Developer · Linux",
    hint: "ядро, драйверы",
    filters: { keywords: "C Developer", skills: "Linux, Kernel, C", location: "Russia" },
  },
  {
    id: "python-backend-ru",
    label: "Python Backend · Россия",
    hint: "backend, автоматизация",
    filters: { keywords: "Python Backend Developer", location: "Russia", skills: "Python, PostgreSQL" },
  },
  {
    id: "rust-systems",
    label: "Rust Engineer",
    hint: "безопасные системы",
    filters: { keywords: "Rust Engineer", skills: "Rust, Systems", location: "Russia" },
  },
  {
    id: "db-admin-msk",
    label: "DBA · Москва",
    hint: "PostgreSQL, ClickHouse",
    filters: { keywords: "Database Administrator", skills: "PostgreSQL, ClickHouse", location: "Moscow" },
  },
  {
    id: "devops-msk",
    label: "DevOps · Москва",
    hint: "K8s, инфраструктура",
    filters: { keywords: "DevOps Engineer", skills: "Kubernetes, Linux", location: "Moscow" },
  },
  {
    id: "storage-engineer",
    label: "Storage Engineer",
    hint: "СХД, Ceph",
    filters: { keywords: "Storage Engineer", skills: "Ceph, Storage, SAN", location: "Russia" },
  },
];

// Common Russian locations for the LinkedIn location filter.
export const LINKEDIN_LOCATIONS: string[] = [
  "Moscow",
  "Saint Petersburg",
  "Novosibirsk",
  "Yekaterinburg",
  "Kazan",
  "Nizhny Novgorod",
  "Russia",
  "Remote",
];

// Common seniority levels.
export const LINKEDIN_SENIORITY: string[] = [
  "Junior",
  "Middle",
  "Senior",
  "Lead",
  "Staff",
  "Principal",
  "Director",
];

// Common industries for systems-software sourcing.
export const LINKEDIN_INDUSTRIES: string[] = [
  "Information Technology",
  "Software Development",
  "Computer Software",
  "Internet",
  "Cybersecurity",
  "Telecommunications",
  "Financial Services",
  "Cloud Computing",
];
