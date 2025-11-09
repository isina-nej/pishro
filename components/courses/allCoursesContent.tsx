"use client";

import { motion } from "framer-motion";
import { Category, Course } from "@prisma/client";
import CourseCard from "@/components/utils/courseCard";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

type CategoryWithCourses = Category & {
  courses: Course[];
};

interface AllCoursesContentProps {
  categoriesWithCourses: CategoryWithCourses[];
}

export default function AllCoursesContent({
  categoriesWithCourses,
}: AllCoursesContentProps) {
  if (categoriesWithCourses.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          هیچ دوره‌ای یافت نشد
        </h1>
        <p className="text-gray-600">
          در حال حاضر دوره‌ای برای نمایش وجود ندارد.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-myPrimary to-mySecondary text-white py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4"
          >
            همه دوره‌های آموزشی
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center text-base sm:text-lg md:text-xl max-w-2xl mx-auto opacity-90"
          >
            مجموعه کامل دوره‌های تخصصی پیشرو در زمینه سرمایه‌گذاری و بازارهای مالی
          </motion.p>
        </div>
      </div>

      {/* Categories and Courses */}
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        {categoriesWithCourses.map((category, categoryIndex) => (
          <motion.section
            key={category.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
            className="mb-12 sm:mb-16 md:mb-20"
          >
            {/* Category Header */}
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div className="flex items-center gap-3">
                {category.icon && (
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-2xl"
                    style={{ backgroundColor: category.color || "#6366f1" }}
                  >
                    {category.icon}
                  </div>
                )}
                <div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
                    {category.title}
                  </h2>
                  {category.description && (
                    <p className="text-sm sm:text-base text-gray-600 mt-1">
                      {category.description}
                    </p>
                  )}
                </div>
              </div>
              <Link
                href={`/courses/${category.slug}`}
                className="flex items-center gap-1 text-mySecondary hover:text-myPrimary transition font-bold text-sm sm:text-base"
              >
                مشاهده همه
                <ChevronLeft size={18} />
              </Link>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 md:gap-8 place-items-center pb-8">
              {category.courses.map((course, courseIndex) => {
                const courseLink =
                  course.slug && category.slug
                    ? `/courses/${category.slug}/${course.slug}`
                    : "/courses";

                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: courseIndex * 0.1,
                      ease: "easeOut",
                    }}
                    className="w-full"
                  >
                    <CourseCard data={course} link={courseLink} />
                  </motion.div>
                );
              })}
            </div>

            {/* Divider */}
            {categoryIndex < categoriesWithCourses.length - 1 && (
              <div className="mt-8 border-b-2 border-gray-200" />
            )}
          </motion.section>
        ))}
      </div>
    </div>
  );
}
