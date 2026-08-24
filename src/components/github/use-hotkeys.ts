"use client";

import * as React from "react";
import { useUIStore } from "./ui-store";
import { useSelectionStore } from "./selection-store";

const HOTKEYS: Record<string, () => void> = {};

export function useHotkeys() {
  const setApp = useUIStore((s) => s.setApp);
  const activeApp = useUIStore((s) => s.activeApp);

  React.useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const key = e.key.toLowerCase();
      switch (key) {
        case "/":
          e.preventDefault();
          const input = document.querySelector<HTMLInputElement>('input[placeholder*="Поиск системы"]');
          if (input) input.focus();
          break;
        case "h":
          if (activeApp !== "launcher") { e.preventDefault(); setApp("launcher"); }
          break;
        case "k":
          e.preventDefault(); setApp("kanban");
          break;
        case "d":
          e.preventDefault(); setApp("dashboard");
          break;
        case "m":
          e.preventDefault(); setApp("metasearch");
          break;
        case "g":
          e.preventDefault(); setApp("gitfind");
          break;
        case "l":
          e.preventDefault(); setApp("linkedin");
          break;
        case "c":
          e.preventDefault(); setApp("compare");
          break;
        case "escape":
          if (activeApp !== "launcher") { e.preventDefault(); setApp("launcher"); }
          break;
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setApp, activeApp]);
}

export const HOTKEY_HINTS = [
  { key: "/", label: "Поиск системы" },
  { key: "H", label: "Главная" },
  { key: "G", label: "GitFind" },
  { key: "L", label: "LinkedIn" },
  { key: "K", label: "Kanban" },
  { key: "D", label: "Дашборд" },
  { key: "M", label: "Мета-поиск" },
  { key: "C", label: "Сравнение" },
  { key: "Esc", label: "Назад" },
];
