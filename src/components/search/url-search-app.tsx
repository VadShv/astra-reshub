"use client";

import * as React from "react";
import {
  ArrowLeft,
  Search,
  ExternalLink,
  Filter,
  RotateCcw,
  Wand2,
  Plus,
  ClipboardList,
  Sparkles,
  Copy,
  UserPlus,
  Globe,
  Terminal,
  Newspaper,
  HelpCircle,
  Github,
  Linkedin,
  Briefcase,
  MessageSquare,
  BookOpen,
  Send,
  Link2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { useUIStore, AppId } from "@/components/github/ui-store";
import {
  SelectionPanel,
  SelectionFab,
} from "@/components/github/selection-panel";
import { useSelectionStore, Candidate } from "@/components/github/selection-store";
import {
  URL_SYSTEMS,
  UrlSystemId,
  UrlSystemConfig,
  FieldConfig,
  countSystemFilters,
} from "@/lib/search-systems";

const ICONS: Record<string, React.ReactNode> = {
  google: <Globe className="h-5 w-5" />,
  terminal: <Terminal className="h-5 w-5" />,
  habr: <Newspaper className="h-5 w-5" />,
  so: <HelpCircle className="h-5 w-5" />,
  linkedin: <Linkedin className="h-5 w-5" />,
  github: <Github className="h-5 w-5" />,
  briefcase: <Briefcase className="h-5 w-5" />,
  newspaper: <Newspaper className="h-5 w-5" />,
  globe: <Globe className="h-5 w-5" />,
  message: <MessageSquare className="h-5 w-5" />,
  book: <BookOpen className="h-5 w-5" />,
  telegram: <Send className="h-5 w-5" />,
};

const ICONS_SM: Record<string, React.ReactNode> = {
  google: <Globe className="h-3.5 w-3.5" />,
  terminal: <Terminal className="h-3.5 w-3.5" />,
  habr: <Newspaper className="h-3.5 w-3.5" />,
  so: <HelpCircle className="h-3.5 w-3.5" />,
  linkedin: <Linkedin className="h-3.5 w-3.5" />,
  github: <Github className="h-3.5 w-3.5" />,
  briefcase: <Briefcase className="h-3.5 w-3.5" />,
  newspaper: <Newspaper className="h-3.5 w-3.5" />,
  globe: <Globe className="h-3.5 w-3.5" />,
  message: <MessageSquare className="h-3.5 w-3.5" />,
  book: <BookOpen className="h-3.5 w-3.5" />,
  telegram: <Send className="h-3.5 w-3.5" />,
};

function SectionTitle({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      <span className="text-primary">{icon}</span>
      {children}
    </div>
  );
}

function emptyValues(config: UrlSystemConfig): Record<string, any> {
  const v: Record<string, any> = {};
  for (const f of config.fields) {
    v[f.key] = f.type === "boolean" ? false : f.type === "select" ? "__any" : "";
  }
  return v;
}

export function UrlSearchApp({ systemId }: { systemId: UrlSystemId }) {
  const setApp = useUIStore((s) => s.setApp);
  const config = URL_SYSTEMS[systemId];
  const [values, setValues] = React.useState<Record<string, any>>(() => emptyValues(config));
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);
  const [selectionOpen, setSelectionOpen] = React.useState(false);
  const [addOpen, setAddOpen] = React.useState(false);
  const selectionCount = useSelectionStore((s) => s.candidates.length);

  const activeCount = countSystemFilters(values, systemId);
  const url = config.buildUrl(values);
  const summary = config.summarize(values);

  const setField = (key: string, value: any) =>
    setValues((v) => ({ ...v, [key]: value }));

  const applyPreset = (presetValues: Record<string, any>) => {
    setValues({ ...emptyValues(config), ...presetValues });
    toast.success("Пресет применён");
  };

  const resetFilters = () => {
    setValues(emptyValues(config));
    toast.message("Фильтры сброшены");
  };

  const openSearch = () => {
    if (activeCount === 0) {
      toast.warning("Задайте хотя бы один фильтр для поиска");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
    toast.success(`Открываю поиск: ${config.name}`);
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Ссылка скопирована");
    } catch {
      toast.error("Не удалось скопировать");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/65">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center gap-3 h-16">
            <button
              onClick={() => setApp("launcher")}
              className="flex items-center gap-2 shrink-0 group cursor-pointer"
              title="К списку поисковых систем"
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${config.accent} text-white group-hover:scale-105 transition-transform shadow-sm`}
              >
                {ICONS[config.iconKey]}
              </div>
              <div className="hidden sm:block leading-none text-left">
                <span className="font-bold text-base tracking-tight">{config.name}</span>
                <span className="block text-[10px] text-muted-foreground mt-0.5">
                  {config.tagline}
                </span>
              </div>
            </button>

            <form
              className="flex-1 max-w-2xl flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                openSearch();
              }}
            >
              <div className="relative flex-1 group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  type="text"
                  value={values.query ?? ""}
                  onChange={(e) => setField("query", e.target.value)}
                  placeholder={getPlaceholder(systemId)}
                  className="pl-10 pr-4 h-11 text-sm bg-background/60 border-border/60 rounded-full"
                />
              </div>
              <Button
                type="submit"
                className={`h-11 px-5 gap-2 rounded-full shadow-sm shrink-0 bg-gradient-to-br ${config.accent} hover:opacity-90`}
              >
                <ExternalLink className="h-4 w-4" />
                <span className="hidden sm:inline">Открыть</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-11 w-11 lg:hidden relative rounded-full shrink-0"
                onClick={() => setMobileFiltersOpen(true)}
                aria-label="Фильтры"
              >
                <Filter className="h-4 w-4" />
                {activeCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
                    {activeCount}
                  </span>
                )}
              </Button>
            </form>

            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 gap-1.5 rounded-full hidden sm:inline-flex text-muted-foreground"
                onClick={() => setApp("launcher")}
                title="К списку поисковых систем"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span className="hidden xl:inline">Все системы</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="relative h-9 gap-1.5 rounded-full"
                onClick={() => setSelectionOpen(true)}
                title="Открыть выборку кандидатов для ХАНТ"
              >
                <ClipboardList className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Выборка</span>
                {selectionCount > 0 && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-1">
                    {selectionCount}
                  </span>
                )}
              </Button>
              <Button
                size="sm"
                className={`h-9 gap-1.5 rounded-full bg-gradient-to-br ${config.accent} hover:opacity-90`}
                onClick={() => setAddOpen(true)}
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Добавить</span>
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-5">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5">
            {/* Filters sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 h-[calc(100vh-8rem)] rounded-xl border bg-card/50 p-3 shadow-sm overflow-hidden flex flex-col">
                <FiltersPanel
                  config={config}
                  values={values}
                  setField={setField}
                  resetFilters={resetFilters}
                  activeCount={activeCount}
                  applyPreset={applyPreset}
                />
              </div>
            </aside>

            {/* Results / URL preview */}
            <section className="min-w-0 space-y-4">
              {/* Toolbar */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="text-sm text-muted-foreground">
                  Активные фильтры:{" "}
                  <span className="font-medium text-foreground">{summary}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-full gap-1.5"
                  onClick={openSearch}
                  disabled={activeCount === 0}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Открыть поиск
                </Button>
              </div>

              {/* URL preview card */}
              <Card className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-primary`}>{ICONS_SM[config.iconKey]}</span>
                  <h3 className="text-sm font-semibold">Ссылка на поиск: {config.name}</h3>
                  {activeCount > 0 && (
                    <Badge className="ml-auto text-[10px]">{activeCount} фильтр(ов)</Badge>
                  )}
                </div>
                <div className="rounded-lg bg-muted/50 border p-3 font-mono text-xs break-all leading-relaxed text-muted-foreground max-h-32 overflow-y-auto scrollbar-thin">
                  {url}
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Button onClick={openSearch} disabled={activeCount === 0} className="gap-1.5">
                    <ExternalLink className="h-4 w-4" />
                    Открыть в {config.name}
                  </Button>
                  <Button variant="outline" onClick={copyUrl} disabled={activeCount === 0} className="gap-1.5">
                    <Copy className="h-4 w-4" />
                    Копировать ссылку
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
                  {getHint(systemId)}
                </p>
              </Card>

              {/* Presets */}
              <Card className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Wand2 className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold">Готовые пресеты</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {config.presets.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => applyPreset(p.values)}
                      className="group flex items-center justify-between gap-2 rounded-lg border bg-card/60 px-3 py-2.5 text-left hover:border-primary/50 hover:shadow-sm transition-all"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{p.label}</div>
                        <div className="text-[11px] text-muted-foreground truncate">{p.hint}</div>
                      </div>
                      <ArrowLeft className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 rotate-180 transition-opacity shrink-0" />
                    </button>
                  ))}
                </div>
              </Card>

              {/* Manual add hint */}
              <Card className="p-5">
                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${config.accent} text-white shrink-0`}>
                    <UserPlus className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold mb-1">Ручное добавление кандидатов</h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      Найдите кандидата через {config.name} и добавьте его в выборку
                      вручную — имя, должность, компания, ссылка на профиль. Экспорт в
                      ХАНТ общий с GitFind и LinkedIn.
                    </p>
                    <Button size="sm" variant="outline" onClick={() => setAddOpen(true)} className="gap-1.5">
                      <Plus className="h-3.5 w-3.5" />
                      Добавить кандидата
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Curated resources (e.g. Telegram channel database) */}
              {config.resources && config.resources.groups.length > 0 && (
                <Card className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Link2 className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold">{config.resources.title}</h3>
                    <Badge variant="secondary" className="ml-auto text-[10px]">
                      {config.resources.groups.length}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {config.resources.groups.map((r, i) => (
                      <a
                        key={i}
                        href={r.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center gap-2 rounded-lg border bg-card/60 px-3 py-2 hover:border-primary/50 hover:shadow-sm transition-all"
                      >
                        <span className="text-primary shrink-0">
                          {ICONS_SM[config.iconKey]}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                            {r.title}
                          </div>
                          {r.description && (
                            <div className="text-[11px] text-muted-foreground truncate">
                              {r.description}
                            </div>
                          )}
                        </div>
                        <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 shrink-0 transition-opacity" />
                      </a>
                    ))}
                  </div>
                </Card>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t bg-card/40">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>
              <span className="font-semibold text-foreground">{config.name}</span> —{" "}
              {config.tagline}
            </span>
            <button
              onClick={() => setApp("launcher")}
              className="inline-flex items-center gap-1 hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-3 w-3" />
              Все системы
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile filters sheet */}
      <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <SheetContent side="left" className="w-[90%] sm:w-[380px] overflow-y-auto p-0">
          <SheetHeader className="px-4 pt-4 pb-2 border-b">
            <SheetTitle className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Фильтры: {config.name}
            </SheetTitle>
          </SheetHeader>
          <div className="p-4">
            <FiltersPanel
              config={config}
              values={values}
              setField={setField}
              resetFilters={resetFilters}
              activeCount={activeCount}
              applyPreset={applyPreset}
              className="!block !h-auto"
            />
            <Separator className="my-4" />
            <Button
              className="w-full"
              onClick={() => {
                setMobileFiltersOpen(false);
                openSearch();
              }}
            >
              Открыть поиск
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Selection panel (shared) */}
      <SelectionPanel open={selectionOpen} onOpenChange={setSelectionOpen} />
      <SelectionFab count={selectionCount} onClick={() => setSelectionOpen(true)} />

      {/* Manual candidate dialog */}
      <AddCandidateDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        sourceTag={config.sourceTag}
        sourceName={config.name}
      />
    </div>
  );
}

/* ----------------------------- Filters panel ----------------------------- */
function FiltersPanel({
  config,
  values,
  setField,
  resetFilters,
  activeCount,
  applyPreset,
  className,
}: {
  config: UrlSystemConfig;
  values: Record<string, any>;
  setField: (key: string, value: any) => void;
  resetFilters: () => void;
  activeCount: number;
  applyPreset: (v: Record<string, any>) => void;
  className?: string;
}) {
  return (
    <div className={className ?? "flex flex-col h-full"}>
      <div className="flex items-center justify-between px-1 pb-3 mb-1 border-b shrink-0">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">Фильтры</span>
          {activeCount > 0 && (
            <Badge variant="default" className="h-5 px-1.5 text-[10px]">
              {activeCount}
            </Badge>
          )}
        </div>
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={resetFilters}>
            <RotateCcw className="h-3 w-3 mr-1" />
            Сбросить
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 min-h-0 pr-3 -mr-1">
        <div className="space-y-5 pb-6">
          {/* Quick presets */}
          <div className="space-y-2">
            <SectionTitle icon={<Wand2 className="h-3.5 w-3.5" />}>Быстрые пресеты</SectionTitle>
            <div className="flex flex-col gap-1">
              {config.presets.slice(0, 5).map((p) => (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p.values)}
                  className="text-left rounded-lg border bg-card/60 px-2.5 py-1.5 text-xs hover:border-primary/50 hover:bg-accent transition-colors"
                >
                  <div className="font-medium truncate">{p.label}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{p.hint}</div>
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Dynamic fields */}
          {config.fields.map((f) => (
            <FieldRenderer
              key={f.key}
              field={f}
              value={values[f.key]}
              onChange={(v) => setField(f.key, v)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: FieldConfig;
  value: any;
  onChange: (v: any) => void;
}) {
  if (field.type === "boolean") {
    return (
      <div className="flex items-center justify-between gap-2 pt-1">
        <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
          {field.label}
        </Label>
        <Switch checked={!!value} onCheckedChange={onChange} className="scale-90" />
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div className="space-y-2">
        <SectionTitle icon={<Filter className="h-3.5 w-3.5" />}>{field.label}</SectionTitle>
        <Select
          value={value || "__any"}
          onValueChange={(v) => onChange(v === "__any" ? "" : v)}
        >
          <SelectTrigger className="h-8 text-sm">
            <SelectValue placeholder="Любой" />
          </SelectTrigger>
          <SelectContent>
            {(field.options || []).map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  // text / tags
  return (
    <div className="space-y-2">
      <SectionTitle icon={<Filter className="h-3.5 w-3.5" />}>{field.label}</SectionTitle>
      <Input
        placeholder={field.placeholder}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 text-sm"
      />
      {field.help && <p className="text-[10px] text-muted-foreground">{field.help}</p>}
    </div>
  );
}

/* ------------------------- Add candidate dialog ------------------------- */
function AddCandidateDialog({
  open,
  onOpenChange,
  sourceTag,
  sourceName,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  sourceTag: string;
  sourceName: string;
}) {
  const addCandidate = useSelectionStore((s) => s.addCandidate);
  const [name, setName] = React.useState("");
  const [position, setPosition] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [profileUrl, setProfileUrl] = React.useState("");
  const [note, setNote] = React.useState("");

  const reset = () => {
    setName("");
    setPosition("");
    setCompany("");
    setLocation("");
    setProfileUrl("");
    setNote("");
  };

  const handleAdd = () => {
    if (!name.trim() && !profileUrl.trim()) {
      toast.warning("Введите имя или ссылку на профиль");
      return;
    }
    const login = profileUrl.trim()
      ? `${sourceTag}_${profileUrl.trim().split("/").filter(Boolean).pop()}`
      : `${sourceTag}_${name.trim()}`;
    const candidate: Candidate = {
      login: login.slice(0, 60),
      id: Date.now(),
      avatar_url: "",
      html_url: profileUrl.trim() || "",
      type: "User",
      name: name.trim() || null,
      bio: null,
      company: company.trim() || null,
      blog: null,
      location: location.trim() || null,
      email: null,
      twitter_username: null,
      public_repos: undefined,
      followers: undefined,
      following: undefined,
      public_gists: undefined,
      created_at: undefined,
      updated_at: undefined,
      status: "new",
      note: note.trim(),
      tags: [sourceTag],
      position: position.trim(),
      addedAt: Date.now(),
      enriched: true,
    };
    addCandidate(candidate);
    toast.success(`Кандидат из ${sourceName} добавлен в выборку`);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-primary" />
            Добавить кандидата из {sourceName}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="cand-name">Имя</Label>
            <Input
              id="cand-name"
              placeholder="Иван Иванов"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="cand-pos">Должность</Label>
              <Input
                id="cand-pos"
                placeholder="Senior C++ Developer"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cand-comp">Компания</Label>
              <Input
                id="cand-comp"
                placeholder="Yandex"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cand-loc">Локация</Label>
            <Input
              id="cand-loc"
              placeholder="Moscow"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cand-url">Ссылка на профиль</Label>
            <Input
              id="cand-url"
              placeholder="https://..."
              value={profileUrl}
              onChange={(e) => setProfileUrl(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cand-note">Заметка</Label>
            <Textarea
              id="cand-note"
              placeholder="Комментарий рекрутера..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[60px] resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleAdd} className="gap-1.5">
            <Plus className="h-4 w-4" />
            Добавить в выборку
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------- Helpers ------------------------------- */
function getPlaceholder(systemId: UrlSystemId): string {
  switch (systemId) {
    case "cse":
      return 'Например: "Senior C++ Developer" site:linkedin.com/in';
    case "lor":
      return "Например: C++ разработчик, kernel driver";
    case "habr":
      return "Например: C++, Go, PostgreSQL, Rust";
    case "stackoverflow":
      return "Например: C, Linux, Go, kafka";
    case "hh":
      return "Например: C++ разработчик";
    case "superjob":
      return "Например: C++ разработчик, DBA";
    case "opennet":
      return "Например: C++, PostgreSQL, kernel";
    case "vc":
      return "Например: C++, Go, базы данных";
    case "habrqa":
      return "Например: C++, Go, PostgreSQL, Linux";
    case "ruso":
      return "Например: c, c++, go, postgresql";
    case "ubuntu":
      return "Например: C++, kernel, PostgreSQL";
    case "telegram":
      return "Например: C++ разработчик, golang, Rust";
  }
}

function getHint(systemId: UrlSystemId): string {
  switch (systemId) {
    case "cse":
      return "Ссылка откроет Google с операторами. Результаты откройте в браузере и добавляйте кандидатов в выборку кнопкой «Добавить».";
    case "lor":
      return "Поиск по темам и комментариям Linux.org.ru. Найденные профили добавляйте в выборку вручную.";
    case "habr":
      return "Резюме с Хабр.Карьеры или статьи на Хабре. Профили добавляйте в выборку вручную.";
    case "stackoverflow":
      return "Поиск пользователей StackOverflow по тегам и локации. Профили добавляйте в выборку вручную.";
    case "hh":
      return "Поиск резюме на hh.ru с фильтром по региону. Найденные резюме добавляйте в выборку вручную.";
    case "superjob":
      return "Поиск резюме на Superjob по городам РФ. Профили добавляйте в выборку вручную.";
    case "opennet":
      return "Поиск по opennet.ru — новости и обсуждения UNIX/Linux. Активных авторов добавляйте в выборку.";
    case "vc":
      return "Поиск статей на VC.ru. Авторов статей про системное ПО добавляйте в выборку.";
    case "habrqa":
      return "Поиск по Q&A Хабра. Экспerts, отвечающих на технические вопросы, добавляйте в выборку.";
    case "ruso":
      return "Поиск пользователей ru.stackoverflow.com по тегам. Топ по репутации добавляйте в выборку.";
    case "ubuntu":
      return "Поиск по форуму Ubuntu.ru. Активных участников обсуждений добавляйте в выборку.";
    case "telegram":
      return "X-ray поиск по Telegram через Google (site:t.me) или TG-агрегатор. Ниже — база из 15 профильных каналов. Кандидатов добавляйте в выборку вручную.";
  }
}
