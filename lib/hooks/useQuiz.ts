import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  QuizWithQuestions,
  QuizResult,
  QuizSubmission,
} from "@/lib/services/quiz-service";

// ================== Fetch Level Assessment Quiz ==================
export function useLevelAssessmentQuiz(categorySlug?: string) {
  return useQuery<QuizWithQuestions>({
    queryKey: ["quiz", "level-assessment", categorySlug],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (categorySlug) params.append("categorySlug", categorySlug);

      const { data } = await axios.get(
        `/api/quiz/level-assessment?${params.toString()}`
      );
      return data.data;
    },
    enabled: !!categorySlug, // Only fetch if categorySlug is provided
    staleTime: 1000 * 60 * 30, // 30 minutes
    retry: 2,
  });
}

// ================== Fetch Quiz by ID ==================
export function useQuiz(quizId: string | null) {
  return useQuery<QuizWithQuestions>({
    queryKey: ["quiz", quizId],
    queryFn: async () => {
      if (!quizId) throw new Error("Quiz ID is required");
      const { data } = await axios.get(`/api/quiz/${quizId}`);
      return data.data;
    },
    enabled: !!quizId,
    staleTime: 1000 * 60 * 30, // 30 minutes
    retry: 2,
  });
}

// ================== Submit Quiz ==================
export function useSubmitQuiz() {
  const queryClient = useQueryClient();

  return useMutation<QuizResult, Error, QuizSubmission>({
    mutationFn: async (submission: QuizSubmission) => {
      const { data } = await axios.post("/api/quiz/submit", submission);
      return data.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate quiz attempts query
      queryClient.invalidateQueries({
        queryKey: ["quiz-attempts", variables.userId],
      });
    },
  });
}

// ================== Fetch User Quiz Attempts ==================
export function useUserQuizAttempts(userId?: string, quizId?: string) {
  return useQuery({
    queryKey: ["quiz-attempts", userId, quizId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (quizId) params.append("quizId", quizId);

      const { data } = await axios.get(`/api/quiz/attempts?${params}`);
      return data.data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
