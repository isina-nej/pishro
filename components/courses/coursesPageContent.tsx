"use client";

import React from "react";
import { motion } from "framer-motion";
import type { Course, Category } from "@/lib/types/db";
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
    sortOptions,
    query,
    selectedSort,
    levelFilter,
    setQuery,
    setSort,
    setLevelFilter,
    filteredCourses,
    stats,
  } = useCoursesFilters(categoriesWithCourses);

  const hasActiveFilters =
    query.trim().length > 0 || levelFilter !== "همه";

  const handleResetFilters = () => {
    setQuery("");
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
          <div className="public-page-panel rounded-[2.25rem] px-5 py-8 sm:px-7 lg:px-9">
            <CoursesFilterControls
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
                <p className="text-sm text-muted-foreground dark:text-textSecondary">
                  {filteredCourses.length > 0 ? (
                    <>
                      <span className="font-semibold text-foreground dark:text-textPrimary">
                        {filteredCourses.length}
                      </span>{""}
                      دوره{""}
                      {query && (
                        <>
                          برای جستجوی{""}
                          <span className="font-semibold text-foreground dark:text-textPrimary">
                            &quot;{query}&quot;
                          </span>
                        </>
                      )}{""}
                      یافت شد
                    </>
                  ) : (
                    <span className="text-muted-foreground dark:text-textSecondary">
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
                  <p className="text-lg text-muted-foreground dark:text-textSecondary">
                    هیچ دوره‌ای برای نمایش وجود ندارد
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={handleResetFilters}
                      className="mt-4 rounded-full border border-border bg-card px-6 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted dark:border-borderColor dark:bg-cardBg dark:text-textSecondary dark:hover:bg-darkBgHidden"
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
