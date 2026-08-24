"use client";

import * as React from "react";
import { KeyRound, ShieldCheck, ExternalLink, Eye, EyeOff, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useSearchStore } from "./store";

export function SettingsDialog() {
  const { githubToken, setGithubToken } = useSearchStore();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    if (open) setValue(githubToken);
  }, [open, githubToken]);

  const hasToken = !!githubToken;

  const handleSave = () => {
    setGithubToken(value);
    if (value.trim()) {
      toast.success("Токен сохранён. Поиск по коду и лимиты разблокированы.");
    } else {
      toast.success("Токен удалён.");
    }
    setOpen(false);
  };

  const handleClear = () => {
    setValue("");
    setGithubToken("");
    toast.success("Токен удалён.");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-1.5"
          title="Настройки и GitHub токен"
        >
          <KeyRound className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Токен</span>
          {hasToken && (
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-4 w-4" />
            GitHub Personal Access Token
          </DialogTitle>
          <DialogDescription>
            Токен хранится в памяти текущей вкладки и отправляется напрямую на
            сервер GitHub. При перезагрузке страницы токен нужно ввести заново.
            Без токена доступны все типы поиска, кроме поиска по коду, а лимит —
            10 запросов/мин. С токеном — 5000/час и поиск по коду.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="pat">Personal Access Token (PAT)</Label>
            <div className="relative">
              <Input
                id="pat"
                type={show ? "text" : "password"}
                placeholder="ghp_... или github_pat_..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                autoComplete="off"
                spellCheck={false}
                className="pr-10 font-mono text-sm"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-7 w-7"
                onClick={() => setShow((s) => !s)}
              >
                {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </Button>
            </div>
          </div>

          <a
            href="https://github.com/settings/tokens/new?description=GitFind&scopes=public_repo,read:user"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <ExternalLink className="h-3 w-3" />
            Создать новый токен на GitHub (public_repo + read:user)
          </a>

          <div className="rounded-lg border bg-muted/40 p-3 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              Безопасность
            </div>
            <ul className="space-y-1 text-muted-foreground list-disc pl-4">
              <li>Токен хранится локально в вашем браузере, никуда не передаётся.</li>
              <li>Используется только для авторизации запросов к GitHub API.</li>
              <li>Рекомендуется использовать fine-grained токен с минимальными правами.</li>
            </ul>
          </div>

          {hasToken && (
            <div className="flex items-center gap-2 text-xs">
              <Badge variant="secondary" className="gap-1">
                <Check className="h-3 w-3 text-emerald-500" />
                Токен настроен
              </Badge>
              <span className="text-muted-foreground">
                Лимит: ~5000 запросов/час
              </span>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {hasToken && (
            <Button variant="ghost" onClick={handleClear} className="mr-auto text-rose-500 hover:text-rose-600">
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              Удалить токен
            </Button>
          )}
          <Button variant="outline" onClick={() => setOpen(false)}>
            Отмена
          </Button>
          <Button onClick={handleSave}>Сохранить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
