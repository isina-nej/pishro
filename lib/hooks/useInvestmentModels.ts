// @/lib/hooks/useInvestmentModels.ts

"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { InvestmentModelsPageData } from "@/types/landing";

/**
 * Hook for fetching investment models page data
 */
export function useInvestmentModels() {
  return useQuery<InvestmentModelsPageData | null>({
    queryKey: ["investment-models"],
    queryFn: async () => {
      const { data } = await axios.get("/api/investment-models");
      return data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}
