"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Clock, Users, Play, ShoppingCart } from "lucide-react";
import type { Course } from "@prisma/client";
import { CourseDetailsModal } from "./courseDetailsModal";
import { useCartStore } from "@/stores/cart-store";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import {
  enrollFreeCourse,
  isFreeCourse,
  redirectToLoginForFreeCourse,
} from "@/lib/free-course-enrollment";

interface CourseCardProps {
  course: Course;
}

export const CourseCard = ({ course }: CourseCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);
  const items = useCartStore((state) => state.items);
  const { data: session } = useSession();

  const discountedPrice = course.price
    ? Math.round(course.price * (1 - (course.discountPercent || 0) / 100))
    : 0;

  const isInCart = items.some((item) => item.id === course.id);
  const freeCourse = isFreeCourse(course);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (freeCourse) {
      if (!session?.user) {
        redirectToLoginForFreeCourse(course.id);
        return;
      }

      try {
        await enrollFreeCourse(course.id);
        toast.success(`«${course.subject}» به فهرست دوره‌های شما اضافه شد`);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "خطا در ثبت‌نام دوره رایگان");
      }
      return;
    }

    if (isInCart) {
      toast.success("این دوره قبلاً به سبد خرید اضافه شده است");
      return;
    }
    addToCart(course);
    toast.success(`«${course.subject}» به سبد خرید اضافه شد 🛒`);
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -8 }}
        onClick={() => setIsModalOpen(true)}
        className="group cursor-pointer"
      >
        <div className="relative h-48 w-full overflow-hidden rounded-lg bg-slate-700">
          {course.img && (
            <Image
              src={course.img}
              alt={course.subject}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Play button overlay */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white dark:bg-cardBg backdrop-blur hover:bg-white">
              <Play className="h-8 w-8 fill-white text-white" />
            </div>
          </motion.div>

          {/* Rating badge */}
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 backdrop-blur">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold">
              {course.rating?.toFixed(1) || "0"}
            </span>
          </div>

          {/* Discount badge */}
          {course.discountPercent && course.discountPercent > 0 && (
            <div className="absolute left-3 top-3 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
              {course.discountPercent}%
            </div>
          )}

          {/* Featured badge */}
          {course.featured && (
            <div className="absolute right-3 bottom-3 rounded-full bg-blue-500 px-2 py-1 text-xs font-bold text-white">
              ویژه
            </div>
          )}
        </div>

        {/* Course info */}
        <div className="mt-3 space-y-2">
          <h3 className="line-clamp-2 font-semibold text-white transition group-hover:text-blue-400">
            {course.subject}
          </h3>

          {/* Buy Button - Below Title */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            onClick={handleAddToCart}
            disabled={isInCart}
            className={`w-full flex items-center justify-center gap-1 rounded-lg px-3 py-2 font-semibold text-sm transition ${
              isInCart
                ? "bg-gray-500/70 text-white cursor-not-allowed"
                : "bg-mySecondary text-white hover:shadow-lg hover:scale-105"
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            {freeCourse ? "ثبت‌نام رایگان" : isInCart ? "افزوده شد" : "خرید"}
          </motion.button>

          <p className="text-xs text-slate-400">
            مدرس: {course.instructor || "نامشخص"}
          </p>

          {/* Stats row */}
          <div className="flex gap-3 text-xs text-slate-400">
            {course.time && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {course.time}
              </div>
            )}
            {course.students && (
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {course.students}
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 pt-2">
            <span className="text-lg font-bold text-white">
              {freeCourse ? "رایگان" : discountedPrice.toLocaleString("fa-IR")}
            </span>
            {course.discountPercent && course.discountPercent > 0 && (
              <span className="text-sm text-slate-400 line-through">
                {course.price?.toLocaleString("fa-IR")}
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Modal */}
      <CourseDetailsModal
        course={course}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
