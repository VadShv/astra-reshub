"use client";

import * as React from "react";
import {
  Linkedin,
  ArrowLeft,
  Search,
  ExternalLink,
  Filter,
  RotateCcw,
  Briefcase,
  MapPin,
  GraduationCap,
  Building2,
  Layers,
  Gauge,
  Wand2,
  Plus,
  ClipboardList,
  Sparkles,
  Copy,
  Check,
  UserPlus,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { useUIStore } from "@/components/github/ui-store";
import {
  SelectionPanel,
  SelectionFab,
} from "@/components/github/selection-panel";
import { useSelectionStore, Candidate } from "@/components/github/selection-store";
import {
  LinkedInFilters,
  EMPTY_LINKEDIN_FILTERS,
  buildLinkedInUrl,
  summarizeLinkedInFilters,
  countLinkedInFilters,
  LINKEDIN_PRESETS,
  LINKEDIN_LOCATIONS,
  LINKEDIN_SENIORITY,
  LINKEDIN_INDUSTRIES,
} from "@/lib/linkedin";

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

export function LinkedInApp() {
  const setApp = useUIStore((s) => s.setApp);
  const [filters, setFilters] = React.useState<LinkedInFilters>({ ...EMPTY_LINKEDIN_FILTERS });
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);
  const [selectionOpen, setSelectionOpen] = React.useState(false);
  const [addOpen, setAddOpen] = React.useState(false);
  const selectionCount = useSelectionStore((s) => s.candidates.length);

  const activeCount = countLinkedInFilters(filters);
  const linkedInUrl = buildLinkedInUrl(filters);
  const summary = summarizeLinkedInFilters(filters);

  const setField = <K extends keyof LinkedInFilters>(key: K, value: LinkedInFilters[K]) =>
    setFilters((f) => ({ ...f, [key]: value }));

  const applyPreset = (presetFilters: Partial<LinkedInFilters>) => {
    setFilters({ ...EMPTY_LINKEDIN_FILTERS, ...presetFilters });
    toast.success("Пресет применён");
  };

  const resetFilters = () => {
    setFilters({ ...EMPTY_LINKEDIN_FILTERS });
    toast.message("Фильтры сброшены");
  };

  const openLinkedIn = () => {
    if (activeCount === 0) {
      toast.warning("Задайте хотя бы один фильтр для поиска");
      return;
    }
    window.open(linkedInUrl, "_blank", "noopener,noreferrer");
    toast.success("Открываю поиск в LinkedIn", {
      description: "Войдите в LinkedIn, если ещё не вошли",
    });
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(linkedInUrl);
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
              title="К списку систем"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white group-hover:scale-105 transition-transform shadow-sm">
                <Linkedin className="h-5 w-5" />
              </div>
              <div className="hidden sm:block leading-none text-left">
                <span className="font-bold text-base tracking-tight">LinkedIn Search</span>
                <span className="block text-[10px] text-muted-foreground mt-0.5">
                  structured sourcing
                </span>
              </div>
            </button>

            <form
              className="flex-1 max-w-2xl flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                openLinkedIn();
              }}
            >
              <div className="relative flex-1 group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  type="text"
                  value={filters.keywords}
                  onChange={(e) => setField("keywords", e.target.value)}
                  placeholder='Например: Senior C++ Developer  ·  "Database Engineer"'
                  className="pl-10 pr-4 h-11 text-sm bg-background/60 border-border/60 rounded-full"
                />
              </div>
              <Button type="submit" className="h-11 px-5 gap-2 rounded-full shadow-sm shrink-0">
                <ExternalLink className="h-4 w-4" />
                <span className="hidden sm:inline">В LinkedIn</span>
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
                className="h-9 gap-1.5 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 hover:opacity-90"
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
                <LinkedInFiltersPanel
                  filters={filters}
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
                  onClick={openLinkedIn}
                  disabled={activeCount === 0}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Открыть в LinkedIn
                </Button>
              </div>

              {/* URL preview card */}
              <Card className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Linkedin className="h-4 w-4 text-sky-600" />
                  <h3 className="text-sm font-semibold">Ссылка на LinkedIn-поиск</h3>
                  {activeCount > 0 && (
                    <Badge className="ml-auto text-[10px]">{activeCount} фильтр(ов)</Badge>
                  )}
                </div>
                <div className="rounded-lg bg-muted/50 border p-3 font-mono text-xs break-all leading-relaxed text-muted-foreground max-h-32 overflow-y-auto scrollbar-thin">
                  {linkedInUrl}
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Button onClick={openLinkedIn} disabled={activeCount === 0} className="gap-1.5">
                    <ExternalLink className="h-4 w-4" />
                    Открыть поиск в LinkedIn
                  </Button>
                  <Button variant="outline" onClick={copyUrl} disabled={activeCount === 0} className="gap-1.5">
                    <Copy className="h-4 w-4" />
                    Копировать ссылку
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
                  Ссылка откроет LinkedIn People Search с вашими фильтрами. Войдите в
                  LinkedIn в браузере — результаты подгрузятся автоматически. Найденных
                  кандидатов добавляйте в выборку кнопкой «Добавить».
                </p>
              </Card>

              {/* Presets */}
              <Card className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Wand2 className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold">Готовые пресеты</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {LINKEDIN_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => applyPreset(p.filters)}
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
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 shrink-0">
                    <UserPlus className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold mb-1">Ручное добавление кандидатов</h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      LinkedIn не отдаёт результаты через API. Найдите кандидата в
                      LinkedIn и добавьте его в выборку вручную — имя, должность, компания,
                      ссылка на профиль. Экспорт в ХАНТ общий с GitFind.
                    </p>
                    <Button size="sm" variant="outline" onClick={() => setAddOpen(true)} className="gap-1.5">
                      <Plus className="h-3.5 w-3.5" />
                      Добавить кандидата
                    </Button>
                  </div>
                </div>
              </Card>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t bg-card/40">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>
              <span className="font-semibold text-foreground">LinkedIn Search</span> — структурный
              билдер LinkedIn-запросов для рекрутера
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
              Фильтры LinkedIn
            </SheetTitle>
          </SheetHeader>
          <div className="p-4">
            <LinkedInFiltersPanel
              filters={filters}
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
                openLinkedIn();
              }}
            >
              Открыть в LinkedIn
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Selection panel (shared with GitFind) */}
      <SelectionPanel open={selectionOpen} onOpenChange={setSelectionOpen} />
      <SelectionFab count={selectionCount} onClick={() => setSelectionOpen(true)} />

      {/* Manual candidate dialog */}
      <AddCandidateDialog open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}

