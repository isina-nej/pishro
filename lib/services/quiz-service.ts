import { prisma } from "@/lib/prisma";
import { QuestionType, QuizAttempt } from "@prisma/client";

// ================== Types ==================
export interface QuizWithQuestions {
  id: string;
  title: string;
  description: string | null;
  timeLimit: number | null;
  passingScore: number;
  maxAttempts: number | null;
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
  showResults: boolean;
  showCorrectAnswers: boolean;
  questions: QuizQuestionResponse[];
}

export interface QuizQuestionResponse {
  id: string;
  question: string;
  questionType: QuestionType;
  options: { text: string; isCorrect?: boolean }[];
  explanation: string | null;
  points: number;
  order: number;
}

export interface QuizSubmission {
  quizId: string;
  userId?: string;
  answers: { questionId: string; answer: string | string[] }[];
  timeSpent?: number;
}

export interface QuizResult {
  score: number;
  totalPoints: number;
  maxPoints: number;
  passed: boolean;
  correctAnswers?: { questionId: string; correctAnswer: string | string[] }[];
}

// ================== Get Quiz by ID ==================
export async function getQuizById(
  quizId: string
): Promise<QuizWithQuestions | null> {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: {
        id: quizId,
        published: true,
      },
      include: {
        questions: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!quiz) return null;

    // Map questions to response format
    const questions: QuizQuestionResponse[] = quiz.questions.map((q) => ({
      id: q.id,
      question: q.question,
      questionType: q.questionType,
      options: q.options as { text: string; isCorrect?: boolean }[],
      explanation: q.explanation,
      points: q.points,
      order: q.order,
    }));

    // Shuffle questions if enabled
    if (quiz.shuffleQuestions) {
      questions.sort(() => Math.random() - 0.5);
    }

    // Shuffle answers if enabled & remove correct answers from client response
    const processedQuestions = questions.map((q) => {
      const options = [...q.options];

      if (quiz.shuffleAnswers) {
        options.sort(() => Math.random() - 0.5);
      }

      // Remove isCorrect from client response for security
      return {
        ...q,
        options: options.map(({ text }) => ({ text })),
      };
    });

    return {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      timeLimit: quiz.timeLimit,
      passingScore: quiz.passingScore,
      maxAttempts: quiz.maxAttempts,
      shuffleQuestions: quiz.shuffleQuestions,
      shuffleAnswers: quiz.shuffleAnswers,
      showResults: quiz.showResults,
      showCorrectAnswers: quiz.showCorrectAnswers,
      questions: processedQuestions,
    };
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return null;
  }
}

// ================== Get Quiz by Course ==================
export async function getQuizzesByCourse(courseId: string) {
  try {
    const quizzes = await prisma.quiz.findMany({
      where: {
        courseId,
        published: true,
      },
      select: {
        id: true,
        title: true,
        description: true,
        timeLimit: true,
        passingScore: true,
        maxAttempts: true,
        order: true,
      },
      orderBy: { order: "asc" },
    });

    return quizzes;
  } catch (error) {
    console.error("Error fetching course quizzes:", error);
    return [];
  }
}

