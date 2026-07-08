"use client";

import * as React from "react";
import {
  Users,
  Trash2,
  Download,
  FileSpreadsheet,
  FileJson,
  ExternalLink,
  X,
  ClipboardList,
  Briefcase,
  MapPin,
  Mail,
  Building2,
  Star,
  RefreshCw,
  Inbox,
  FileDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  Candidate,
  CandidateStatus,
  STATUS_LABELS,
  STATUS_COLORS,
  useSelectionStore,
} from "./selection-store";
import {
  buildHuntFlowCsv,
  buildJson,
  downloadFile,
  timestampName,
} from "@/lib/export";
import { formatNumber, timeAgo } from "@/lib/github";
import { cn } from "@/lib/utils";

interface SelectionPanelProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const STATUS_VALUES: CandidateStatus[] = [
  "new",
  "reviewed",
  "contacted",
  "replied",
  "interested",
  "rejected",
];

export function SelectionPanel({ open, onOpenChange }: SelectionPanelProps) {
  const { candidates, removeCandidate, setStatus, setNote, setPosition, clearAll } =
    useSelectionStore();

  const handleExportCsv = () => {
    if (candidates.length === 0) {
      toast.warning("Выборка пуста");
      return;
    }
    const csv = buildHuntFlowCsv(candidates);
    downloadFile(
      csv,
      timestampName("hunt_selection", "csv"),
      "text/csv;charset=utf-8;"
    );
    toast.success(`Экспортировано ${candidates.length} кандидатов в CSV для ХАНТ`, {
      description: "Файл совместим с HuntFlow bulk-import",
    });
  };

  const handleExportJson = () => {
    if (candidates.length === 0) {
      toast.warning("Выборка пуста");
      return;
    }
    const json = buildJson(candidates);
    downloadFile(
      json,
      timestampName("hunt_selection", "json"),
      "application/json"
    );
    toast.success(`Экспортировано ${candidates.length} кандидатов в JSON`);
  };

  const handleClear = () => {
    if (candidates.length === 0) return;
    clearAll();
    toast.message("Выборка очищена");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:w-[460px] lg:w-[520px] p-0 flex flex-col"
      >
        <SheetHeader className="px-4 pt-4 pb-3 border-b shrink-0">
          <SheetTitle className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-primary" />
              Выборка для ХАНТ
            </span>
            {candidates.length > 0 && (
              <Badge className="bg-primary text-primary-foreground">
                {candidates.length}
              </Badge>
            )}
          </SheetTitle>
          <SheetDescription className="sr-only">
            Список отобранных кандидатов с экспортом в формат ХАНТ (HuntFlow)
          </SheetDescription>
          <div className="flex items-center gap-2 mt-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="gap-1.5" disabled={candidates.length === 0}>
                  <FileDown className="h-3.5 w-3.5" />
                  Экспорт
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Формат выгрузки</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleExportCsv} className="gap-2 cursor-pointer">
                  <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                  <div className="flex flex-col">
                    <span>CSV для ХАНТ (HuntFlow)</span>
                    <span className="text-[10px] text-muted-foreground">
                      ;-разделитель, импорт кандидатов
                    </span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportJson} className="gap-2 cursor-pointer">
                  <FileJson className="h-4 w-4 text-amber-600" />
                  <div className="flex flex-col">
                    <span>JSON (полные данные)</span>
                    <span className="text-[10px] text-muted-foreground">
                      для интеграций и Webhook
                    </span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={handleClear}
              disabled={candidates.length === 0}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Очистить
            </Button>
          </div>
        </SheetHeader>

        {candidates.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <Inbox className="h-7 w-7 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">Выборка пуста</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                Перейдите к поиску пользователей и нажмите «В выборку» на карточках
                подходящих разработчиков. Затем экспортируйте список в формат ХАНТ.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-1"
              onClick={() => onOpenChange(false)}
            >
              К поиску
            </Button>
          </div>
        ) : (
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-3">
              {candidates.map((c) => (
                <CandidateRow
                  key={c.login}
                  candidate={c}
                  onRemove={() => removeCandidate(c.login)}
                  onStatusChange={(s) => setStatus(c.login, s)}
                  onNoteChange={(n) => setNote(c.login, n)}
                  onPositionChange={(p) => setPosition(c.login, p)}
                />
              ))}
            </div>
          </ScrollArea>
        )}

        {candidates.length > 0 && (
          <div className="border-t p-3 bg-muted/30 shrink-0">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>Всего кандидатов: {candidates.length}</span>
              <span>
                С email: {candidates.filter((c) => c.email).length} · с локацией:{" "}
                {candidates.filter((c) => c.location).length}
              </span>
            </div>
            <Button
              className="w-full gap-2"
              onClick={handleExportCsv}
            >
              <Download className="h-4 w-4" />
              Скачать выборку для ХАНТ
            </Button>
            <p className="text-[11px] text-muted-foreground text-center mt-2">
              CSV открывается в Excel и импортируется в HuntFlow / ХАНТ
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function CandidateRow({
  candidate,
  onRemove,
  onStatusChange,
  onNoteChange,
  onPositionChange,
}: {
  candidate: Candidate;
  onRemove: () => void;
  onStatusChange: (s: CandidateStatus) => void;
  onNoteChange: (n: string) => void;
  onPositionChange: (p: string) => void;
}) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="flex items-start gap-2.5">
        <Avatar className="h-9 w-9 rounded-lg border shrink-0">
          <AvatarImage src={candidate.avatar_url} alt={candidate.login} />
          <AvatarFallback className="rounded-lg text-xs">
            {candidate.login?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <a
                href={candidate.html_url}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-sm hover:text-primary truncate inline-flex items-center gap-1"
              >
                {candidate.name || candidate.login}
                <ExternalLink className="h-3 w-3 opacity-50" />
              </a>
              <p className="text-[11px] text-muted-foreground font-mono truncate">
                @{candidate.login}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0 text-muted-foreground hover:text-rose-500"
              onClick={onRemove}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Status + position */}
          <div className="flex items-center gap-1.5 mt-2">
            <Select value={candidate.status} onValueChange={(v) => onStatusChange(v as CandidateStatus)}>
              <SelectTrigger
                className={cn(
                  "h-6 w-auto text-[11px] border-0 px-2 font-medium",
                  STATUS_COLORS[candidate.status]
                )}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_VALUES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!candidate.enriched && (
              <Badge variant="outline" className="text-[9px] py-0 gap-1">
                <RefreshCw className="h-2.5 w-2.5" />
                базовые
              </Badge>
            )}
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground mt-2">
            {candidate.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {candidate.location}
              </span>
            )}
            {candidate.company && (
              <span className="flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {candidate.company}
              </span>
            )}
            {candidate.followers !== undefined && (
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {formatNumber(candidate.followers)}
              </span>
            )}
            {candidate.public_repos !== undefined && (
              <span className="flex items-center gap-1">
                <Briefcase className="h-3 w-3" />
                {candidate.public_repos} репо
              </span>
            )}
          </div>

          {candidate.email && (
            <a
              href={`mailto:${candidate.email}`}
              className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline mt-1.5"
            >
              <Mail className="h-3 w-3" />
              {candidate.email}
            </a>
          )}

          {candidate.bio && (
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1.5">
              {candidate.bio}
            </p>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 mt-1.5 text-[11px] text-muted-foreground"
            onClick={() => setExpanded((e) => !e)}
          >
            {expanded ? "Скрыть детали" : "Заметки и должность"}
          </Button>

          {expanded && (
            <div className="space-y-2 mt-2 pt-2 border-t">
              <div className="space-y-1">
                <Label className="text-[11px] text-muted-foreground">
                  Целевая должность
                </Label>
                <Input
                  placeholder="напр., Senior Python Developer"
                  value={candidate.position || ""}
                  onChange={(e) => onPositionChange(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] text-muted-foreground">
                  Заметка рекрутера
                </Label>
                <Textarea
                  placeholder="Комментарий для коллег / аутрича..."
                  value={candidate.note || ""}
                  onChange={(e) => onNoteChange(e.target.value)}
                  className="text-sm min-h-[60px] resize-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Floating button that shows the selection count and opens the panel. */
export function SelectionFab({
  count,
  onClick,
}: {
  count: number;
  onClick: () => void;
}) {
  if (count === 0) return null;
  return (
    <button
      onClick={onClick}
      className="fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 transition-all px-4 py-3 text-sm font-medium"
      aria-label={`Открыть выборку (${count})`}
    >
      <Users className="h-4 w-4" />
      <span>Выборка</span>
      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-background text-primary text-[11px] font-bold px-1.5">
        {count}
      </span>
    </button>
  );
}
