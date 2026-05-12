"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  Share2,
  Play,
  Star,
  Clock,
  Users,
  BookOpen,
  BarChart3,
} from "lucide-react";
import type { Course } from "@prisma/client";

interface CourseDetailsModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CourseDetailsModal = ({
  course,
  isOpen,
  onClose,
}: CourseDetailsModalProps) => {
  const [activeTab, setActiveTab] = useState<"درباره" | "نقدها">("درباره");
  const [liked, setLiked] = useState<"LIKE" | "DISLIKE" | null>(null);
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!course) return null;

  const handleLike = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/courses/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id, type: "LIKE" }),
      });
      if (response.ok) {
        setLiked(liked === "LIKE" ? null : "LIKE");
      }
    } catch (error) {
      console.error("Error liking course:", error);
    }
    setIsLoading(false);
  };

  const handleDislike = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/courses/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id, type: "DISLIKE" }),
      });
      if (response.ok) {
        setLiked(liked === "DISLIKE" ? null : "DISLIKE");
      }
    } catch (error) {
      console.error("Error disliking course:", error);
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/courses/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id }),
      });
      if (response.ok) {
        setSaved(!saved);
      }
    } catch (error) {
      console.error("Error saving course:", error);
    }
    setIsLoading(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: course.subject,
          text: course.description,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-gradient-to-b from-slate-900 to-slate-950 text-white"
          >
            {/* Header with Image */}
            <div className="relative h-80 w-full overflow-hidden">
              {course.img && (
                <Image
                  src={course.img}
                  alt={course.subject}
                  fill
                  className="object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-10 rounded-full bg-white dark:bg-cardBg p-2 backdrop-blur hover:bg-white"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Play Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white dark:bg-cardBg p-4 backdrop-blur hover:bg-white"
              >
                <Play className="h-8 w-8 fill-white" />
              </motion.button>

              {/* Course Title and Rating */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h1 className="text-4xl font-bold">{course.subject}</h1>
                <div className="mt-3 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-semibold">
                      {course.rating?.toFixed(1) || "0"}
                    </span>
                  </div>
                  <span className="text-sm text-slate-300">IMDB</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-b border-white/10 px-6 py-4">
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLike}
                  disabled={isLoading}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition ${
                    liked === "LIKE"
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-cardBg dark:bg-cardBg/10 text-slate-300 hover:bg-white dark:bg-cardBg/20"
                  }`}
                >
                  <ThumbsUp className="h-5 w-5" />
                  پسندیدم
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDislike}
                  disabled={isLoading}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition ${
                    liked === "DISLIKE"
                      ? "bg-red-600 text-white"
                      : "bg-white dark:bg-cardBg dark:bg-cardBg/10 text-slate-300 hover:bg-white dark:bg-cardBg/20"
                  }`}
                >
                  <ThumbsDown className="h-5 w-5" />
                  نپسندیدم
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  disabled={isLoading}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition ${
                    saved
                      ? "bg-purple-600 text-white"
                      : "bg-white dark:bg-cardBg dark:bg-cardBg/10 text-slate-300 hover:bg-white dark:bg-cardBg/20"
                  }`}
                >
                  <Bookmark className={`h-5 w-5 ${saved ? "fill-current" : ""}`} />
                  ذخیره
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShare}
                  className="flex items-center gap-2 rounded-lg bg-white dark:bg-cardBg px-4 py-2 font-medium text-slate-300 transition hover:bg-white"
                >
                  <Share2 className="h-5 w-5" />
                  اشتراک‌گذاری
                </motion.button>
              </div>
            </div>

            {/* Course Info Grid */}
            <div className="border-b border-white/10 px-6 py-6">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded-lg bg-white dark:bg-cardBg p-3 backdrop-blur">
                  <div className="text-sm text-slate-400">مدت</div>
                  <div className="mt-1 flex items-center gap-2 text-lg font-semibold">
                    <Clock className="h-4 w-4" />
                    {course.time}
                  </div>
                </div>

                <div className="rounded-lg bg-white dark:bg-cardBg p-3 backdrop-blur">
                  <div className="text-sm text-slate-400">سطح</div>
                  <div className="mt-1 flex items-center gap-2 text-lg font-semibold">
                    <BarChart3 className="h-4 w-4" />
                    {course.level || "نامشخص"}
                  </div>
                </div>

                <div className="rounded-lg bg-white dark:bg-cardBg p-3 backdrop-blur">
                  <div className="text-sm text-slate-400">دانشجویان</div>
                  <div className="mt-1 flex items-center gap-2 text-lg font-semibold">
                    <Users className="h-4 w-4" />
                    {course.students || 0}
                  </div>
                </div>

                <div className="rounded-lg bg-white dark:bg-cardBg p-3 backdrop-blur">
                  <div className="text-sm text-slate-400">ویدیوها</div>
                  <div className="mt-1 flex items-center gap-2 text-lg font-semibold">
                    <BookOpen className="h-4 w-4" />
                    {course.videosCount || 0}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-white/10 px-6">
              <div className="flex gap-6">
                <button
                  onClick={() => setActiveTab("درباره")}
                  className={`border-b-2 py-4 font-medium transition ${
                    activeTab === "درباره"
                      ? "border-blue-500 text-white"
                      : "border-transparent text-slate-400 hover:text-white"
                  }`}
                >
                  درباره
                </button>
                <button
                  onClick={() => setActiveTab("نقدها")}
                  className={`border-b-2 py-4 font-medium transition ${
                    activeTab === "نقدها"
                      ? "border-blue-500 text-white"
                      : "border-transparent text-slate-400 hover:text-white"
                  }`}
                >
                  نقدها
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "درباره" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-bold">درباره این دوره</h3>
                    <p className="mt-3 text-slate-300 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    <div>
                      <div className="text-sm text-slate-400">مدرس</div>
                      <div className="mt-1 font-semibold">{course.instructor || "نامشخص"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-400">زبان</div>
                      <div className="mt-1 font-semibold">
                        {course.language === "FA" ? "فارسی" : "انگلیسی"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-400">قیمت</div>
                      <div className="mt-1 font-semibold">
                        {course.price?.toLocaleString("fa-IR")} تومان
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "نقدها" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-slate-400"
                >
                  <p>نقدی برای این دوره ثبت نشده است.</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
