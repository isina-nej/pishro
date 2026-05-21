"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { MdVideoLibrary } from "react-icons/md";
import type { PurchasedCourseDetail } from "@/lib/services/user-purchased-course";

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
    <div className="container-xl mt-24 mb-12 px-4">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-textPrimary">
          {course.subject}
        </h1>
        {course.instructor && (
          <p className="text-sm text-gray-600 dark:text-textSecondary mt-2">
            مدرس: {course.instructor}
          </p>
        )}
        {course.description && (
          <p className="text-sm text-gray-700 dark:text-textPrimary mt-4 max-w-3xl">
            {course.description}
          </p>
        )}
      </header>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          {selectedLesson ? (
            <>
              <div className="w-full rounded-lg overflow-hidden bg-black">
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
              <h2 className="mt-6 text-xl font-bold">{selectedLesson.title}</h2>
              {selectedLesson.description && (
                <p className="mt-2 text-sm text-gray-600 dark:text-textSecondary">
                  {selectedLesson.description}
                </p>
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-darkBgHidden rounded-lg">
              <p className="text-gray-500 dark:text-textSecondary">
                درسی برای نمایش وجود ندارد
              </p>
            </div>
          )}
        </div>

        <aside className="w-full lg:w-96 p-4 rounded-lg border border-gray-200 dark:border-borderColor bg-white dark:bg-cardBg">
          <h3 className="text-sm font-semibold pb-3 border-b mb-4 flex items-center gap-3">
            <MdVideoLibrary className="text-gray-600 dark:text-textSecondary text-lg" />
            فهرست درس‌ها
          </h3>
          <div className="max-h-[500px] overflow-y-auto space-y-4">
            {course.hasChapters
              ? course.chapters.map((chapter) => (
                  <div key={chapter.id}>
                    <p className="text-xs font-semibold text-gray-500 mb-2">
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
        className={`flex items-center gap-3 p-3 w-full text-right rounded-md transition-colors ${
          active
            ? "bg-gray-100 dark:bg-darkBgHidden"
            : "hover:bg-gray-100 dark:hover:bg-darkBgHidden"
        }`}
      >
        {lesson.thumbnail && (
          <div className="relative w-16 h-12 shrink-0 rounded overflow-hidden">
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
          <span className="font-semibold text-[#495157] text-xs truncate">
            {lesson.title}
          </span>
          <span className="text-xs text-[#666]">
            مدت: {formatDuration(lesson)}
          </span>
        </div>
      </button>
    </li>
  );
}
