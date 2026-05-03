import { NextRequest } from "next/server";
import { getLevelAssessmentQuiz } from "@/lib/services/quiz-service";
import { successResponse, errorResponse } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // Get categorySlug from query parameters
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("categorySlug");

    console.log(`Fetching level assessment quiz for category: ${categorySlug || 'any'}`);

    const quiz = await getLevelAssessmentQuiz(categorySlug || undefined);

    if (!quiz) {
      return errorResponse(
        categorySlug
          ? `آزمون تعیین سطح برای دسته‌بندی ${categorySlug} یافت نشد`
          : "آزمون تعیین سطح یافت نشد",
        "QUIZ_NOT_FOUND",
        404
      );
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
