// lib/store.ts
import { create } from "zustand";

type User = { id: string; name: string; kycDone: boolean };
type DashboardState = {
  user?: User;
  setUser: (u: User) => void;
};

export const useDashboardStore = create<DashboardState>((set) => ({
  user: undefined,
  setUser: (u) => set({ user: u }),
}));
