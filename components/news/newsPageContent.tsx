"use client";

import React from "react";
import { useNewsList } from "@/lib/hooks/useNews";
import type { NewsArticle } from "@prisma/client";
import { useNewsFilters } from "./hooks/useNewsFilters";
import { NewsHero } from "./newsHero";
import { NewsFilterControls } from "./newsFilterControls";
import NewsCard from "./newsCard";

type NewsQueryReturn = {
  data?: {
    items: NewsArticle[];
    total?: number;
  };
  isLoading: boolean;
  error?: Error | null;
};

const NewsPageContent = () => {
  // Fetch news from API
  const { data: newsData, isLoading } = useNewsList({
    page: 1,
    limit: 100,
  }) as NewsQueryReturn;

  // استفاده از داده‌های API
  const news = newsData?.items ?? [];

  const {
    categories,
    sortOptions,
    query,
    selectedCategory,
    selectedSort,
    timeRange,
    setQuery,
    setCategory,
    setSort,
    setTimeRange,
    filteredNews,
    stats,
  } = useNewsFilters(news);

  const hasActiveFilters =
    query.trim().length > 0 ||
    selectedCategory !== "همه" ||
    timeRange !== "همه";

  const handleResetFilters = () => {
    setQuery("");
    setCategory("همه");
    setSort("جدیدترین");
    setTimeRange("همه");
  };

  if (isLoading) {
    return (
      <div className="w-full pb-24">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600 dark:text-textSecondary">در حال بارگذاری اخبار...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-24">
      <NewsHero stats={stats} />

      <section className="container-xl -mt-20 pb-12">
        <div className="grid gap-8 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="self-start">
            <div className="sticky top-24 rounded-3xl border border-white/30 bg-white dark:bg-cardBg p-6 shadow-lg shadow-slate-200/10">
              <NewsFilterControls
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setCategory}
                query={query}
                onQueryChange={setQuery}
                sortOptions={sortOptions}
                selectedSort={selectedSort}
                onSortChange={setSort}
                timeRange={timeRange}
                onTimeRangeChange={setTimeRange}
                hasActiveFilters={hasActiveFilters}
                onResetFilters={handleResetFilters}
                disabled={false}
              />
            </div>
          </aside>

          <div className="space-y-7">
            <div className="rounded-3xl border border-white/30 bg-white dark:bg-cardBg p-6 shadow-lg shadow-slate-200/10">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    نمایش {filteredNews.length} خبر از بین {news.length} خبر موجود
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                    آخرین اخبار پیشرو
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {hasActiveFilters && (
                    <button
                      onClick={handleResetFilters}
                      className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                      حذف فیلترها
                    </button>
                  )}
                  <span className="rounded-full bg-mySecondary/10 px-3 py-2 text-xs font-semibold text-mySecondary">
                    {stats.featured} خبر ویژه
                  </span>
                </div>
              </div>

              {query.trim().length > 0 && (
                <p className="mt-4 text-sm text-slate-600">
                  نتایج جستجو برای «<span className="font-semibold text-slate-900">{query}</span>»
                </p>
              )}
            </div>

            {filteredNews.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {filteredNews.map((newsItem) => (
                  <NewsCard
                    key={newsItem.id}
                    data={{
                      ...newsItem,
                      tags: (Array.isArray(newsItem.tags) ? newsItem.tags : []) as string[],
                    } as any}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-white/30 bg-white dark:bg-cardBg p-10 shadow-lg shadow-slate-200/10">
                <div className="flex min-h-[260px] flex-col items-center justify-center gap-4 text-center">
                  <p className="text-lg font-medium text-slate-600">
                    هیچ خبری مطابق با فیلترهای شما پیدا نشد.
                  </p>
                  <p className="max-w-md text-sm text-slate-500">
                    می‌توانید فیلترها را تغییر دهید یا روی دکمه زیر کلیک کنید تا همه اخبار را ببینید.
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={handleResetFilters}
                      className="rounded-full border border-slate-300 bg-white px-6 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      بازنشانی فیلترها
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

export default NewsPageContent;
