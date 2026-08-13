"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Video, ShoppingCart } from "lucide-react";
import Price from "./price";
import { FormatTime } from "./FormatTime";
import RatingStars from "./RatingStars";
import { useCartStore } from "@/stores/cart-store";
import CourseDetailModal from "@/components/courses/CourseDetailModal";
import CourseActionIcons from "@/components/courses/CourseActionIcons";
import toast from "react-hot-toast";
import type { Course } from "@/lib/types/db";
import { useSession } from "next-auth/react";
import {
  enrollFreeCourse,
  isFreeCourse,
  redirectToLoginForFreeCourse,
} from "@/lib/free-course-enrollment";

// Accept both Course and serialized versions (with string dates)
type CourseData = Course | (Omit<Course, "createdAt" | "updatedAt"> & {
  createdAt: string | Date;
  updatedAt: string | Date;
});

interface CourseCardProps {
  data: CourseData;
  link: string;
}

const CourseCard = ({ data, link: _link }: CourseCardProps) => {
  const [imageError, setImageError] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);
  const imageSrc = data.img || "/images/courses/placeholder.png";
  const isUploadImage = imageSrc.startsWith("/api/uploads/");
  const fallbackImage = "/images/courses/placeholder.png";
  const { data: session } = useSession();
  const freeCourse = isFreeCourse(data);

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (freeCourse) {
      if (!session?.user) {
        redirectToLoginForFreeCourse(data.id);
        return;
      }

      try {
        await enrollFreeCourse(data.id);
        toast.success(`«${data.subject}» به فهرست دوره‌های شما اضافه شد`);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "خطا در ثبت‌نام دوره رایگان");
      }
      return;
    }

    addToCart(data);
    toast.success(`«${data.subject}» به سبد خرید اضافه شد 🛒`);
  };

  const cardContent = (
    <div className="home-glass-card group relative flex w-full cursor-pointer flex-col rounded-3xl p-3 pb-8 transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
    >
      {/* Image section — بدون تیتر/توضیح روی تصویر */}
      <motion.div
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full aspect-[464/238] overflow-hidden rounded-[1.15rem]"
      >
        <Image
          key={imageError ? fallbackImage : imageSrc}
          src={imageError ? fallbackImage : imageSrc}
          alt={data.subject}
          fill
          unoptimized={isUploadImage}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setImageError(true)}
        />

        {/* Purchase Button - Bottom Right */}
        <motion.button
          onClick={handleAddToCart}
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.05 }}
          className="absolute bottom-2 right-2 bg-mySecondary text-foreground px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 hover:shadow-lg transition"
        >
          <ShoppingCart size={14} />
          {freeCourse ? "رایگان" : "خرید"}
        </motion.button>
      </motion.div>

      {/* Share + Bookmark زیر تصویر */}
      <div className="mt-2.5 flex items-center justify-between gap-2 px-0.5">
        <CourseActionIcons
          courseId={data.id}
          subject={data.subject}
          description={data.description}
          slug={data.slug}
          tone="surface"
        />
        <RatingStars rating={data.rating || 2.5} />
      </div>

      {/* Content — بدون تیتر و توضیح */}
      <motion.div
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="mt-1.5 flex flex-1 flex-col justify-between"
      >
        <div className="flex justify-end">
          <Price price={data.price} discount={data.discountPercent || 0} />
        </div>

        <motion.div
          initial={{ opacity: 1 }}
          className="mt-1 flex justify-between border-t border-dashed border-border pt-1.5 text-xs font-bold text-muted-foreground dark:border-borderColor dark:text-textSecondary sm:text-sm"
        >
          <span className="flex items-center gap-1">
            <Users size={16} className="text-foreground dark:text-textPrimary" />
            {data.students ?? 1} دوره آموز
          </span>
          <span className="flex items-center gap-1">
            <Video size={16} className="text-foreground dark:text-textPrimary" />
            {data.videosCount ?? 1} ویدئو تخصصی
          </span>
          <FormatTime time={data.time || "0:00"} />
        </motion.div>
      </motion.div>

      {/* دکمه افزودن به سبد خرید */}
      <div className="absolute -bottom-5 w-full flex justify-center pl-6">
        <button
          onClick={handleAddToCart}
          className="w-48 rounded-full bg-[#6B7F3C] py-2 text-sm font-bold text-white shadow-lg transition-transform duration-300 ease-out hover:scale-105 hover:bg-[#6B7F3C] active:scale-[1.02] sm:text-base"
        >
          {freeCourse ? "ثبت‌نام رایگان" : "افزودن به سبد خرید"}
        </button>
      </div>
    </div>
  );

  return <CourseDetailModal course={data} trigger={cardContent} />;
};

export default CourseCard;
