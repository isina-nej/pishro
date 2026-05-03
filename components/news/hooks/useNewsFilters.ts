"use client";

import { useMemo, useState } from "react";
import type { NewsArticle } from "@prisma/client";

export type NewsSortOption = "جدیدترین" | "پربازدیدترین" | "محبوب‌ترین";

export interface NewsFiltersHook {
  categories: string[];
  sortOptions: NewsSortOption[];
  query: string;
  selectedCategory: string;
  selectedSort: NewsSortOption;
  timeRange: string;
  setQuery: (value: string) => void;
  setCategory: (value: string) => void;
  setSort: (value: NewsSortOption) => void;
  setTimeRange: (value: string) => void;
  filteredNews: NewsArticle[];
  featuredNews: NewsArticle[];
  stats: {
    totalNews: number;
    featured: number;
    thisMonth: number;
    avgViews: number;
  };
}

const sorters: Record<NewsSortOption, (a: NewsArticle, b: NewsArticle) => number> = {
  جدیدترین: (a, b) => {
    const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return dateB - dateA;
  },
  پربازدیدترین: (a, b) => b.views - a.views,
  "محبوب‌ترین": (a, b) => b.likes - a.likes,
};

export const useNewsFilters = (news: NewsArticle[]): NewsFiltersHook => {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("همه");
  const [selectedSort, setSelectedSort] = useState<NewsSortOption>("جدیدترین");
  const [timeRange, setTimeRange] = useState("همه");

  const categories = useMemo<string[]>(() => {
    const unique = new Set<string>();
    news.forEach((item) => {
      if (item.category) unique.add(item.category);
    });
    return ["همه", ...Array.from(unique)];
  }, [news]);

  const sortOptions: NewsSortOption[] = ["جدیدترین", "پربازدیدترین", "محبوب‌ترین"];

  const filteredNews = useMemo(() => {
    const normalizedQuery = query.trim();
    const now = new Date();

    return news
      .filter((item) => item.published) // فقط اخبار منتشر شده
      .filter((item) =>
        selectedCategory === "همه" ? true : item.category === selectedCategory
      )
      .filter((item) => {
        if (timeRange === "همه") return true;
        if (!item.publishedAt) return false;

        const publishedDate = new Date(item.publishedAt);
        const diffTime = now.getTime() - publishedDate.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        switch (timeRange) {
          case "امروز":
            return diffDays < 1;
          case "هفته":
            return diffDays < 7;
          case "ماه":
            return diffDays < 30;
          case "سال":
            return diffDays < 365;
          default:
            return true;
        }
      })
      .filter((item) =>
        normalizedQuery
          ? [item.title, item.excerpt, item.author, ...item.tags]
              .filter(Boolean)
              .join(" ")
              .toLowerCase()
              .includes(normalizedQuery.toLowerCase())
          : true
      )
      .slice()
      .sort(sorters[selectedSort]);
  }, [news, selectedCategory, query, selectedSort, timeRange]);

  const featuredNews = useMemo(
    () =>
      news
        .filter((item) => item.featured && item.published)
        .sort((a, b) => b.views - a.views || b.likes - a.likes)
        .slice(0, 6),
    [news]
  );

  const stats = useMemo(() => {
    const publishedNews = news.filter((item) => item.published);
    const totalNews = publishedNews.length;
    const featured = publishedNews.filter((item) => item.featured).length;

    const now = new Date();
    const thisMonth = publishedNews.filter((item) => {
      if (!item.publishedAt) return false;
      const publishedDate = new Date(item.publishedAt);
      return (
        publishedDate.getMonth() === now.getMonth() &&
        publishedDate.getFullYear() === now.getFullYear()
      );
    }).length;

    const avgViews =
      publishedNews.reduce((sum, item) => sum + item.views, 0) / (totalNews || 1);

    return {
      totalNews,
      featured,
      thisMonth,
      avgViews: Math.round(avgViews),
    };
  }, [news]);

  return {
    categories,
    sortOptions,
    query,
    selectedCategory,
    selectedSort,
    timeRange,
    setQuery,
    setCategory: setSelectedCategory,
    setSort: setSelectedSort,
    setTimeRange,
    filteredNews,
    featuredNews,
    stats,
  };
};
