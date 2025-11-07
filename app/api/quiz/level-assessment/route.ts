import { NextRequest } from "next/server";
import { getLevelAssessmentQuiz } from "@/lib/services/quiz-service";
import { successResponse, errorResponse } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  try {
    const quiz = await getLevelAssessmentQuiz();

    if (!quiz) {
      return errorResponse("آزمون تعیین سطح یافت نشد", "QUIZ_NOT_FOUND", 404);
    }

    return successResponse(quiz);
  } catch (error) {
    console.error("Error in level-assessment API:", error);
    return errorResponse(
      "خطا در دریافت آزمون تعیین سطح",
      "INTERNAL_ERROR",
      500
    );
  }
}
