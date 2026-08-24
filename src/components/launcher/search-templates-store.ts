"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SearchTemplate {
  id: string;
  name: string;
  description: string;
  source: string;
  url: string;
  tags: string[];
  createdAt: number;
}

interface SearchTemplatesStore {
  templates: SearchTemplate[];
  addTemplate: (t: Omit<SearchTemplate, "id" | "createdAt">) => void;
  removeTemplate: (id: string) => void;
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const BUILTIN_TEMPLATES: SearchTemplate[] = [
  {
    id: "tpl-cpp-senior-msk",
    name: "Senior C++ Москва",
    description: "Системные C++ разработчики в Москве",
    source: "gitfind",
    url: "language:c++ location:moscow followers:>50",
    tags: ["C++", "Москва", "Senior"],
    createdAt: 0,
  },
  {
    id: "tpl-go-backend-ru",
    name: "Go backend Россия",
    description: "Go-разработчики backend по России",
    source: "gitfind",
    url: "language:go location:russia followers:>20",
    tags: ["Go", "Россия", "Backend"],
    createdAt: 0,
  },
  {
    id: "tpl-rust-systems",
    name: "Rust systems",
    description: "Rust-разработчики системного ПО",
    source: "gitfind",
    url: "language:rust followers:>30",
    tags: ["Rust", "Systems"],
    createdAt: 0,
  },
  {
    id: "tpl-habr-cpp-resume",
    name: "C++ резюме Хабр",
    description: "Google x-ray по Хабр Карьера",
    source: "cse",
    url: 'https://www.google.com/search?q=site:career.habr.com/resumes+%22C%2B%2B+%D1%80%D0%B0%D0%B7%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D1%87%D0%B8%D0%BA%22',
    tags: ["C++", "Хабр", "x-ray"],
    createdAt: 0,
  },
  {
    id: "tpl-hh-python",
    name: "Python hh.ru",
    description: "Python-разработчики на hh.ru",
    source: "hh",
    url: "https://hh.ru/resume?tab=all&text=Python+%D1%80%D0%B0%D0%B7%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D1%87%D0%B8%D0%BA",
    tags: ["Python", "hh.ru"],
    createdAt: 0,
  },
];

export const useSearchTemplatesStore = create<SearchTemplatesStore>()(
  persist(
    (set) => ({
      templates: BUILTIN_TEMPLATES,
      addTemplate: (t) =>
        set((s) => ({
          templates: [{ ...t, id: uid(), createdAt: Date.now() }, ...s.templates],
        })),
      removeTemplate: (id) =>
        set((s) => ({ templates: s.templates.filter((t) => t.id !== id) })),
    }),
    { name: "sourcerhub-search-templates-v1" }
  )
);
