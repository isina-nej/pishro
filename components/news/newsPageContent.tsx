"use client";

import React from "react";
import { motion } from "framer-motion";
import { useNewsList } from "@/lib/hooks/useNews";
import type { NewsArticle } from "@prisma/client";
import { useNewsFilters } from "./hooks/useNewsFilters";
import { NewsHero } from "./newsHero";
import { NewsFilterControls } from "./newsFilterControls";
import NewsCard from "./newsCard";
import { Sparkles } from "lucide-react";
import { useVisibility } from "@/components/site/VisibilityProvider";

type NewsQueryReturn = {
  data?: {
    items: NewsArticle[];
    total?: number;
  };
  isLoading: boolean;
  error?: Error | null;
};

const NewsPageContent = () => {
  const { show } = useVisibility();
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
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mx-auto h-12 w-12 rounded-full border-4 border-border border-t-mySecondary"
            />
            <p className="mt-4 text-sm text-muted-foreground dark:text-textSecondary">در حال بارگذاری اخبار...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-24">
      {show("news:hero") && <NewsHero stats={stats} />}

      <section className="container-xl -mt-32 pb-16 relative z-10">
        <div
          className={
            show("news:filters")
              ? "grid gap-10 lg:gap-12 xl:grid-cols-[340px_minmax(0,1fr)]"
              : "grid gap-10"
          }
        >
          {/* Sidebar */}
          {show("news:filters") && (
            <aside className="self-start">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="public-page-panel sticky top-28 rounded-[2rem] p-6 sm:p-8"
              >
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
              </motion.div>
            </aside>
          )}

          {/* Main Content */}
          {show("news:grid") && (
          <div className="space-y-8">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="public-page-panel rounded-[2rem] p-6 sm:p-8"
            >
              <div className="flex flex-col gap-4 sm:gap-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-2">
                      نمایش <span className="font-semibold text-muted-foreground">{filteredNews.length}</span> از <span className="font-semibold text-muted-foreground">{news.length}</span> خبر
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                      آخرین اخبار پیشرو
                    </h2>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    {stats.featured > 0 && (
                      <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-mySecondary/20 to-mySecondary/10 px-4 py-2">
                        <Sparkles className="w-4 h-4 text-mySecondary" />
                        <span className="text-xs sm:text-sm font-semibold text-mySecondary">
                          {stats.featured} خبر ویژه
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Search results info */}
                {query.trim().length > 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-muted-foreground pt-2 border-t border-border/50/50"
                  >
                    نتایج جستجو برای: <span className="font-semibold text-foreground">«{query}»</span>
                  </motion.p>
                )}
              </div>
            </motion.div>

            {/* News Grid */}
            {filteredNews.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
              >
                {filteredNews.map((newsItem, index) => (
                  <motion.div
                    key={newsItem.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <NewsCard
                      data={{
                        ...newsItem,
                        tags: (Array.isArray(newsItem.tags) ? newsItem.tags : []) as string[],
                        createdAt: newsItem.createdAt ?? new Date(),
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="public-page-panel rounded-[2rem] p-12 sm:p-16"
              >
                <div className="flex min-h-[320px] flex-col items-center justify-center gap-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-muted-foreground">
                      هیچ خبری پیدا نشد
                    </p>
                    <p className="max-w-sm text-sm text-muted-foreground mt-2">
                      متأسفانه با فیلترهای فعلی خبری برای نمایش وجود ندارد. سعی کنید فیلترها را تغییر دهید.
                    </p>
                  </div>
                  {hasActiveFilters && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleResetFilters}
                      className="mt-4 px-6 py-3 rounded-full bg-gradient-to-r from-mySecondary to-mySecondary/80 text-foreground font-medium text-sm transition-all duration-200 shadow-lg shadow-mySecondary/30 hover:shadow-xl hover:shadow-mySecondary/40"
                    >
                      حذف تمام فیلترها
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}
          </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default NewsPageContent;
