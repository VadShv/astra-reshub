"use client";

import { create } from "zustand";

// Tiny UI store (NOT persisted) that holds ephemeral view state shared across
// deeply-nested components — e.g. which user profile dashboard is currently
// open. The `initialItem` is the raw search-result object so the dashboard can
// render instantly (avatar, login, html_url) before the enrichment API call.
interface UIStore {
  dashboardLogin: string | null;
  dashboardInitial: Record<string, any> | null;
  openDashboard: (login: string, initialItem?: Record<string, any>) => void;
  closeDashboard: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  dashboardLogin: null,
  dashboardInitial: null,
  openDashboard: (login, initialItem) =>
    set({ dashboardLogin: login, dashboardInitial: initialItem || null }),
  closeDashboard: () =>
    set({ dashboardLogin: null, dashboardInitial: null }),
}));
