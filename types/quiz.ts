import { QuestionType } from "@prisma/client";

export interface QuizQuestion {
  id: string;
  question: string;
  questionType: QuestionType;
  options: { text: string }[];
  explanation: string | null;
  points: number;
  order: number;
}

export interface Quiz {
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
  questions: QuizQuestion[];
}

export interface QuizAnswer {
  questionId: string;
  answer: string | string[];
}

export interface QuizSubmissionData {
  quizId: string;
  answers: QuizAnswer[];
  timeSpent?: number;
}

export interface QuizResultData {
  score: number;
  totalPoints: number;
  maxPoints: number;
  passed: boolean;
  correctAnswers?: {
    questionId: string;
    correctAnswer: string | string[];
  }[];
}