/* ----------------------------- Filters panel ----------------------------- */
function LinkedInFiltersPanel({
  filters,
  setField,
  resetFilters,
  activeCount,
  applyPreset,
  className,
}: {
  filters: LinkedInFilters;
  setField: <K extends keyof LinkedInFilters>(key: K, value: LinkedInFilters[K]) => void;
  resetFilters: () => void;
  activeCount: number;
  applyPreset: (f: Partial<LinkedInFilters>) => void;
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
              {LINKEDIN_PRESETS.slice(0, 5).map((p) => (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p.filters)}
                  className="text-left rounded-lg border bg-card/60 px-2.5 py-1.5 text-xs hover:border-primary/50 hover:bg-accent transition-colors"
                >
                  <div className="font-medium truncate">{p.label}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{p.hint}</div>
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Keywords */}
          <div className="space-y-2">
            <SectionTitle icon={<Search className="h-3.5 w-3.5" />}>Ключевые слова</SectionTitle>
            <Input
              placeholder="должность, фраза"
              value={filters.keywords}
              onChange={(e) => setField("keywords", e.target.value)}
              className="h-8 text-sm"
            />
          </div>

          {/* Seniority */}
          <div className="space-y-2">
            <SectionTitle icon={<Gauge className="h-3.5 w-3.5" />}>Грейд</SectionTitle>
            <Select
              value={filters.seniority || "__any"}
              onValueChange={(v) => setField("seniority", v === "__any" ? "" : v)}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Любой" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__any">Любой</SelectItem>
                {LINKEDIN_SENIORITY.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <SectionTitle icon={<Layers className="h-3.5 w-3.5" />}>Навыки (через запятую)</SectionTitle>
            <Input
              placeholder="Linux, PostgreSQL, Go"
              value={filters.skills}
              onChange={(e) => setField("skills", e.target.value)}
              className="h-8 text-sm"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <SectionTitle icon={<MapPin className="h-3.5 w-3.5" />}>Локация</SectionTitle>
            <Select
              value={filters.location || "__any"}
              onValueChange={(v) => setField("location", v === "__any" ? "" : v)}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Любая" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__any">Любая</SelectItem>
                {LINKEDIN_LOCATIONS.map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Current company */}
          <div className="space-y-2">
            <SectionTitle icon={<Building2 className="h-3.5 w-3.5" />}>Текущая компания</SectionTitle>
            <Input
              placeholder="например, Yandex"
              value={filters.currentCompany}
              onChange={(e) => setField("currentCompany", e.target.value)}
              className="h-8 text-sm"
            />
          </div>

          {/* Past company */}
          <div className="space-y-2">
            <SectionTitle icon={<Briefcase className="h-3.5 w-3.5" />}>Прошлая компания</SectionTitle>
            <Input
              placeholder="например, Google"
              value={filters.pastCompany}
              onChange={(e) => setField("pastCompany", e.target.value)}
              className="h-8 text-sm"
            />
          </div>

          {/* School */}
          <div className="space-y-2">
            <SectionTitle icon={<GraduationCap className="h-3.5 w-3.5" />}>ВУЗ</SectionTitle>
            <Input
              placeholder="например, MIPT"
              value={filters.school}
              onChange={(e) => setField("school", e.target.value)}
              className="h-8 text-sm"
            />
          </div>

          {/* Industry */}
          <div className="space-y-2">
            <SectionTitle icon={<Building2 className="h-3.5 w-3.5" />}>Отрасль</SectionTitle>
            <Select
              value={filters.industry || "__any"}
              onValueChange={(v) => setField("industry", v === "__any" ? "" : v)}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Любая" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__any">Любая</SelectItem>
                {LINKEDIN_INDUSTRIES.map((i) => (
                  <SelectItem key={i} value={i}>{i}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Open to work */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
              Open to work
            </Label>
            <Switch
              checked={filters.openToWork}
              onCheckedChange={(v) => setField("openToWork", v)}
              className="scale-90"
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

/* ------------------------- Add candidate dialog ------------------------- */
function AddCandidateDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
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
      ? profileUrl.trim().split("/").filter(Boolean).pop() || name || "unknown"
      : name.trim();
    const candidate: Candidate = {
      login: `li_${login}`.slice(0, 60),
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
      tags: ["linkedin"],
      position: position.trim(),
      addedAt: Date.now(),
      enriched: true,
    };
    addCandidate(candidate);
    toast.success("Кандидат добавлен в выборку");
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Linkedin className="h-4 w-4 text-sky-600" />
            Добавить кандидата из LinkedIn
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="li-name">Имя</Label>
            <Input
              id="li-name"
              placeholder="Иван Иванов"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="li-pos">Должность</Label>
              <Input
                id="li-pos"
                placeholder="Senior C++ Developer"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="li-comp">Компания</Label>
              <Input
                id="li-comp"
                placeholder="Yandex"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="li-loc">Локация</Label>
            <Input
              id="li-loc"
              placeholder="Moscow"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="li-url">Ссылка на профиль LinkedIn</Label>
            <Input
              id="li-url"
              placeholder="https://www.linkedin.com/in/..."
              value={profileUrl}
              onChange={(e) => setProfileUrl(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="li-note">Заметка</Label>
            <Textarea
              id="li-note"
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
