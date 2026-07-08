"use client";

import { create } from "zustand";

// Tiny UI store (NOT persisted) that holds ephemeral view state shared across
// deeply-nested components — e.g. which user profile dashboard is currently
// open. This avoids prop-drilling through <ResultsList> → <UserCard>.
interface UIStore {
  dashboardLogin: string | null;
  openDashboard: (login: string) => void;
  closeDashboard: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  dashboardLogin: null,
  openDashboard: (login) => set({ dashboardLogin: login }),
  closeDashboard: () => set({ dashboardLogin: null }),
}));
