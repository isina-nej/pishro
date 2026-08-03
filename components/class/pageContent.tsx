"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MdVideoLibrary } from "react-icons/md";
import VideoPlayer from "./videoPlayer";
import type { Lesson } from "@/types/lesson";

interface ClassPageContentProps {
  lessonData?: Lesson;
  courseLessons?: Lesson[];
}

const ClassPageContent: React.FC<ClassPageContentProps> = ({
  lessonData,
  courseLessons = [],
}) => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(
    lessonData || courseLessons[0] || null
  );

  useEffect(() => {
    if (lessonData) {
      setSelectedLesson(lessonData);
    }
  }, [lessonData]);

  return (
    <div className="container-xl mt-24">
      <div className="flex gap-6">
        {/* ویدیو پلیر */}
        <div className="flex-1 w-full min-w-4xl">
          {selectedLesson ? (
            <VideoPlayer
              videoId={selectedLesson.videoId as string | null}
              label={selectedLesson.title}
              description={selectedLesson.description}
              duration={selectedLesson.duration}
              views={selectedLesson.views}
              createdAt={selectedLesson.createdAt as Date | undefined}
              thumbnail={selectedLesson.thumbnail}
            />
          ) : (
            <div className="text-center py-12 bg-muted dark:bg-darkBgHidden rounded-lg">
              <p className="text-muted-foreground dark:text-textSecondary">ویدیویی برای نمایش وجود ندارد</p>
            </div>
          )}
        </div>

        {/* سایدبار لیست ویدیوها */}
        <div className="w-96 p-4 rounded-lg mt-8">
          <h3 className="text-sm font-semibold pb-3 border-b mb-4 flex items-center gap-3">
            <MdVideoLibrary className="text-muted-foreground dark:text-textSecondary text-lg" />
            ویدیو سایر جلسات
          </h3>
          <ul className="space-y-4 max-h-[500px] overflow-y-auto">
            {courseLessons.map((lesson) => (
              <li
                key={lesson.id}
                className={`cursor-pointer rounded-md transition-all duration-200 ${
                  lesson.id === selectedLesson?.id && "bg-muted dark:bg-cardBg"
                } ${"hover:bg-muted dark:hover:bg-darkBgHidden dark:bg-darkBgHidden dark:hover:bg-cardBg"}`}
                onClick={() => setSelectedLesson(lesson)}
              >
                <Link
                  href={`/class/${lesson.id}`}
                  className="flex items-center gap-3 p-3 w-full"
                >
                  {/* تصویر بندانگشتی */}
                  {lesson.thumbnail && (
                    <div className="relative w-20 h-16 rounded-full">
                      <Image
                        src={lesson.thumbnail}
                        alt={lesson.title}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                  )}

                  {/* اطلاعات ویدیو */}
                  <div className="flex flex-col">
                    <span className="font-semibold text-[#495157] text-xs">
                      {lesson.title}
                    </span>
                    {lesson.duration && (
                      <span className="text-xs text-[#666]">
                        مدت زمان: {lesson.duration}
                      </span>
                    )}
                    {lesson.description && (
                      <p className="text-xs text-muted-foreground dark:text-textPrimary line-clamp-2">
                        {lesson.description}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ClassPageContent;