// ================== Get Level Assessment Quiz by Category ==================
// Special quiz for user level assessment for a specific category
export async function getLevelAssessmentQuiz(
  categorySlug?: string
): Promise<QuizWithQuestions | null> {
  try {
    // If categorySlug is provided, find quiz for that specific category
    if (categorySlug) {
      // First, get the category
      const category = await prisma.category.findUnique({
        where: { slug: categorySlug },
      });

      if (!category) {
        console.error(`Category not found: ${categorySlug}`);
        return null;
      }

      // Find quiz for this category
      const quiz = await prisma.quiz.findFirst({
        where: {
          categoryId: category.id,
          courseId: null, // Ensure it's not tied to any course
          published: true,
        },
        include: {
          questions: {
            orderBy: { order: "asc" },
          },
        },
      });

      if (!quiz) return null;

      return getQuizById(quiz.id);
    }

    // Fallback: Find any level assessment quiz (for backwards compatibility)
    const quiz = await prisma.quiz.findFirst({
      where: {
        courseId: null,
        published: true,
      },
      include: {
        questions: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!quiz) return null;

    return getQuizById(quiz.id);
  } catch (error) {
    console.error("Error fetching level assessment quiz:", error);
    return null;
  }
}

// ================== Submit Quiz & Calculate Score ==================
export async function submitQuiz(
  submission: QuizSubmission
): Promise<QuizResult | null> {
  try {
    // Fetch quiz with questions including correct answers
    const quiz = await prisma.quiz.findUnique({
      where: { id: submission.quizId },
      include: {
        questions: true,
      },
    });

    if (!quiz) return null;

    // Calculate score
    let totalPoints = 0;
    let maxPoints = 0;
    const correctAnswers: {
      questionId: string;
      correctAnswer: string | string[];
    }[] = [];

    quiz.questions.forEach((question) => {
      maxPoints += question.points;
      const userAnswer = submission.answers.find(
        (a) => a.questionId === question.id
      );

      if (!userAnswer) return;

      let isCorrect = false;

      // Check answer based on question type
      if (question.questionType === "MULTIPLE_CHOICE") {
        const options = question.options as {
          text: string;
          isCorrect: boolean;
        }[];
        const correctOption = options.find((o) => o.isCorrect);

        if (correctOption && userAnswer.answer === correctOption.text) {
          isCorrect = true;
        }
        correctAnswers.push({
          questionId: question.id,
          correctAnswer: correctOption?.text || "",
        });
      } else if (question.questionType === "MULTIPLE_SELECT") {
        const options = question.options as {
          text: string;
          isCorrect: boolean;
        }[];
        const correctOptions = options
          .filter((o) => o.isCorrect)
          .map((o) => o.text);
        const userAnswers = Array.isArray(userAnswer.answer)
          ? userAnswer.answer
          : [userAnswer.answer];

        if (
          correctOptions.length === userAnswers.length &&
          correctOptions.every((a) => userAnswers.includes(a))
        ) {
          isCorrect = true;
        }
        correctAnswers.push({
          questionId: question.id,
          correctAnswer: correctOptions,
        });
      } else if (question.questionType === "TRUE_FALSE") {
        const correctValue = question.correctAnswer ? "true" : "false";
        if (userAnswer.answer === correctValue) {
          isCorrect = true;
        }
        correctAnswers.push({
          questionId: question.id,
          correctAnswer: correctValue,
        });
      }

      if (isCorrect) {
        totalPoints += question.points;
      }
    });

    const score = maxPoints > 0 ? (totalPoints / maxPoints) * 100 : 0;
    const passed = score >= quiz.passingScore;

    // Save attempt if user is logged in
    if (submission.userId) {
      await prisma.quizAttempt.create({
        data: {
          quizId: submission.quizId,
          userId: submission.userId,
          answers: submission.answers,
          score,
          totalPoints,
          maxPoints,
          passed,
          timeSpent: submission.timeSpent,
          completedAt: new Date(),
        },
      });
    }

    const result: QuizResult = {
      score,
      totalPoints,
      maxPoints,
      passed,
    };

    // Include correct answers if quiz settings allow
    if (quiz.showCorrectAnswers) {
      result.correctAnswers = correctAnswers;
    }

    return result;
  } catch (error) {
    console.error("Error submitting quiz:", error);
    return null;
  }
}

// ================== Get User Quiz Attempts ==================
export async function getUserQuizAttempts(
  userId: string,
  quizId?: string
): Promise<QuizAttempt[]> {
  try {
    const attempts = await prisma.quizAttempt.findMany({
      where: {
        userId,
        ...(quizId && { quizId }),
        completedAt: { not: null },
      },
      orderBy: { completedAt: "desc" },
    });

    return attempts;
  } catch (error) {
    console.error("Error fetching user quiz attempts:", error);
    return [];
  }
}

// ================== Get User Best Score ==================
export async function getUserBestScore(
  userId: string,
  quizId: string
): Promise<number | null> {
  try {
    const bestAttempt = await prisma.quizAttempt.findFirst({
      where: {
        userId,
        quizId,
        completedAt: { not: null },
      },
      orderBy: { score: "desc" },
      select: { score: true },
    });

    return bestAttempt?.score ?? null;
  } catch (error) {
    console.error("Error fetching user best score:", error);
    return null;
  }
}

// ================== Check Remaining Attempts ==================
export async function getRemainingAttempts(
  userId: string,
  quizId: string
): Promise<number | null> {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      select: { maxAttempts: true },
    });

    if (!quiz || !quiz.maxAttempts) return null; // Unlimited attempts

    const attemptCount = await prisma.quizAttempt.count({
      where: {
        userId,
        quizId,
        completedAt: { not: null },
      },
    });

    return Math.max(0, quiz.maxAttempts - attemptCount);
  } catch (error) {
    console.error("Error checking remaining attempts:", error);
    return null;
  }
}
