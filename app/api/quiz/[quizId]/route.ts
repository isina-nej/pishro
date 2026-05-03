import { NextRequest } from "next/server";
import { getQuizById } from "@/lib/services/quiz-service";
import { successResponse, errorResponse } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const { quizId } = await params;

    const quiz = await getQuizById(quizId);

    if (!quiz) {
      return errorResponse("آزمون یافت نشد", "QUIZ_NOT_FOUND", 404);
    }

    return successResponse(quiz);
  } catch (error) {
    console.error("Error in quiz API:", error);
    return errorResponse("خطا در دریافت آزمون", "INTERNAL_ERROR", 500);
  }
}
