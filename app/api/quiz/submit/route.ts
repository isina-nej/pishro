import { NextRequest } from "next/server";
import { submitQuiz, QuizSubmission } from "@/lib/services/quiz-service";
import {
  successResponse,
  errorResponse,
  validationError,
} from "@/lib/api-response";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();

    // Validation
    if (!body.quizId || !body.answers || !Array.isArray(body.answers)) {
      return validationError({ input: "داده‌های ورودی نامعتبر است" });
    }

    const submission: QuizSubmission = {
      quizId: body.quizId,
      userId: session?.user?.id, // Optional - can be null for anonymous quizzes
      answers: body.answers,
      timeSpent: body.timeSpent,
    };

    const result = await submitQuiz(submission);

    if (!result) {
      return errorResponse("خطا در ثبت نتایج آزمون", "SUBMISSION_FAILED", 500);
    }

    return successResponse(result);
  } catch (error) {
    console.error("Error in quiz submit API:", error);
    return errorResponse("خطا در ثبت نتایج آزمون", "INTERNAL_ERROR", 500);
  }
}
