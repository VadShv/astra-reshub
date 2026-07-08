"use client";

import * as React from "react";
import {
  Filter,
  RotateCcw,
  Star,
  GitFork,
  HardDrive,
  Calendar,
  Scale,
  Tag,
  MapPin,
  Users,
  BookOpen,
  Building2,
  GitBranch,
  CheckCircle2,
  FolderGit2,
  FileCode,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  getLicenses,
  getSortOptions,
  POPULAR_LANGUAGES,
  SearchType,
} from "@/lib/github";
import { useSearchStore } from "./store";

interface FilterPanelProps {
  className?: string;
  onAfterChange?: () => void;
}

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

function RangeInput({
  minKey,
  maxKey,
  placeholderMin,
  placeholderMax,
}: {
  minKey: any;
  maxKey: any;
  placeholderMin: string;
  placeholderMax: string;
}) {
  const { filters, setFilter } = useSearchStore();
  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        min={0}
        placeholder={placeholderMin}
        value={(filters as any)[minKey] || ""}
        onChange={(e) => setFilter(minKey, e.target.value || undefined)}
        className="h-8 text-sm"
      />
      <span className="text-muted-foreground text-xs">—</span>
      <Input
        type="number"
        min={0}
        placeholder={placeholderMax}
        value={(filters as any)[maxKey] || ""}
        onChange={(e) => setFilter(maxKey, e.target.value || undefined)}
        className="h-8 text-sm"
      />
    </div>
  );
}

function DateRange({
  afterKey,
  beforeKey,
}: {
  afterKey: any;
  beforeKey: any;
}) {
  const { filters, setFilter } = useSearchStore();
  return (
    <div className="flex items-center gap-2">
      <Input
        type="date"
        value={(filters as any)[afterKey] || ""}
        onChange={(e) => setFilter(afterKey, e.target.value || undefined)}
        className="h-8 text-sm"
      />
      <span className="text-muted-foreground text-xs">—</span>
      <Input
        type="date"
        value={(filters as any)[beforeKey] || ""}
        onChange={(e) => setFilter(beforeKey, e.target.value || undefined)}
        className="h-8 text-sm"
      />
    </div>
  );
}

