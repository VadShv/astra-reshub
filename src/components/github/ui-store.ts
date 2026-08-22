"use client";

import { create } from "zustand";

export type AppId =
  | "launcher"
  | "gitfind"
  | "linkedin"
  | "cse"
  | "lor"
  | "habr"
  | "stackoverflow"
  | "hh"
  | "superjob"
  | "opennet"
  | "vc"
  | "habrqa"
  | "ruso"
  | "ubuntu"
  | "telegram"
  | "gitlab"
  | "codeforces"
  | "reddit"
  | "devto"
  | "sourcehut"
  | "hackersnews"
  | "bitbucket"
  | "kaggle"
  | "dockerhub"
  | "gopkg"
  | "crates"
  | "pypi"
  | "codeberg"
  | "leetcode"
  | "medium";

interface UIStore {
  // Which search system / view is active.
  activeApp: AppId;
  setApp: (app: AppId) => void;
  // Which user profile dashboard is currently open (GitFind only).
  dashboardLogin: string | null;
  dashboardInitial: Record<string, any> | null;
  openDashboard: (login: string, initialItem?: Record<string, any>) => void;
  closeDashboard: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  activeApp: "launcher",
  setApp: (app) => set({ activeApp: app }),
  dashboardLogin: null,
  dashboardInitial: null,
  openDashboard: (login, initialItem) =>
    set({ dashboardLogin: login, dashboardInitial: initialItem || null }),
  closeDashboard: () =>
    set({ dashboardLogin: null, dashboardInitial: null }),
}));
