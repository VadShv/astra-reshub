"use client";

import * as React from "react";
import Link from "next/link";
import {
  Star,
  GitFork,
  Eye,
  Scale,
  Archive,
  AlertCircle,
  FileCode,
  GitCommit,
  Calendar,
  User as UserIcon,
  UserPlus,
  Check,
  Loader2,
  Hash,
  MessageSquare,
  ThumbsUp,
  ExternalLink,
  Tag,
  BookOpen,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatNumber, languageColor, timeAgo } from "@/lib/github";
import { cn } from "@/lib/utils";
import { useSelectionActions } from "./use-selection";

/* ----------------------------- Repository card ---------------------------- */
export function RepoCard({ item }: { item: any }) {
  const topics: string[] = item.topics || [];
  const license = item.license?.spdx_id && item.license.spdx_id !== "NOASSERTION"
    ? item.license.spdx_id
    : null;

  return (
    <Card className="group relative overflow-hidden p-4 sm:p-5 transition-all hover:shadow-md hover:border-primary/40">
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Avatar className="h-5 w-5 rounded">
                <AvatarImage src={item.owner?.avatar_url} alt={item.owner?.login} />
                <AvatarFallback className="text-[10px] rounded">
                  {item.owner?.login?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Link
                href={item.owner?.html_url || "#"}
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary truncate"
              >
                {item.owner?.login}
              </Link>
              <span className="text-muted-foreground/50">/</span>
              <Link
                href={item.html_url}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-foreground hover:text-primary truncate"
              >
                {item.name}
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {item.archived && (
              <Badge variant="secondary" className="gap-1">
                <Archive className="h-3 w-3" /> Архив
              </Badge>
            )}
            {item.disabled && (
              <Badge variant="destructive" className="gap-1">
                <AlertCircle className="h-3 w-3" /> Отключён
              </Badge>
            )}
            {item.fork && (
              <Badge variant="outline" className="gap-1">
                <GitFork className="h-3 w-3" /> Fork
              </Badge>
            )}
          </div>
        </div>

        {item.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.description}
          </p>
        )}

        {topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {topics.slice(0, 6).map((t) => (
              <Badge key={t} variant="secondary" className="font-mono text-[11px]">
                {t}
              </Badge>
            ))}
            {topics.length > 6 && (
              <span className="text-xs text-muted-foreground">
                +{topics.length - 6}
              </span>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          {item.language && (
            <span className="flex items-center gap-1.5">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: languageColor(item.language) }}
              />
              {item.language}
            </span>
          )}
          <Stat icon={<Star className="h-3.5 w-3.5" />} value={item.stargazers_count} />
          <Stat icon={<GitFork className="h-3.5 w-3.5" />} value={item.forks_count} />
          <Stat icon={<Eye className="h-3.5 w-3.5" />} value={item.watchers_count} />
          {item.open_issues_count > 0 && (
            <Stat
              icon={<AlertCircle className="h-3.5 w-3.5" />}
              value={item.open_issues_count}
            />
          )}
          {license && (
            <span className="flex items-center gap-1">
              <Scale className="h-3.5 w-3.5" />
              {license}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            обновлён {timeAgo(item.pushed_at || item.updated_at)}
          </span>
        </div>

        {item.homepage && (
          <Link
            href={item.homepage}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline w-fit"
          >
            <ExternalLink className="h-3 w-3" />
            {item.homepage.replace(/^https?:\/\//, "").replace(/\/$/, "")}
          </Link>
        )}
      </div>
    </Card>
  );
}

function Stat({ icon, value }: { icon: React.ReactNode; value: number }) {
  return (
    <span className="flex items-center gap-1">
      {icon}
      {formatNumber(value || 0)}
    </span>
  );
}

/* -------------------------------- User card ------------------------------- */
export function UserCard({ item }: { item: any }) {
  const { addToSelection, removeFromSelection, hasCandidate, loadingLogin } =
    useSelectionActions();
  const login = item.login;
  const selected = hasCandidate(login);
  const loading = loadingLogin === login;

  return (
    <Card className="group p-4 transition-all hover:shadow-md hover:border-primary/40">
      <div className="flex items-start gap-3">
        <Avatar className="h-12 w-12 rounded-lg border shrink-0">
          <AvatarImage src={item.avatar_url} alt={item.login} />
          <AvatarFallback className="rounded-lg">
            {item.login?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Link
                href={item.html_url}
                target="_blank"
                rel="noreferrer"
                className="font-semibold hover:text-primary truncate"
              >
                {item.login}
              </Link>
              {item.type && (
                <Badge variant="outline" className="text-[10px] py-0 shrink-0">
                  {item.type}
                </Badge>
              )}
              {item.site_admin && (
                <Badge variant="destructive" className="text-[10px] py-0 shrink-0">
                  Staff
                </Badge>
              )}
              {selected && (
                <Badge className="text-[10px] py-0 shrink-0 gap-1 bg-emerald-600 hover:bg-emerald-600">
                  <Check className="h-2.5 w-2.5" />
                  В выборке
                </Badge>
              )}
            </div>
            <Button
              size="sm"
              variant={selected ? "secondary" : "outline"}
              className="h-7 shrink-0 gap-1 text-xs"
              disabled={loading}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (selected) removeFromSelection(login);
                else addToSelection(item);
              }}
              title={selected ? "Убрать из выборки" : "Добавить в выборку для ХАНТ"}
            >
              {loading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : selected ? (
                <Check className="h-3 w-3" />
              ) : (
                <UserPlus className="h-3 w-3" />
              )}
              <span className="hidden sm:inline">
                {selected ? "В выборке" : "В выборку"}
              </span>
            </Button>
          </div>
          {item.name && (
            <p className="text-sm text-muted-foreground truncate">{item.name}</p>
          )}
          {item.bio && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {item.bio}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-2">
            {item.followers !== undefined && (
              <span className="flex items-center gap-1">
                <UserIcon className="h-3.5 w-3.5" />
                {formatNumber(item.followers)} подписчиков
              </span>
            )}
            {item.public_repos !== undefined && (
              <span className="flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5" />
                {formatNumber(item.public_repos)} репо
              </span>
            )}
            {item.location && (
              <span className="flex items-center gap-1">
                <Tag className="h-3.5 w-3.5" />
                {item.location}
              </span>
            )}
            {item.created_at && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                с {new Date(item.created_at).getFullYear()}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

/* -------------------------------- Code card ------------------------------- */
export function CodeCard({ item }: { item: any }) {
  const repo = item.repository;
  const matches: any[] = item.text_matches || [];
  return (
    <Card className="group p-4 transition-all hover:shadow-md hover:border-primary/40">
      <div className="flex items-center gap-2 text-sm mb-2">
        <FileCode className="h-4 w-4 text-muted-foreground shrink-0" />
        {repo && (
          <>
            <Avatar className="h-4 w-4 rounded">
              <AvatarImage src={repo.owner?.avatar_url} alt={repo.owner?.login} />
              <AvatarFallback className="text-[9px] rounded">
                {repo.owner?.login?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Link
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-primary truncate"
            >
              {repo.full_name}
            </Link>
            <span className="text-muted-foreground/50">/</span>
          </>
        )}
        <Link
          href={item.html_url}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-sm font-medium hover:text-primary truncate"
        >
          {item.path}
        </Link>
      </div>
      {matches.length > 0 && (
        <div className="mt-2 space-y-2">
          {matches.slice(0, 2).map((m, i) => (
            <pre
              key={i}
              className="text-xs bg-muted/60 dark:bg-black/30 rounded-md p-2.5 overflow-x-auto font-mono leading-relaxed"
            >
              <code>
                <HighlightedText text={m.fragment} matches={m.matches} />
              </code>
            </pre>
          ))}
        </div>
      )}
    </Card>
  );
}

function HighlightedText({ text, matches }: { text: string; matches?: any[] }) {
  if (!matches || matches.length === 0) return <>{text}</>;
  // Build a list of [start,end] ranges from matches and highlight.
  const ranges: [number, number][] = matches
    .map((mm) => [mm.indices?.[0]?.[0], mm.indices?.[0]?.[1]] as [number, number])
    .filter((r) => typeof r[0] === "number" && typeof r[1] === "number");

  if (ranges.length === 0) return <>{text}</>;

  ranges.sort((a, b) => a[0] - b[0]);
  const parts: React.ReactNode[] = [];
  let cursor = 0;
  for (const [s, e] of ranges) {
    if (s > cursor) parts.push(<span key={`t-${cursor}`}>{text.slice(cursor, s)}</span>);
    parts.push(
      <mark key={`m-${s}`} className="bg-yellow-200 dark:bg-yellow-500/40 text-foreground rounded px-0.5">
        {text.slice(s, e + 1)}
      </mark>
    );
    cursor = e + 1;
  }
  if (cursor < text.length) parts.push(<span key={`t-end`}>{text.slice(cursor)}</span>);
  return <>{parts}</>;
}

/* ------------------------------- Issue card ------------------------------- */
export function IssueCard({ item }: { item: any }) {
  const repoFullName = item.repository_url?.replace(
    "https://api.github.com/repos/",
    ""
  );
  const isOpen = item.state === "open";
  return (
    <Card className="group p-4 transition-all hover:shadow-md hover:border-primary/40">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "mt-0.5 flex h-6 w-6 items-center justify-center rounded-full shrink-0",
            isOpen
              ? "bg-emerald-500/15 text-emerald-500"
              : "bg-rose-500/15 text-rose-500"
          )}
        >
          <AlertCircle className="h-3.5 w-3.5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2 flex-wrap">
            <Link
              href={item.html_url}
              target="_blank"
              rel="noreferrer"
              className="font-medium hover:text-primary"
            >
              {item.title}
            </Link>
            <span className="font-mono text-xs text-muted-foreground">
              {repoFullName}#{item.number}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            <Badge
              variant={isOpen ? "default" : "secondary"}
              className={cn(
                "text-[10px] py-0",
                isOpen && "bg-emerald-600 hover:bg-emerald-600 text-white"
              )}
            >
              {isOpen ? "open" : "closed"}
            </Badge>
            {item.labels?.slice(0, 4).map((l: any) => (
              <Badge
                key={l.name}
                variant="outline"
                className="text-[10px] py-0"
                style={{
                  borderColor: `#${l.color}`,
                  color: `#${l.color}`,
                }}
              >
                {l.name}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-2">
            {item.user && (
              <span className="flex items-center gap-1">
                <Avatar className="h-3.5 w-3.5 rounded">
                  <AvatarImage src={item.user.avatar_url} alt={item.user.login} />
                  <AvatarFallback className="text-[8px] rounded">
                    {item.user.login?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {item.user.login}
              </span>
            )}
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              {formatNumber(item.comments || 0)}
            </span>
            {item.reactions && (
              <span className="flex items-center gap-1">
                <ThumbsUp className="h-3.5 w-3.5" />
                {formatNumber(item.reactions.total_count || 0)}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {timeAgo(item.updated_at)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------- Commit card ------------------------------ */
export function CommitCard({ item }: { item: any }) {
  const message = item.commit?.message || "";
  const [subject, ...rest] = message.split("\n");
  const repo = item.repository;
  const author = item.author || item.commit?.author;
  return (
    <Card className="group p-4 transition-all hover:shadow-md hover:border-primary/40">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-primary shrink-0">
          <GitCommit className="h-3.5 w-3.5" />
        </div>
        <div className="min-w-0 flex-1">
          <Link
            href={item.html_url}
            target="_blank"
            rel="noreferrer"
            className="font-medium hover:text-primary line-clamp-2"
          >
            {subject}
          </Link>
          {rest.length > 0 && rest.join("\n").trim() && (
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
              {rest.join("\n").trim()}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-2">
            {author?.login ? (
              <span className="flex items-center gap-1">
                <Avatar className="h-3.5 w-3.5 rounded">
                  <AvatarImage src={author.avatar_url} alt={author.login} />
                  <AvatarFallback className="text-[8px] rounded">
                    {author.login?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {author.login}
              </span>
            ) : (
              item.commit?.author?.name && (
                <span className="flex items-center gap-1">
                  <UserIcon className="h-3.5 w-3.5" />
                  {item.commit.author.name}
                </span>
              )
            )}
            <span className="flex items-center gap-1 font-mono">
              <Hash className="h-3.5 w-3.5" />
              {item.sha?.slice(0, 7)}
            </span>
            {repo && (
              <span className="truncate">{repo.full_name}</span>
            )}
            {item.commit?.author?.date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {timeAgo(item.commit.author.date)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------- Topic card ------------------------------- */
export function TopicCard({ item }: { item: any }) {
  return (
    <Card className="group p-4 transition-all hover:shadow-md hover:border-primary/40 h-full">
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`https://github.com/topics/${item.name}`}
          target="_blank"
          rel="noreferrer"
          className="font-semibold hover:text-primary"
        >
          {item.display_name || item.name}
        </Link>
        <div className="flex items-center gap-1.5">
          {item.featured && (
            <Badge variant="default" className="text-[10px] py-0">Featured</Badge>
          )}
          {item.curated && (
            <Badge variant="secondary" className="text-[10px] py-0">Curated</Badge>
          )}
        </div>
      </div>
      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
        {item.short_description || item.description || "Без описания"}
      </p>
      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
        <span className="flex items-center gap-1">
          <BookOpen className="h-3.5 w-3.5" />
          {formatNumber(item.repository_count || 0)} репо
        </span>
        <span className="font-mono">#{item.name}</span>
      </div>
    </Card>
  );
}
