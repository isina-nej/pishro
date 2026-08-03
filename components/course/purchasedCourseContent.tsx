"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  Clock3,
  Expand,
  ListVideo,
  Pause,
  Play,
  PlayCircle,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
} from "lucide-react";
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

function formatPlaybackTime(value: number) {
  if (!Number.isFinite(value)) return "0:00";
  const totalSeconds = Math.max(0, Math.floor(value));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

interface PurchasedCourseContentProps {
  course: PurchasedCourseDetail;
}

export default function PurchasedCourseContent({
  course,
}: PurchasedCourseContentProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerShellRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const progressValue = duration ? Math.min((currentTime / duration) * 100, 100) : 0;

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

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [selectedLessonId]);

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      await video.play();
    } else {
      video.pause();
    }
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(
      Math.max(video.currentTime + seconds, 0),
      video.duration || Number.MAX_SAFE_INTEGER
    );
  };

  const changePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const toggleFullscreen = async () => {
    const element = playerShellRef.current;
    if (!element) return;

    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await element.requestFullscreen();
    }
  };

  return (
    <div className="min-h-screen bg-muted pt-20 dark:bg-bodyBg">
      <div className="container-xl px-4 pb-12">
      <header className="mb-6 overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-sm dark:border-borderColor dark:bg-cardBg md:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-mySecondary/10 px-3 py-1 text-xs font-bold text-mySecondary dark:bg-darkBgHidden dark:text-myGolden">
              <PlayCircle className="size-4" />
              پنل یادگیری
            </span>
            <h1 className="mt-4 text-2xl font-black leading-9 text-foreground dark:text-textPrimary md:text-3xl">
              {course.subject}
            </h1>
            {course.instructor && (
              <p className="mt-2 text-sm text-muted-foreground dark:text-textSecondary">
                مدرس: {course.instructor}
              </p>
            )}
            {course.description && (
              <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground dark:text-textSecondary">
                {course.description}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm sm:min-w-80">
            <div className="rounded-2xl bg-muted p-4 dark:bg-darkBgHidden">
              <p className="text-muted-foreground dark:text-textSecondary">تعداد قسمت‌ها</p>
              <p className="mt-2 text-2xl font-black text-foreground dark:text-textPrimary">
                {allLessons.length.toLocaleString("fa-IR")}
              </p>
            </div>
            <div className="rounded-2xl bg-muted p-4 dark:bg-darkBgHidden">
              <p className="text-muted-foreground dark:text-textSecondary">قسمت فعلی</p>
              <p className="mt-2 line-clamp-1 text-sm font-black text-foreground dark:text-textPrimary">
                {selectedLesson?.title || "ندارد"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_410px]">
        <main className="min-w-0">
          {selectedLesson ? (
            <>
              <div
                ref={playerShellRef}
                className="overflow-hidden rounded-3xl border border-border bg-background shadow-2xl shadow-slate-900/20"
              >
                <video
                  ref={videoRef}
                  key={selectedLesson.id}
                  controls={false}
                  controlsList="nodownload noplaybackrate noremoteplayback"
                  disablePictureInPicture
                  playsInline
                  preload="metadata"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                  onLoadedMetadata={(e) => {
                    setDuration(e.currentTarget.duration || 0);
                    e.currentTarget.playbackRate = playbackRate;
                    e.currentTarget.muted = isMuted;
                  }}
                  className="w-full aspect-video"
                  aria-label={`پخش ${selectedLesson.title}`}
                  poster={selectedLesson.thumbnail || undefined}
                >
                  <source
                    src={`/api/user/lessons/${selectedLesson.id}/stream`}
                    type="video/mp4"
                  />
                </video>
                <div className="border-t border-border/10 bg-card px-4 py-3 text-primary-foreground">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="w-11 text-xs font-bold text-foreground/70">
                      {formatPlaybackTime(currentTime)}
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={progressValue}
                      onChange={(e) => {
                        const video = videoRef.current;
                        if (!video || !duration) return;
                        video.currentTime = (Number(e.target.value) / 100) * duration;
                      }}
                      aria-label="نوار پیشرفت ویدیو"
                      className="h-2 flex-1 accent-myGolden"
                    />
                    <span className="w-11 text-left text-xs font-bold text-foreground/70">
                      {formatPlaybackTime(duration)}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={togglePlay}
                        className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-bold text-foreground transition hover:bg-myGolden"
                      >
                        {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
                        {isPlaying ? "توقف" : "پخش"}
                      </button>
                      <button
                        type="button"
                        onClick={() => skip(-10)}
                        className="inline-flex items-center gap-1 rounded-full bg-card/10 px-3 py-2 text-xs font-bold transition hover:bg-card/20"
                      >
                        <RotateCcw className="size-4" />
                        ۱۰ ثانیه
                      </button>
                      <button
                        type="button"
                        onClick={() => skip(10)}
                        className="inline-flex items-center gap-1 rounded-full bg-card/10 px-3 py-2 text-xs font-bold transition hover:bg-card/20"
                      >
                        <RotateCw className="size-4" />
                        ۱۰ ثانیه
                      </button>
                      <button
                        type="button"
                        onClick={toggleMute}
                        className="inline-flex items-center gap-1 rounded-full bg-card/10 px-3 py-2 text-xs font-bold transition hover:bg-card/20"
                      >
                        {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
                        {isMuted ? "صدا بسته" : "صدا"}
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-foreground/80">
                      <select
                        value={playbackRate}
                        onChange={(e) => changePlaybackRate(Number(e.target.value))}
                        aria-label="سرعت پخش"
                        className="rounded-full border border-border/10 bg-card/10 px-3 py-2 text-primary-foreground outline-none"
                      >
                        {[0.75, 1, 1.25, 1.5, 2].map((rate) => (
                          <option key={rate} value={rate} className="bg-card">
                            {rate}x
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={toggleFullscreen}
                        className="inline-flex items-center gap-1 rounded-full bg-card/10 px-3 py-2 transition hover:bg-card/20"
                      >
                        <Expand className="size-4" />
                        تمام صفحه
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <section className="mt-5 rounded-3xl border border-border bg-card p-5 shadow-sm dark:border-borderColor dark:bg-cardBg">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-xl font-black text-foreground dark:text-textPrimary">
                      {selectedLesson.title}
                    </h2>
                    {selectedLesson.description && (
                      <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground dark:text-textSecondary">
                        {selectedLesson.description}
                      </p>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-xs font-bold text-muted-foreground dark:bg-darkBgHidden dark:text-textSecondary">
                    <Clock3 className="size-4" />
                    {formatDuration(selectedLesson)}
                  </span>
                </div>
              </section>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-card py-12 text-center dark:border-borderColor dark:bg-cardBg">
              <p className="text-muted-foreground dark:text-textSecondary">
                درسی برای نمایش وجود ندارد
              </p>
            </div>
          )}
        </main>

        <aside className="h-fit rounded-3xl border border-border bg-card p-4 shadow-sm dark:border-borderColor dark:bg-cardBg xl:sticky xl:top-24">
          <div className="mb-4 flex items-center justify-between border-b border-border pb-4 dark:border-borderColor">
            <h3 className="flex items-center gap-2 text-base font-black text-foreground dark:text-textPrimary">
              <ListVideo className="size-5 text-mySecondary dark:text-myGolden" />
              قسمت‌های دوره
            </h3>
            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-bold text-muted-foreground dark:bg-darkBgHidden dark:text-textSecondary">
              {allLessons.length.toLocaleString("fa-IR")} درس
            </span>
          </div>
          <div className="max-h-[620px] space-y-4 overflow-y-auto pl-1">
            {course.hasChapters
              ? course.chapters.map((chapter) => (
                  <div key={chapter.id}>
                    <p className="mb-2 px-1 text-xs font-extrabold text-muted-foreground dark:text-textSecondary">
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
            ? "bg-mySecondary text-foreground shadow-sm dark:bg-myGolden"
            : "text-muted-foreground hover:bg-muted dark:text-textPrimary dark:hover:bg-darkBgHidden"
        )}
      >
        {lesson.thumbnail && (
          <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-muted dark:bg-darkBgHidden">
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
                ? "text-foreground/80/70"
                : "text-muted-foreground dark:text-textSecondary"
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
