// app/components/utils/CoursesGrid.client.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Folder } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CourseCard from "./courseCard";
import { Course } from "@prisma/client";

type CourseWithCategory = Course & {
  category?: {
    id: string;
    slug: string;
    title: string;
    color: string | null;
    icon: string | null;
  } | null;
};

interface Props {
  courses: CourseWithCategory[];
}

export default function CoursesGridClient({ courses }: Props) {
  // Build dynamic categories from courses
  const categories = useMemo(() => {
    const uniqueCategories = new Map<string, { label: string; href: string }>();

    // Add "همه" as first option
    uniqueCategories.set("همه", { label: "همه", href: "/courses" });

    // Extract unique categories from courses
    courses.forEach((course) => {
      if (course.category) {
        uniqueCategories.set(course.category.title, {
          label: course.category.title,
          href: `/courses/${course.category.slug}`,
        });
      }
    });

    return Array.from(uniqueCategories.values());
  }, [courses]);

  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  // Update selectedCategory when categories change
  useEffect(() => {
    if (
      categories.length > 0 &&
      !categories.find((c) => c.label === selectedCategory.label)
    ) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory.label]);

  // Memoized filtered courses
  const filteredCourses = useMemo(() => {
    if (selectedCategory.label === "همه") {
      return courses;
    }
    return courses.filter((c) => c.category?.title === selectedCategory.label);
  }, [selectedCategory, courses]);

  return (
    <section
      id="courses-section"
      className="relative flex flex-col justify-center container-xl mt-8 sm:mt-12 md:mt-16 lg:mt-28"
      aria-label="دوره‌های آموزشی"
    >
      {/* Header */}
      <div className="w-full flex flex-col lg:flex-row justify-center items-center text-center gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
        {/* Spacer for desktop only */}
        <div className="hidden lg:block w-[340px]"></div>

        {/* Title & Description */}
        <div className="flex-1 flex flex-col items-center">
          <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl flex items-center justify-center gap-2 sm:gap-2.5 md:gap-3">
            <span>دوره‌ها</span>
            <div className="relative w-12 h-6 sm:w-14 sm:h-7 md:w-16 md:h-8">
              <Image
                src={"/icons/smile.svg"}
                alt="ایموجی خوشحالی"
                fill
                className="object-fill"
              />
            </div>
          </h2>
          <p className="text-[#8A8A8A] mt-1 sm:mt-1.5 md:mt-2 font-bold text-xs sm:text-sm md:text-base max-w-xl">
            این دوره‌ها منتخب بهترین دوره‌های مجموعه ماست
          </p>
        </div>

        {/* Dropdown & Button */}
        <div className="relative flex items-center justify-center lg:justify-end gap-2 sm:gap-3 mt-3 lg:mt-2 w-full lg:w-[340px] px-4 lg:px-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 bg-white border border-gray-300 px-3 py-2 rounded-lg shadow-sm hover:shadow-md transition text-xs sm:text-sm font-bold">
                <ChevronDown size={16} />
                <span>{selectedCategory.label}</span>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-40 bg-white border border-gray-200 rounded-lg shadow-lg"
            >
              {categories.map((cat) => (
                <DropdownMenuItem
                  key={cat.href}
                  onClick={() => setSelectedCategory(cat)}
                  className={`cursor-pointer rtl text-right text-xs px-2 py-2 hover:bg-gray-100 ${
                    cat.label === selectedCategory.label
                      ? "font-bold text-mySecondary"
                      : ""
                  }`}
                >
                  {cat.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href={selectedCategory.href}
            className="flex items-center gap-1 bg-mySecondary text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold hover:opacity-90 transition whitespace-nowrap"
          >
            <Folder size={16} />
            <span>صفحه {selectedCategory.label}</span>
          </Link>
        </div>
      </div>

      {/* Empty state message */}
      {filteredCourses.length === 0 && courses.length > 0 && (
        <div className="mt-6 sm:mt-8 md:mt-12 lg:mt-16 w-full flex flex-col items-center justify-center py-16 sm:py-20 md:py-24">
          <div className="text-center">
            <div className="text-6xl sm:text-7xl mb-4">📚</div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              دوره‌ای در این دسته‌بندی یافت نشد
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              لطفاً دسته‌بندی دیگری را انتخاب کنید
            </p>
          </div>
        </div>
      )}

      {/* No courses at all */}
      {courses.length === 0 && (
        <div className="mt-6 sm:mt-8 md:mt-12 lg:mt-16 w-full flex flex-col items-center justify-center py-16 sm:py-20 md:py-24">
          <div className="text-center">
            <div className="text-6xl sm:text-7xl mb-4">🎓</div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              به زودی دوره‌های جدید اضافه می‌شود
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              در حال حاضر دوره‌ای برای نمایش وجود ندارد
            </p>
          </div>
        </div>
      )}

      {/* Course grid with Motion */}
      {filteredCourses.length > 0 && (
        <div className="mt-6 sm:mt-8 md:mt-12 lg:mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-7 md:gap-8 place-items-center pb-8 sm:pb-10 md:pb-12 lg:pb-16 w-full">
          {filteredCourses.map((data, idx) => {
            // Build dynamic link if course has category and slug
            const courseLink =
              data.slug && data.category?.slug
                ? `/courses/${data.category.slug}/${data.slug}`
                : "/courses";

            return (
              <motion.div
                key={data.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: idx * 0.1,
                  ease: "easeOut",
                }}
                className="w-full"
              >
                <CourseCard data={data} link={courseLink} />
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
