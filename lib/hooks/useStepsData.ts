"use client";

import { useUserLevelStore } from "@/stores/user-level-store";
import { beginnerSteps, intermediateSteps, advancedSteps } from "@/public/data";

/**
 * Custom hook to get steps data based on user level
 */
export const useStepsData = () => {
  const { level } = useUserLevelStore();

  // Determine steps data based on user level
  const stepsData =
    level === "حرفه‌ای"
      ? advancedSteps
      : level === "متوسط"
      ? intermediateSteps
      : beginnerSteps;

  return { stepsData, level };
};
