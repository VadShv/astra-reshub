"use client";

import * as React from "react";
import { SearchX, AlertTriangle, ServerCrash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  RepoCard,
  UserCard,
  CodeCard,
  IssueCard,
  CommitCard,
  TopicCard,
} from "./cards";
import { SearchType } from "@/lib/github";

export interface SearchResult {
  total_count: number;
  incomplete_results: boolean;
  items: any[];
  rateLimit?: { remaining: number; limit: number; reset: number };
  query?: string;
  error?: string;
  rateLimited?: boolean;
}

function CardByType({ type, item }: { type: SearchType; item: any }) {
  switch (type) {
    case "repositories":
      return <RepoCard item={item} />;
    case "users":
      return <UserCard item={item} />;
    case "code":
      return <CodeCard item={item} />;
    case "issues":
      return <IssueCard item={item} />;
    case "commits":
      return <CommitCard item={item} />;
    case "topics":
      return <TopicCard item={item} />;
    default:
      return null;
  }
}

function SkeletonCard({ type }: { type: SearchType }) {
  if (type === "users") {
    return (
      <Card className="p-4">
        <div className="flex items-start gap-3">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      </Card>
    );
  }
  if (type === "topics") {
    return (
      <Card className="p-4">
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-3 w-full mb-1" />
        <Skeleton className="h-3 w-2/3" />
      </Card>
    );
  }
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-3">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-4 w-40" />
      </div>
      <Skeleton className="h-3 w-full mb-1.5" />
      <Skeleton className="h-3 w-3/4 mb-3" />
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <div className="flex gap-4 mt-3">
        <Skeleton className="h-3 w-14" />
        <Skeleton className="h-3 w-14" />
        <Skeleton className="h-3 w-14" />
      </div>
    </Card>
  );
}

interface ResultsListProps {
  type: SearchType;
  loading: boolean;
  result: SearchResult | null;
  error: string | null;
  page: number;
  perPage: number;
  onPageChange: (p: number) => void;
  onRetry: () => void;
}

export function ResultsList({
  type,
  loading,
  result,
  error,
  page,
  perPage,
  onPageChange,
  onRetry,
}: ResultsListProps) {
  if (loading) {
    return (
      <div className={type === "topics" ? "grid gap-3 sm:grid-cols-2 lg:grid-cols-3" : "space-y-3"}>
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} type={type} />
        ))}
      </div>
    );
  }

  if (error) {
    const isRateLimited = error.toLowerCase().includes("лимит") || error.toLowerCase().includes("rate");
    return (
      <Card className="p-10 text-center flex flex-col items-center gap-3 border-dashed">
        {isRateLimited ? (
          <AlertTriangle className="h-10 w-10 text-amber-500" />
        ) : (
          <ServerCrash className="h-10 w-10 text-rose-500" />
        )}
        <p className="text-sm text-muted-foreground max-w-md">{error}</p>
        <Button variant="outline" size="sm" onClick={onRetry}>
          Повторить
        </Button>
      </Card>
    );
  }

  if (!result) return null;

  if (!result.items || result.items.length === 0) {
    return (
      <Card className="p-12 text-center flex flex-col items-center gap-3 border-dashed">
        <SearchX className="h-10 w-10 text-muted-foreground" />
        <p className="font-medium">Ничего не найдено</p>
        <p className="text-sm text-muted-foreground max-w-md">
          Попробуйте изменить запрос или ослабить фильтры.
        </p>
      </Card>
    );
  }

  const total = Math.min(result.total_count, 1000); // GitHub caps at 1000
  const totalPages = Math.min(100, Math.ceil(total / perPage));
  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

  return (
    <div className="space-y-4">
      {type === "topics" ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {result.items.map((item, i) => (
            <TopicCard key={item.name || i} item={item} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {result.items.map((item, i) => (
            <CardByType key={item.id || item.sha || i} type={type} item={item} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <p className="text-xs text-muted-foreground">
            Показано {from}–{to} из {result.total_count > 1000 ? "1000+" : result.total_count}
          </p>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  const pages: (number | "...")[] = [];
  const add = (p: number | "...") => pages.push(p);

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) add(i);
  } else {
    add(1);
    if (page > 3) add("...");
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    for (let i = start; i <= end; i++) add(i);
    if (page < totalPages - 2) add("...");
    add(totalPages);
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="h-8"
      >
        Назад
      </Button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`e-${i}`} className="px-2 text-muted-foreground text-sm">
            …
          </span>
        ) : (
          <Button
            key={p}
            variant={p === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(p)}
            className="h-8 min-w-8"
          >
            {p}
          </Button>
        )
      )}
      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="h-8"
      >
        Вперёд
      </Button>
    </div>
  );
}
