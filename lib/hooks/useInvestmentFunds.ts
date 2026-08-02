import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export interface InvestmentFund {
  id: string;
  key: string;
  name: string;
  description: string | null;
  monthlyRate: number;
  minDuration: number;
  maxDuration: number;
  durationStep: number;
  minAmount: number;
  maxAmount: number;
  amountStep: number;
  order: number;
}

export const investmentFundKeys = {
  all: ["investment-funds"] as const,
  list: () => [...investmentFundKeys.all, "list"] as const,
};

/**
 * Public, active investment funds backing the calculator on the homepage
 * and /investment-plans. Rarely changes (admin-managed), so a long
 * staleTime is appropriate — matches the tuning convention in
 * lib/hooks/useCourses.ts.
 */
export function useInvestmentFunds() {
  return useQuery({
    queryKey: investmentFundKeys.list(),
    queryFn: async () => {
      const { data } = await api.get("/api/investment-funds");
      return data.data as InvestmentFund[];
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
