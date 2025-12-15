import { create } from "zustand";

interface ScrollState {
  activeSection: string | null;
  isScrolling: boolean;
  targetSection: string | null;
  snapEnabled: boolean;
  setActiveSection: (id: string | null) => void;
  setIsScrolling: (value: boolean) => void;
  setTargetSection: (id: string | null) => void;
  setSnapEnabled: (value: boolean) => void;
}

export const useScrollStore = create<ScrollState>((set) => ({
  activeSection: null,
  isScrolling: false,
  targetSection: null,
  snapEnabled: true,
  setActiveSection: (id) => set({ activeSection: id }),
  setIsScrolling: (value) => set({ isScrolling: value }),
  setTargetSection: (id) => set({ targetSection: id }),
  setSnapEnabled: (value) => set({ snapEnabled: value }),
}));
