// Client Component برای نمایش دوره‌های یک دسته‌بندی با فیلتر سطح
"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CourseCard from "./courseCard";
import { Course, CourseLevel, Prisma } from "@prisma/client";

// Type for Course with relations from getCategoryCourses
type CourseWithRelations = Prisma.CourseGetPayload<{
  include: {
    category: {
      select: {
        id: true;
        slug: true;
        title: true;
        color: true;
      };
    };
    relatedTags: true;
    _count: {
      select: {
        enrollments: true;
        comments: true;
      };
    };
  };
}>;

// Type for serialized course with string dates (from server component)
type SerializedCourseWithRelations = Omit<CourseWithRelations, "createdAt" | "updatedAt" | "relatedTags"> & {
  createdAt: string;
  updatedAt: string;
  relatedTags: Array<Omit<CourseWithRelations["relatedTags"][number], "createdAt" | "updatedAt"> & {
    createdAt: string;
    updatedAt: string;
  }>;
};

const levelOptions = [
  { label: "همه سطوح", value: null },
  { label: "مبتدی", value: "BEGINNER" as CourseLevel },
  { label: "متوسط", value: "INTERMEDIATE" as CourseLevel },
  { label: "پیشرفته", value: "ADVANCED" as CourseLevel },
];

interface CoursesGridCategoryClientProps {
  courses: SerializedCourseWithRelations[] | Course[];
  categorySlug: string;
  categoryTitle: string;
}

export default function CoursesGridCategoryClient({
  courses,
  categorySlug,
  categoryTitle,
}: CoursesGridCategoryClientProps) {
  const [selectedLevel, setSelectedLevel] = useState<{
    label: string;
    value: CourseLevel | null;
  }>(levelOptions[0]);

  // فیلتر دوره‌ها بر اساس سطح انتخاب شده
  const filteredCourses = useMemo(() => {
    if (!selectedLevel.value) return courses;
    return courses.filter((course) => course.level === selectedLevel.value);
  }, [selectedLevel, courses]);

  return (
    <section
      className="relative flex flex-col justify-center container-xl mt-8 sm:mt-12 md:mt-16 lg:mt-28"
      aria-label="دوره‌های آموزشی"
    >
      {/* Header */}
      <div className="w-full flex justify-center items-center text-center gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-0">
        <div className="w-[260px]"></div>
        <div className="flex-1 flex flex-col items-center">
          <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl flex items-center justify-center gap-2 sm:gap-2.5 md:gap-3">
            <span>دوره‌های {categoryTitle}</span>
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
            دوره‌های آموزشی تخصصی {categoryTitle}
          </p>
        </div>

        {/* Dropdown فیلتر سطح */}
        <div className="relative flex items-center justify-end gap-3 mt-2 w-[260px]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 bg-white border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm hover:shadow-md transition text-sm font-bold">
                <ChevronDown size={16} />
                <span>{selectedLevel.label}</span>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-40 bg-white border border-gray-200 rounded-lg shadow-lg"
            >
              {levelOptions.map((level) => (
                <DropdownMenuItem
                  key={level.label}
                  onClick={() => setSelectedLevel(level)}
                  className={`cursor-pointer rtl text-right text-sm px-4 py-2 hover:bg-gray-100 ${
                    level.label === selectedLevel.label
                      ? "font-bold text-mySecondary"
                      : ""
                  }`}
                >
                  {level.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* پیام خالی بودن */}
      {filteredCourses.length === 0 && (
        <div className="mt-6 sm:mt-8 md:mt-12 lg:mt-16 text-center py-12">
          <p className="text-gray-500 text-lg">
            هیچ دوره‌ای در این سطح یافت نشد
          </p>
        </div>
      )}

      {/* Grid دوره‌ها با انیمیشن */}
      <div className="mt-6 sm:mt-8 md:mt-12 lg:mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-7 md:gap-8 place-items-center pb-8 sm:pb-10 md:pb-12 lg:pb-16 w-full">
        {filteredCourses.map((course, idx) => {
          // Build dynamic link: /courses/{categorySlug}/{courseSlug}
          const courseLink = course.slug
            ? `/courses/${categorySlug}/${course.slug}`
            : "/courses";

          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
              className="w-full"
            >
              <CourseCard data={course} link={courseLink} />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
