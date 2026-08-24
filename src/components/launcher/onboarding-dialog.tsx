"use client";

import * as React from "react";
import { Search, Users, Download, LayoutGrid, BarChart3, X } from "lucide-react";

const STORAGE_KEY = "sourcerhub-onboarding-done";

export function OnboardingDialog() {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(STORAGE_KEY)) {
      setShow(true);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "1");
    setShow(false);
  }

  if (!show) return null;

  const features = [
    { icon: <Search className="h-5 w-5" />, title: "44 поисковые системы", desc: "GitHub, LinkedIn, hh.ru, Хабр, VK, Telegram, Yandex, Bing и др. — всё в одном месте" },
    { icon: <Users className="h-5 w-5" />, title: "Выборка кандидатов", desc: "Добавляйте кандидатов из любого источника в единую выборку" },
    { icon: <LayoutGrid className="h-5 w-5" />, title: "Kanban-доска", desc: "Воронка кандидатов: New → Contacted → Hired. Drag-and-drop" },
    { icon: <BarChart3 className="h-5 w-5" />, title: "Дашборд", desc: "Аналитика: воронка, эффективность источников, конверсия" },
    { icon: <Download className="h-5 w-5" />, title: "Экспорт в ХАНТ", desc: "Выгрузка выборки в CSV для импорта в HuntFlow / ХАНТ" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative max-w-lg w-full rounded-2xl border bg-card p-6 shadow-2xl">
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-foreground text-background mb-3">
            <Search className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold">Добро пожаловать в SourcerHub</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Сорсинг системных инженеров C/C++/Go/Python/Rust
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {features.map((f, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg border bg-background p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {f.icon}
              </div>
              <div>
                <div className="text-sm font-semibold">{f.title}</div>
                <div className="text-xs text-muted-foreground">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={dismiss}
          className="w-full rounded-xl bg-primary text-primary-foreground py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Начать работу
        </button>
      </div>
    </div>
  );
}
