"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaUserGraduate, FaUser, FaCrown, FaSpinner } from "react-icons/fa";
import { useUserLevelStore } from "@/stores/user-level-store";
import { useLevelAssessmentQuiz, useSubmitQuiz } from "@/lib/hooks/useQuiz";
import { QuizAnswer } from "@/types/quiz";
import { toast } from "react-hot-toast";

const levels = [
  {
    icon: <FaUser size={36} className="text-mySecondary" />,
    title: "سطح مبتدی",
  },
  {
    icon: <FaUserGraduate size={36} className="text-mySecondary" />,
    title: "سطح متوسط",
  },
  {
    icon: <FaCrown size={36} className="text-mySecondary" />,
    title: "سطح حرفه‌ای",
  },
];

interface UserLevelSectionProps {
  categorySlug: string;
}

const UserLevelSection = ({ categorySlug }: UserLevelSectionProps) => {
  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState<Map<string, string>>(new Map());
  const [quizFinished, setQuizFinished] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const { level, setLevel, setHasScrolled } = useUserLevelStore();

  // Fetch quiz data for the specific category
  const { data: quiz, isLoading, error } = useLevelAssessmentQuiz(categorySlug);
  const submitQuizMutation = useSubmitQuiz();

  useEffect(() => {
    if (open && startTime === 0) {
      setStartTime(Date.now());
    }
  }, [open, startTime]);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => {
      const updated = new Map(prev);
      updated.set(questionId, value);
      return updated;
    });
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    // Calculate time spent in seconds
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    // Prepare submission data
    const quizAnswers: QuizAnswer[] = Array.from(answers.entries()).map(
      ([questionId, answer]) => ({
        questionId,
        answer,
      })
    );

    try {
      const result = await submitQuizMutation.mutateAsync({
        quizId: quiz.id,
        answers: quizAnswers,
        timeSpent,
      });

      // Determine user level based on score
      let userLevel = "مبتدی";
      if (result.score >= 80) userLevel = "حرفه‌ای";
      else if (result.score >= 50) userLevel = "متوسط";

      setHasScrolled(false);
      setLevel(userLevel);
      setQuizFinished(true);

      toast.success(`نمره شما: ${result.score.toFixed(0)}%`);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast.error("خطا در ثبت نتایج آزمون");
    }
  };

  const handleOpenDialog = () => {
    setOpen(true);
    setQuizFinished(false);
    setAnswers(new Map());
    setStartTime(0);
  };

  const allQuestionsAnswered =
    quiz?.questions.every((q) => answers.has(q.id)) ?? false;

  return (
    <section className="py-8 sm:py-10 md:py-12 mt-8 sm:mt-10 md:mt-12">
      <div className="container-xl text-center px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 place-items-center max-w-7xl mx-auto">
          {levels.map((levelItem, i) => (
            <div
              key={i}
              className="relative flex flex-col items-center justify-between bg-mySecondary text-white rounded-2xl sm:rounded-3xl h-auto min-h-[320px] sm:min-h-[350px] md:h-[390px] w-full max-w-[320px] sm:max-w-[350px] md:max-w-[390px] px-6 sm:px-7 md:px-8 py-8 sm:py-9 md:py-10 shadow-sm hover:shadow-lg transition-transform duration-300 hover:scale-105"
            >
              <div className="bg-white size-20 sm:size-[88px] md:size-24 flex items-center justify-center rounded-full shadow-md">
                <div className="text-2xl sm:text-3xl md:text-4xl">
                  {levelItem.icon}
                </div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mt-4 sm:mt-5 md:mt-6">
                {levelItem.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-200 leading-6 sm:leading-7 px-2">
                برای ارزیابی سطح خود، آزمون زیر را انجام دهید.
              </p>
              <button
                onClick={handleOpenDialog}
                className="mt-4 sm:mt-5 md:mt-6 px-8 sm:px-10 md:px-12 py-3 sm:py-3.5 md:py-4 bg-white text-mySecondary text-sm sm:text-base md:text-lg font-semibold rounded-full hover:scale-105 transition-all w-full sm:w-auto"
                aria-label={`شروع آزمون ${levelItem.title}`}
              >
                آزمون تعیین سطح
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 🧠 مدال آزمون */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-full sm:max-w-2xl md:max-w-3xl mx-4">
          <DialogHeader>
            <DialogTitle className="rtl text-lg sm:text-xl md:text-2xl">
              {quiz?.title || "آزمون تعیین سطح سرمایه‌گذاری"}
            </DialogTitle>
            {quiz?.description && (
              <p className="text-sm text-gray-600 mt-2">{quiz.description}</p>
            )}
          </DialogHeader>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <FaSpinner className="animate-spin text-mySecondary text-3xl" />
              <span className="mr-3 text-gray-600">در حال بارگذاری آزمون...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              خطا در بارگذاری آزمون. لطفاً دوباره تلاش کنید.
            </div>
          ) : quizFinished ? (
            <div className="text-center py-6 sm:py-8">
              <p className="text-base sm:text-lg md:text-xl font-semibold mb-4">
                سطح شما: {level}
              </p>
              <Button
                onClick={() => setOpen(false)}
                className="mt-4 px-6 sm:px-8 py-2 sm:py-3"
                aria-label="بستن"
              >
                بستن
              </Button>
            </div>
          ) : quiz ? (
            <>
              {/* Time limit indicator */}
              {quiz.timeLimit && (
                <div className="text-sm text-gray-600 mb-2">
                  زمان: {quiz.timeLimit} دقیقه
                </div>
              )}

              <div className="space-y-4 sm:space-y-5 md:space-y-6 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto px-1">
                {quiz.questions.map((q, i) => (
                  <div key={q.id}>
                    <p className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base md:text-lg">
                      {i + 1}. {q.question}
                    </p>

                    {/* Multiple Choice / True-False */}
                    {(q.questionType === "MULTIPLE_CHOICE" ||
                      q.questionType === "TRUE_FALSE") && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                        {q.options.map((opt, j) => (
                          <label
                            key={j}
                            className={`flex items-center gap-2 border rounded-lg p-2.5 sm:p-3 cursor-pointer transition-all duration-200 text-sm sm:text-base ${
                              answers.get(q.id) === opt.text
                                ? "bg-mySecondary text-white border-mySecondary"
                                : "bg-gray-50 hover:bg-gray-100"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`q${q.id}`}
                              value={opt.text}
                              checked={answers.get(q.id) === opt.text}
                              onChange={() => handleAnswer(q.id, opt.text)}
                              className="hidden"
                              aria-label={`گزینه ${j + 1}: ${opt.text}`}
                            />
                            <span>{opt.text}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {/* Multiple Select */}
                    {q.questionType === "MULTIPLE_SELECT" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                        {q.options.map((opt, j) => {
                          const currentAnswers = answers.get(q.id)
                            ? (answers.get(q.id) as string).split(",")
                            : [];
                          const isChecked = currentAnswers.includes(opt.text);

                          return (
                            <label
                              key={j}
                              className={`flex items-center gap-2 border rounded-lg p-2.5 sm:p-3 cursor-pointer transition-all duration-200 text-sm sm:text-base ${
                                isChecked
                                  ? "bg-mySecondary text-white border-mySecondary"
                                  : "bg-gray-50 hover:bg-gray-100"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  let newAnswers = [...currentAnswers];
                                  if (isChecked) {
                                    newAnswers = newAnswers.filter(
                                      (a) => a !== opt.text
                                    );
                                  } else {
                                    newAnswers.push(opt.text);
                                  }
                                  handleAnswer(q.id, newAnswers.join(","));
                                }}
                                className="hidden"
                                aria-label={`گزینه ${j + 1}: ${opt.text}`}
                              />
                              <span>{opt.text}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}

                    {/* Short Answer */}
                    {q.questionType === "SHORT_ANSWER" && (
                      <input
                        type="text"
                        value={answers.get(q.id) || ""}
                        onChange={(e) => handleAnswer(q.id, e.target.value)}
                        className="w-full border rounded-lg p-2.5 sm:p-3 text-sm sm:text-base"
                        placeholder="پاسخ خود را وارد کنید"
                      />
                    )}
                  </div>
                ))}
              </div>

              <DialogFooter className="mt-4 sm:mt-6 !justify-center">
                <Button
                  onClick={handleSubmit}
                  size="lg"
                  disabled={!allQuestionsAnswered || submitQuizMutation.isPending}
                  className="bg-mySecondary px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base disabled:opacity-50"
                  aria-label="تعیین سطح"
                >
                  {submitQuizMutation.isPending ? (
                    <>
                      <FaSpinner className="animate-spin ml-2" />
                      در حال ثبت...
                    </>
                  ) : (
                    "تعیین سطح"
                  )}
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default UserLevelSection;
