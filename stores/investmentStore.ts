import { create } from "zustand";

export interface InvestmentData {
  type: string;
  amount: number;
  risk: number;
  duration: number;
}

interface InvestmentState {
  data: InvestmentData | null;
  setData: (data: InvestmentData) => void;
  resetData: () => void;
}

export const useInvestmentStore = create<InvestmentState>((set) => ({
  data: null,
  setData: (data) => set({ data }),
  resetData: () => set({ data: null }),
}));