export function FilterPanel({ className, onAfterChange }: FilterPanelProps) {
  const { type, filters, setFilter, setFilters, resetFilters } = useSearchStore();
  const sortOptions = getSortOptions(type);

  const activeCount = React.useMemo(() => {
    const keys = [
      "language", "starsMin", "starsMax", "forksMin", "forksMax",
      "sizeMin", "sizeMax", "createdAfter", "createdBefore",
      "pushedAfter", "pushedBefore", "license", "topics",
      "repoUser", "org", "isFork", "isArchived", "hasIssues",
      "hasTopics", "hasWiki", "hasOpenIssues", "state",
      "userLocation", "followersMinUser", "reposMin",
    ] as const;
    return keys.filter((k) => {
      const v = (filters as any)[k];
      return v !== undefined && v !== "" && v !== null;
    }).length;
  }, [filters]);

  const handleChange = <K extends keyof typeof filters>(key: K, value: any) => {
    setFilter(key as any, value);
    onAfterChange?.();
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between px-1 mb-3">
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
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => {
              resetFilters();
              onAfterChange?.();
            }}
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Сбросить
          </Button>
        )}
      </div>

      <ScrollArea className="h-[calc(100vh-13rem)] pr-3">
        <div className="space-y-5 pb-6">
          {/* Sort & order — applies to all types */}
          <div className="space-y-3">
            <SectionTitle icon={<Filter className="h-3.5 w-3.5" />}>
              Сортировка
            </SectionTitle>
            <div className="grid grid-cols-2 gap-2">
              <Select
                value={(filters.sort as string) || "best-match"}
                onValueChange={(v) => handleChange("sort" as any, v)}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={(filters.order as string) || "desc"}
                onValueChange={(v) => handleChange("order" as any, v)}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">По убыванию</SelectItem>
                  <SelectItem value="asc">По возрастанию</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Common: language (repos, code, issues), topics, user/org (repos) */}
          {(type === "repositories" || type === "code" || type === "issues") && (
            <div className="space-y-2">
              <SectionTitle icon={<FileCode className="h-3.5 w-3.5" />}>Язык</SectionTitle>
              <Select
                value={(filters.language as string) || "__any"}
                onValueChange={(v) =>
                  handleChange("language" as any, v === "__any" ? undefined : v)
                }
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Любой язык" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__any">Любой язык</SelectItem>
                  {POPULAR_LANGUAGES.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {type === "repositories" && (
            <>
              <div className="space-y-2">
                <SectionTitle icon={<Star className="h-3.5 w-3.5" />}>
                  Звёзды
                </SectionTitle>
                <RangeInput
                  minKey="starsMin"
                  maxKey="starsMax"
                  placeholderMin="от"
                  placeholderMax="до"
                />
              </div>

              <div className="space-y-2">
                <SectionTitle icon={<GitFork className="h-3.5 w-3.5" />}>
                  Форки
                </SectionTitle>
                <RangeInput
                  minKey="forksMin"
                  maxKey="forksMax"
                  placeholderMin="от"
                  placeholderMax="до"
                />
              </div>

              <div className="space-y-2">
                <SectionTitle icon={<HardDrive className="h-3.5 w-3.5" />}>
                  Размер (КБ)
                </SectionTitle>
                <RangeInput
                  minKey="sizeMin"
                  maxKey="sizeMax"
                  placeholderMin="от"
                  placeholderMax="до"
                />
              </div>

              <div className="space-y-2">
                <SectionTitle icon={<Calendar className="h-3.5 w-3.5" />}>
                  Создан
                </SectionTitle>
                <DateRange afterKey="createdAfter" beforeKey="createdBefore" />
              </div>

              <div className="space-y-2">
                <SectionTitle icon={<Calendar className="h-3.5 w-3.5" />}>
                  Обновлён (push)
                </SectionTitle>
                <DateRange afterKey="pushedAfter" beforeKey="pushedBefore" />
              </div>

              <div className="space-y-2">
                <SectionTitle icon={<Scale className="h-3.5 w-3.5" />}>
                  Лицензия
                </SectionTitle>
                <Select
                  value={(filters.license as string) || "__any"}
                  onValueChange={(v) =>
                    handleChange("license" as any, v === "__any" ? undefined : v)
                  }
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Любая" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__any">Любая</SelectItem>
                    {getLicenses().map((l) => (
                      <SelectItem key={l.key} value={l.key}>
                        {l.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <SectionTitle icon={<Tag className="h-3.5 w-3.5" />}>
                  Темы (через пробел)
                </SectionTitle>
                <Input
                  placeholder="react ui dashboard"
                  value={(filters.topics as string) || ""}
                  onChange={(e) => handleChange("topics" as any, e.target.value || undefined)}
                  className="h-8 text-sm"
                />
              </div>

              <div className="space-y-2">
                <SectionTitle icon={<Users className="h-3.5 w-3.5" />}>
                  Владелец (user)
                </SectionTitle>
                <Input
                  placeholder="например, facebook"
                  value={(filters.repoUser as string) || ""}
                  onChange={(e) => handleChange("repoUser" as any, e.target.value || undefined)}
                  className="h-8 text-sm"
                />
              </div>

              <div className="space-y-2">
                <SectionTitle icon={<Building2 className="h-3.5 w-3.5" />}>
                  Организация
                </SectionTitle>
                <Input
                  placeholder="например, vercel"
                  value={(filters.org as string) || ""}
                  onChange={(e) => handleChange("org" as any, e.target.value || undefined)}
                  className="h-8 text-sm"
                />
              </div>

              <div className="space-y-3">
                <SectionTitle icon={<CheckCircle2 className="h-3.5 w-3.5" />}>
                  Состояние
                </SectionTitle>
                <div className="space-y-2.5">
                  <SelectRow
                    label="Форки"
                    icon={<GitBranch className="h-3.5 w-3.5" />}
                    value={(filters.isFork as string) || "__any"}
                    onChange={(v) =>
                      handleChange("isFork" as any, v === "__any" ? undefined : v)
                    }
                    options={[
                      { value: "__any", label: "Все" },
                      { value: "false", label: "Без форков" },
                      { value: "true", label: "Вкл. форки" },
                      { value: "only", label: "Только форки" },
                    ]}
                  />
                  <SelectRow
                    label="Архив"
                    icon={<FolderGit2 className="h-3.5 w-3.5" />}
                    value={(filters.isArchived as string) || "__any"}
                    onChange={(v) =>
                      handleChange("isArchived" as any, v === "__any" ? undefined : v)
                    }
                    options={[
                      { value: "__any", label: "Все" },
                      { value: "false", label: "Не архив" },
                      { value: "true", label: "Архивные" },
                    ]}
                  />
                </div>
                <div className="space-y-2">
                  <ToggleRow
                    label="Есть issues"
                    checked={!!filters.hasIssues}
                    onChange={(v) => handleChange("hasIssues" as any, v || undefined)}
                  />
                  <ToggleRow
                    label="Есть темы"
                    checked={!!filters.hasTopics}
                    onChange={(v) => handleChange("hasTopics" as any, v || undefined)}
                  />
                  <ToggleRow
                    label="Есть wiki"
                    checked={!!filters.hasWiki}
                    onChange={(v) => handleChange("hasWiki" as any, v || undefined)}
                  />
                  <ToggleRow
                    label="Есть открытые issues"
                    checked={!!filters.hasOpenIssues}
                    onChange={(v) => handleChange("hasOpenIssues" as any, v || undefined)}
                  />
                </div>
              </div>
            </>
          )}

          {type === "users" && (
            <>
              <div className="space-y-2">
                <SectionTitle icon={<MapPin className="h-3.5 w-3.5" />}>
                  Локация
                </SectionTitle>
                <Input
                  placeholder="например, Moscow"
                  value={(filters.userLocation as string) || ""}
                  onChange={(e) =>
                    handleChange("userLocation" as any, e.target.value || undefined)
                  }
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-2">
                <SectionTitle icon={<Users className="h-3.5 w-3.5" />}>
                  Подписчиков от
                </SectionTitle>
                <Input
                  type="number"
                  min={0}
                  placeholder="напр., 1000"
                  value={(filters.followersMinUser as string) || ""}
                  onChange={(e) =>
                    handleChange("followersMinUser" as any, e.target.value || undefined)
                  }
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-2">
                <SectionTitle icon={<BookOpen className="h-3.5 w-3.5" />}>
                  Репозиториев от
                </SectionTitle>
                <Input
                  type="number"
                  min={0}
                  placeholder="напр., 10"
                  value={(filters.reposMin as string) || ""}
                  onChange={(e) =>
                    handleChange("reposMin" as any, e.target.value || undefined)
                  }
                  className="h-8 text-sm"
                />
              </div>
            </>
          )}

          {type === "issues" && (
            <div className="space-y-2">
              <SectionTitle icon={<CheckCircle2 className="h-3.5 w-3.5" />}>
                Состояние issue
              </SectionTitle>
              <Select
                value={(filters.state as string) || "__any"}
                onValueChange={(v) =>
                  handleChange("state" as any, v === "__any" ? undefined : v)
                }
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Любое" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__any">Любое</SelectItem>
                  <SelectItem value="open">Открытые</SelectItem>
                  <SelectItem value="closed">Закрытые</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {type === "code" && (
            <div className="space-y-2">
              <SectionTitle icon={<Users className="h-3.5 w-3.5" />}>
                Пользователь/орг
              </SectionTitle>
              <Input
                placeholder="например, torvalds"
                value={(filters.repoUser as string) || ""}
                onChange={(e) => handleChange("repoUser" as any, e.target.value || undefined)}
                className="h-8 text-sm"
              />
              <p className="text-[11px] text-muted-foreground">
                Также поддерживаются квалифайеры <code>path:</code>,{" "}
                <code>extension:</code>, <code>filename:</code> прямо в строке поиска.
              </p>
            </div>
          )}

          {(type === "commits") && (
            <div className="space-y-2">
              <SectionTitle icon={<Users className="h-3.5 w-3.5" />}>
                Автор коммита
              </SectionTitle>
              <Input
                placeholder="например, octocat"
                value={(filters.repoUser as string) || ""}
                onChange={(e) => handleChange("repoUser" as any, e.target.value || undefined)}
                className="h-8 text-sm"
              />
              <p className="text-[11px] text-muted-foreground">
                Поддерживаются <code>author:</code>, <code>committer:</code>,{" "}
                <code>author-date:</code> в строке поиска.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function SelectRow({
  label,
  icon,
  value,
  onChange,
  options,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <Label className="text-xs flex items-center gap-1.5 text-muted-foreground">
        <span className="text-primary">{icon}</span>
        {label}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-7 w-32 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Switch checked={checked} onCheckedChange={onChange} className="scale-90" />
    </div>
  );
}


