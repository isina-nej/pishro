"use client";

import { useMemo, useState } from "react";
import type { Course, Category } from "@/lib/types/db";

export type CourseSortOption = "جدیدترین" | "محبوب‌ترین" | "پرفروش‌ترین";

export interface CoursesFiltersHook {
  sortOptions: CourseSortOption[];
  query: string;
  selectedSort: CourseSortOption;
  levelFilter: string;
  setQuery: (value: string) => void;
  setSort: (value: CourseSortOption) => void;
  setLevelFilter: (value: string) => void;
  filteredCourses: Course[];
  featuredCourses: Course[];
  stats: {
    totalCourses: number;
    totalStudents: number;
    totalCategories: number;
    avgRating: number;
  };
}

type CategoryWithCourses = Category & {
  courses: Course[];
};

const sorters: Record<CourseSortOption, (a: Course, b: Course) => number> = {
  جدیدترین: (a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  },
  "محبوب‌ترین": (a, b) => (b.rating || 0) - (a.rating || 0),
  "پرفروش‌ترین": (a, b) => (b.students || 0) - (a.students || 0),
};

export const useCoursesFilters = (
  categoriesWithCourses: CategoryWithCourses[]
): CoursesFiltersHook => {
  const [query, setQuery] = useState("");
  const [selectedSort, setSelectedSort] = useState<CourseSortOption>("جدیدترین");
  const [levelFilter, setLevelFilter] = useState("همه");

  // تبدیل دوره‌ها از ساختار دسته‌بندی به یک آرایه مسطح
  const allCourses = useMemo(() => {
    return categoriesWithCourses.flatMap((cat) => cat.courses);
  }, [categoriesWithCourses]);

  const sortOptions: CourseSortOption[] = ["جدیدترین", "محبوب‌ترین", "پرفروش‌ترین"];

  const filteredCourses = useMemo(() => {
    const normalizedQuery = query.trim();

    // تبدیل مقدار فارسی به enum
    const getLevelEnum = (persianLevel: string) => {
      const levelMap: Record<string, string> = {
        "مقدماتی": "BEGINNER",
        "متوسط": "INTERMEDIATE",
        "پیشرفته": "ADVANCED",
      };
      return levelMap[persianLevel];
    };

    return allCourses
      .filter((course) => course.published) // فقط دوره‌های منتشر شده
      .filter((course) => {
        if (levelFilter === "همه") return true;
        const enumLevel = getLevelEnum(levelFilter);
        return course.level === enumLevel;
      })
      .filter((course) =>
        normalizedQuery
          ? [course.subject, course.description, course.instructor]
              .filter(Boolean)
              .join("")
              .toLowerCase()
              .includes(normalizedQuery.toLowerCase())
          : true
      )
      .slice()
      .sort(sorters[selectedSort]);
  }, [allCourses, query, selectedSort, levelFilter]);

  const featuredCourses = useMemo(
    () =>
      allCourses
        .filter((course) => course.featured && course.published)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 6),
    [allCourses]
  );

  const stats = useMemo(() => {
    const publishedCourses = allCourses.filter((course) => course.published);
    const totalCourses = publishedCourses.length;
    const totalStudents = publishedCourses.reduce(
      (sum, course) => sum + (course.students || 0),
      0
    );
    const totalCategories = categoriesWithCourses.length;
    const avgRating =
      publishedCourses.reduce((sum, course) => sum + (course.rating || 0), 0) /
      (totalCourses || 1);

    return {
      totalCourses,
      totalStudents,
      totalCategories,
      avgRating: Math.round(avgRating * 10) / 10,
    };
  }, [allCourses, categoriesWithCourses]);

  return {
    sortOptions,
    query,
    selectedSort,
    levelFilter,
    setQuery,
    setSort: setSelectedSort,
    setLevelFilter,
    filteredCourses,
    featuredCourses,
    stats,
  };
};
