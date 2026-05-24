"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { CheckCircle2, Clock3, ListVideo, PlayCircle } from "lucide-react";
import type { PurchasedCourseDetail } from "@/lib/services/user-purchased-course";
import { cn } from "@/lib/utils";

function formatDuration(lesson: {
  durationSeconds: number | null;
  duration: string | null;
}): string {
  if (lesson.durationSeconds) {
    const m = Math.floor(lesson.durationSeconds / 60);
    const s = lesson.durationSeconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }
  return lesson.duration || "—";
}

interface PurchasedCourseContentProps {
  course: PurchasedCourseDetail;
}

export default function PurchasedCourseContent({
  course,
}: PurchasedCourseContentProps) {
  const allLessons = useMemo(() => {
    if (course.hasChapters) {
      return course.chapters.flatMap((ch) => ch.lessons);
    }
    return course.lessons;
  }, [course]);

  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(
    allLessons[0]?.id ?? null
  );

  const selectedLesson =
    allLessons.find((l) => l.id === selectedLessonId) ?? null;

  return (
    <div className="container-xl mb-12 mt-24 px-4">
      <header className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-borderColor dark:bg-cardBg md:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-mySecondary dark:bg-darkBgHidden dark:text-myGolden">
              <PlayCircle className="size-4" />
              کلاس آنلاین دوره
            </span>
            <h1 className="mt-4 text-2xl font-black leading-9 text-slate-950 dark:text-textPrimary md:text-3xl">
              {course.subject}
            </h1>
            {course.instructor && (
              <p className="mt-2 text-sm text-slate-500 dark:text-textSecondary">
                مدرس: {course.instructor}
              </p>
            )}
            {course.description && (
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-textSecondary">
                {course.description}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm sm:min-w-72">
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-darkBgHidden">
              <p className="text-slate-500 dark:text-textSecondary">تعداد قسمت‌ها</p>
              <p className="mt-2 text-2xl font-black text-slate-950 dark:text-textPrimary">
                {allLessons.length.toLocaleString("fa-IR")}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-darkBgHidden">
              <p className="text-slate-500 dark:text-textSecondary">قسمت فعلی</p>
              <p className="mt-2 line-clamp-1 text-sm font-black text-slate-950 dark:text-textPrimary">
                {selectedLesson?.title || "ندارد"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[1fr_390px]">
        <main className="min-w-0">
          {selectedLesson ? (
            <>
              <div className="overflow-hidden rounded-2xl border border-slate-900 bg-black shadow-xl">
                <video
                  key={selectedLesson.id}
                  controls
                  controlsList="nodownload"
                  onContextMenu={(e) => e.preventDefault()}
                  className="w-full aspect-video"
                  aria-label={`پخش ${selectedLesson.title}`}
                  poster={selectedLesson.thumbnail || undefined}
                >
                  <source
                    src={`/api/user/lessons/${selectedLesson.id}/stream`}
                    type="video/mp4"
                  />
                </video>
              </div>
              <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-borderColor dark:bg-cardBg">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-xl font-black text-slate-950 dark:text-textPrimary">
                      {selectedLesson.title}
                    </h2>
                    {selectedLesson.description && (
                      <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600 dark:text-textSecondary">
                        {selectedLesson.description}
                      </p>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 dark:bg-darkBgHidden dark:text-textSecondary">
                    <Clock3 className="size-4" />
                    {formatDuration(selectedLesson)}
                  </span>
                </div>
              </section>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center dark:border-borderColor dark:bg-cardBg">
              <p className="text-slate-500 dark:text-textSecondary">
                درسی برای نمایش وجود ندارد
              </p>
            </div>
          )}
        </main>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-borderColor dark:bg-cardBg xl:sticky xl:top-24">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4 dark:border-borderColor">
            <h3 className="flex items-center gap-2 text-base font-black text-slate-950 dark:text-textPrimary">
              <ListVideo className="size-5 text-mySecondary dark:text-myGolden" />
              قسمت‌های دوره
            </h3>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500 dark:bg-darkBgHidden dark:text-textSecondary">
              {allLessons.length.toLocaleString("fa-IR")} درس
            </span>
          </div>
          <div className="max-h-[620px] space-y-4 overflow-y-auto pl-1">
            {course.hasChapters
              ? course.chapters.map((chapter) => (
                  <div key={chapter.id}>
                    <p className="mb-2 px-1 text-xs font-extrabold text-slate-500 dark:text-textSecondary">
                      {chapter.title}
                    </p>
                    <ul className="space-y-2">
                      {chapter.lessons.map((lesson) => (
                        <LessonListItem
                          key={lesson.id}
                          lesson={lesson}
                          active={lesson.id === selectedLessonId}
                          onSelect={() => setSelectedLessonId(lesson.id)}
                        />
                      ))}
                    </ul>
                  </div>
                ))
              : allLessons.map((lesson) => (
                  <LessonListItem
                    key={lesson.id}
                    lesson={lesson}
                    active={lesson.id === selectedLessonId}
                    onSelect={() => setSelectedLessonId(lesson.id)}
                  />
                ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

function LessonListItem({
  lesson,
  active,
  onSelect,
}: {
  lesson: PurchasedCourseDetail["lessons"][number];
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-label={`انتخاب درس ${lesson.title}`}
        aria-current={active ? "true" : undefined}
        className={cn(
          "flex w-full items-center gap-3 rounded-xl p-3 text-right transition-colors",
          active
            ? "bg-mySecondary text-white shadow-sm dark:bg-myGolden dark:text-slate-950"
            : "text-slate-700 hover:bg-slate-50 dark:text-textPrimary dark:hover:bg-darkBgHidden"
        )}
      >
        {lesson.thumbnail && (
          <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-darkBgHidden">
            <Image
              src={lesson.thumbnail}
              alt=""
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
        )}
        <div className="flex flex-col min-w-0">
          <span className="truncate text-xs font-extrabold">
            {lesson.title}
          </span>
          <span
            className={cn(
              "mt-1 flex items-center gap-1 text-xs",
              active
                ? "text-white/80 dark:text-slate-900/70"
                : "text-slate-500 dark:text-textSecondary"
            )}
          >
            <CheckCircle2 className="size-3.5" />
            مدت: {formatDuration(lesson)}
          </span>
        </div>
      </button>
    </li>
  );
}
