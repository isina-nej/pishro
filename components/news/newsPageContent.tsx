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
            <p className="mt-4 text-gray-600">در حال بارگذاری اخبار...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-24">
      <NewsHero stats={stats} />

      <section className="relative -mt-16 z-10">
        <div className="container-xl space-y-12">
          <div className="rounded-3xl border border-white/30 bg-white/85 px-5 py-8 shadow-lg backdrop-blur">
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

            {/* Results Summary */}
            {hasActiveFilters && (
              <div className="mb-6 mt-8">
                <p className="text-sm text-slate-600">
                  {filteredNews.length > 0 ? (
                    <>
                      <span className="font-semibold text-slate-900">
                        {filteredNews.length}
                      </span>{" "}
                      خبر{" "}
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
                      هیچ خبری با این فیلترها یافت نشد
                    </span>
                  )}
                </p>
              </div>
            )}

            {/* News Grid */}
            {filteredNews.length > 0 ? (
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-x-[16px] xl:gap-x-[32px] gap-y-[20px] xl:gap-y-[40px]">
                {filteredNews.map((newsItem) => (
                  <NewsCard key={newsItem.id} data={newsItem} />
                ))}
              </div>
            ) : (
              <div className="flex min-h-[300px] items-center justify-center">
                <div className="text-center">
                  <p className="text-lg text-slate-500">
                    هیچ خبری برای نمایش وجود ندارد
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

export default NewsPageContent;
