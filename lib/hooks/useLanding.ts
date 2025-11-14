// @/lib/hooks/useLanding.ts

"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type {
  HomeLandingResponse,
  AboutPageData,
  InvestmentConsultingData,
  InvestmentPlansData,
} from "@/types/landing";

/**
 * Hook for fetching home landing page data
 */
export function useHomeLanding() {
  return useQuery<HomeLandingResponse>({
    queryKey: ["landing", "home"],
    queryFn: async () => {
      const { data } = await axios.get("/api/landing/home");
      return data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (was cacheTime in v4)
  });
}

/**
 * Hook for fetching about page data
 */
export function useAboutPage() {
  return useQuery<AboutPageData>({
    queryKey: ["landing", "about"],
    queryFn: async () => {
      const { data } = await axios.get("/api/landing/about");
      return data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook for fetching investment consulting page data
 */
export function useInvestmentConsulting() {
  return useQuery<InvestmentConsultingData>({
    queryKey: ["landing", "investment-consulting"],
    queryFn: async () => {
      const { data } = await axios.get("/api/landing/investment-consulting");
      return data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook for fetching investment plans page data
 */
export function useInvestmentPlans() {
  return useQuery<InvestmentPlansData>({
    queryKey: ["landing", "investment-plans"],
    queryFn: async () => {
      const { data } = await axios.get("/api/landing/investment-plans");
      return data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}
