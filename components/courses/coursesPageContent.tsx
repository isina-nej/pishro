"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Course, Category } from "@/lib/types/db";
import { useCoursesInfinite } from "@/lib/hooks/useCourses";
import { flattenCoursePages, getCoursesTotal, type CourseListParams } from "@/lib/services/course-service";
import type { CourseSortOption } from "./hooks/useCoursesFilters";
import { CoursesHero } from "./coursesHero";
import { CoursesFilterControls } from "./coursesFilterControls";
import CourseCard from "@/components/utils/courseCard";
import { useVisibility } from "@/components/site/VisibilityProvider";
import { usePublicCopy } from "@/components/site/PublicContentProvider";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

type CategoryWithCourses = Category & {
  courses: Course[];
};

interface CoursesPageContentProps {
  categoriesWithCourses: CategoryWithCourses[];
}

const sortOptions: CourseSortOption[] = ["جدیدترین", "محبوب‌ترین", "پرفروش‌ترین"];

const CoursesPageContent = ({
  categoriesWithCourses,
}: CoursesPageContentProps) => {
  const { show } = useVisibility();
  const copy = usePublicCopy("courses");

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedSort, setSelectedSort] = useState<CourseSortOption>("جدیدترین");
  const [levelFilter, setLevelFilter] = useState("همه");
  const [categoryFilter, setCategoryFilter] = useState("همه");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 400);
    return () => clearTimeout(t);
  }, [query]);

  const infiniteParams: Omit<CourseListParams, "page"> = {
    sort: selectedSort,
    ...(debouncedQuery ? { search: debouncedQuery } : {}),
    ...(levelFilter !== "همه" ? { level: levelFilter } : {}),
    ...(categoryFilter !== "همه" ? { categoryId: categoryFilter } : {}),
  };

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCoursesInfinite(infiniteParams);

  const filteredCourses = flattenCoursePages(data?.pages);
  const total = getCoursesTotal(data?.pages);

  // نگاشت دوره‌ها به دسته‌بندی‌ها برای لینک‌های صحیح
  const categoryOf = useMemo(() => {
    const map = new Map<string, CategoryWithCourses>();
    for (const cat of categoriesWithCourses) {
      for (const course of cat.courses) {
        if (!map.has(course.id)) map.set(course.id, cat);
      }
    }
    return map;
  }, [categoriesWithCourses]);

  const getCourseLink = (course: Course) => {
    const category = categoryOf.get(course.id);
    if (course.slug && category?.slug) {
      return `/courses/${category.slug}/${course.slug}`;
    }
    return "/courses";
  };

  // آمار هیرو از داده SSR (کل دیتابیس) تا با اسکرول نپرد
  const stats = useMemo(() => {
    const all = categoriesWithCourses.flatMap((cat) => cat.courses).filter((c) => c.published);
    const totalCourses = all.length;
    const totalStudents = all.reduce((sum, c) => sum + (c.students || 0), 0);
    const avgRating =
      all.reduce((sum, c) => sum + (c.rating || 0), 0) / (totalCourses || 1);
    return {
      totalCourses,
      totalStudents,
      totalCategories: categoriesWithCourses.length,
      avgRating: Math.round(avgRating * 10) / 10,
    };
  }, [categoriesWithCourses]);

  const hasActiveFilters =
    query.trim().length > 0 ||
    levelFilter !== "همه" ||
    categoryFilter !== "همه";

  const handleResetFilters = () => {
    setQuery("");
    setSelectedSort("جدیدترین");
    setLevelFilter("همه");
    setCategoryFilter("همه");
  };

  // ponytail: sentinel only; observer pulls next page near viewport
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasNextPage) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) fetchNextPage();
      },
      { rootMargin: "600px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const categoryOptions = useMemo(
    () => [
      { id: "همه", title: "همه" },
      ...categoriesWithCourses.map((cat) => ({ id: cat.id, title: cat.title })),
    ],
    [categoriesWithCourses]
  );

  return (
    <div className="w-full pb-24">
      {show("courses:hero") && <CoursesHero stats={stats} />}

      {(show("courses:filters") || show("courses:catalog")) && (
        <section id="courses-catalog" className="relative -mt-20 z-10 scroll-mt-24">
          <div className="container-xl space-y-12">
            <div className="public-page-panel rounded-[2.25rem] px-5 py-8 sm:px-7 lg:px-9">
              {show("courses:filters") && (
                <CoursesFilterControls
                  query={query}
                  onQueryChange={setQuery}
                  sortOptions={sortOptions}
                  selectedSort={selectedSort}
                  onSortChange={setSelectedSort}
                  levelFilter={levelFilter}
                  onLevelFilterChange={setLevelFilter}
                  hasActiveFilters={hasActiveFilters}
                  onResetFilters={handleResetFilters}
                  disabled={false}
                />
              )}

              {show("courses:catalog") && (
                <>
                  <div className="mb-6 mt-8 flex flex-wrap items-center gap-3">
                    <p className="text-sm text-muted-foreground">
                      {copy("results.prefix", "نمایش")}{" "}
                      <span className="font-semibold text-foreground">
                        {filteredCourses.length.toLocaleString("fa-IR")}
                      </span>{" "}
                      {copy("results.middle", "از")}{" "}
                      <span className="font-semibold text-foreground">
                        {total.toLocaleString("fa-IR")}
                      </span>{" "}
                      {copy("results.unit", "دوره")}
                      {query && (
                        <>
                          {copy("results.queryPrefix", "برای جستجوی")}
                          <span className="font-semibold text-foreground">
                            &quot;{query}&quot;
                          </span>
                        </>
                      )}
                    </p>
                    {categoryOptions.length > 2 && (
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="h-9 rounded-xl border border-border/60 bg-card px-3 text-xs text-foreground"
                        aria-label="دسته‌بندی"
                      >
                        {categoryOptions.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {filteredCourses.length > 0 || isLoading ? (
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 md:gap-8 place-items-center">
                      {filteredCourses.map((course, index) => (
                        <motion.div
                          key={course.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.5,
                            delay: Math.min(index % 12, 6) * 0.05,
                            ease: "easeOut",
                          }}
                          className="w-full"
                        >
                          <CourseCard
                            data={course}
                            link={getCourseLink(course)}
                          />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex min-h-[300px] items-center justify-center">
                      <div className="text-center">
                        <p className="text-lg text-muted-foreground">
                          {copy("results.none", "هیچ دوره‌ای برای نمایش وجود ندارد")}
                        </p>
                        {hasActiveFilters && (
                          <button
                            onClick={handleResetFilters}
                            className="mt-4 rounded-full border border-border bg-card px-6 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
                          >
                            {copy("filters.clear", "پاک کردن فیلترها")}
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <div ref={sentinelRef} aria-hidden className="h-1 w-full" />
                  {isFetchingNextPage && (
                    <div className="flex justify-center py-6">
                      <LoadingSpinner />
                    </div>
                  )}
                  {!hasNextPage && filteredCourses.length > 0 && (
                    <p className="py-4 text-center text-xs text-muted-foreground">
                      {copy("results.end", "همه دوره‌ها نمایش داده شد")}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default CoursesPageContent;
