import { create } from "zustand";

interface UserLevelState {
  level: string | null;
  hasScrolled: boolean;
  setLevel: (level: string | null) => void;
  setHasScrolled: (value: boolean) => void;
}

export const useUserLevelStore = create<UserLevelState>((set) => ({
  level: null,
  hasScrolled: false,
  setLevel: (level) => set({ level, hasScrolled: false }),
  setHasScrolled: (value) => set({ hasScrolled: value }),
}));
