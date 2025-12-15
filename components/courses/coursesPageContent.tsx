"use client";

import React from "react";
import { motion } from "framer-motion";
import type { Course, Category } from "@prisma/client";
import { useCoursesFilters } from "./hooks/useCoursesFilters";
import { CoursesHero } from "./coursesHero";
import { CoursesFilterControls } from "./coursesFilterControls";
import CourseCard from "@/components/utils/courseCard";

type CategoryWithCourses = Category & {
  courses: Course[];
};

interface CoursesPageContentProps {
  categoriesWithCourses: CategoryWithCourses[];
}

const CoursesPageContent = ({
  categoriesWithCourses,
}: CoursesPageContentProps) => {
  const {
    categories,
    sortOptions,
    query,
    selectedCategory,
    selectedSort,
    levelFilter,
    setQuery,
    setCategory,
    setSort,
    setLevelFilter,
    filteredCourses,
    stats,
  } = useCoursesFilters(categoriesWithCourses);

  const hasActiveFilters =
    query.trim().length > 0 ||
    selectedCategory !== "همه" ||
    levelFilter !== "همه";

  const handleResetFilters = () => {
    setQuery("");
    setCategory("همه");
    setSort("جدیدترین");
    setLevelFilter("همه");
  };

  // نگاشت دوره‌ها به دسته‌بندی‌ها برای لینک‌های صحیح
  const getCourseLink = (course: Course) => {
    const category = categoriesWithCourses.find((cat) =>
      cat.courses.some((c) => c.id === course.id)
    );
    if (course.slug && category?.slug) {
      return `/courses/${category.slug}/${course.slug}`;
    }
    return "/courses";
  };

  return (
    <div className="w-full pb-24">
      <CoursesHero stats={stats} />

      <section className="relative -mt-16 z-10">
        <div className="container-xl space-y-12">
          <div className="rounded-3xl border border-white/30 bg-white/85 px-5 py-8 shadow-lg backdrop-blur">
            <CoursesFilterControls
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setCategory}
              query={query}
              onQueryChange={setQuery}
              sortOptions={sortOptions}
              selectedSort={selectedSort}
              onSortChange={setSort}
              levelFilter={levelFilter}
              onLevelFilterChange={setLevelFilter}
              hasActiveFilters={hasActiveFilters}
              onResetFilters={handleResetFilters}
              disabled={false}
            />

            {/* Results Summary */}
            {hasActiveFilters && (
              <div className="mb-6 mt-8">
                <p className="text-sm text-slate-600">
                  {filteredCourses.length > 0 ? (
                    <>
                      <span className="font-semibold text-slate-900">
                        {filteredCourses.length}
                      </span>{" "}
                      دوره{" "}
                      {query && (
                        <>
                          برای جستجوی{" "}
                          <span className="font-semibold text-slate-900">
                            &quot;{query}&quot;
                          </span>
                        </>
                      )}{" "}
                      یافت شد
                    </>
                  ) : (
                    <span className="text-slate-500">
                      هیچ دوره‌ای با این فیلترها یافت نشد
                    </span>
                  )}
                </p>
              </div>
            )}

            {/* Courses Grid */}
            {filteredCourses.length > 0 ? (
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 md:gap-8 place-items-center">
                {filteredCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.05,
                      ease: "easeOut",
                    }}
                    className="w-full"
                  >
                    <CourseCard data={course} link={getCourseLink(course)} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex min-h-[300px] items-center justify-center">
                <div className="text-center">
                  <p className="text-lg text-slate-500">
                    هیچ دوره‌ای برای نمایش وجود ندارد
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={handleResetFilters}
                      className="mt-4 rounded-full border border-slate-300 bg-white px-6 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      پاک کردن فیلترها
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CoursesPageContent;
