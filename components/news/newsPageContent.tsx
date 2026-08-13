"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNewsList } from "@/lib/hooks/useNews";
import type { NewsArticle } from "@prisma/client";
import { useNewsFilters } from "./hooks/useNewsFilters";
import { NewsHero } from "./newsHero";
import { NewsFilterControls } from "./newsFilterControls";
import NewsCard from "./newsCard";
import { Sparkles } from "lucide-react";
import { useVisibility } from "@/components/site/VisibilityProvider";
import { cn } from "@/lib/utils";

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
  const { data: newsData, isLoading } = useNewsList({
    page: 1,
    limit: 100,
  }) as NewsQueryReturn;

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

  const filtersVisible = show("news:filters");

  if (isLoading) {
    return (
      <div className="w-full pb-24">
        <div className="flex min-h-[320px] items-center justify-center">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mx-auto h-10 w-10 rounded-full border-4 border-border border-t-primary"
            />
            <p className="mt-4 text-sm text-muted-foreground">
              در حال بارگذاری اخبار...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const filterProps = {
    categories,
    selectedCategory,
    onCategoryChange: setCategory,
    query,
    onQueryChange: setQuery,
    sortOptions,
    selectedSort,
    onSortChange: setSort,
    timeRange,
    onTimeRangeChange: setTimeRange,
    hasActiveFilters,
    onResetFilters: handleResetFilters,
    disabled: false,
  };

  return (
    <div className="w-full pb-20">
      {show("news:hero") && <NewsHero stats={stats} />}

      <section
        className={cn(
          "container-xl relative z-10 -mt-10 pb-12 sm:-mt-12",
          filtersVisible && hasActiveFilters && "lg:ps-[248px]"
        )}
      >
        <div
          className={cn(
            "grid gap-5 lg:gap-6",
            filtersVisible && !hasActiveFilters
              ? "xl:grid-cols-[280px_minmax(0,1fr)]"
              : "grid-cols-1"
          )}
        >
          {/* Idle filter: sticky sidebar at top */}
          {filtersVisible && !hasActiveFilters && (
            <aside className="self-start">
              <div className="sticky top-24 rounded-3xl border border-white/15 bg-white/10 p-4 shadow-xl backdrop-blur-2xl dark:bg-black/30 sm:p-5">
                <NewsFilterControls {...filterProps} compact={false} />
              </div>
            </aside>
          )}

          {show("news:grid") && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/50 bg-card/70 px-4 py-3 backdrop-blur-xl">
                <div>
                  <p className="text-xs text-muted-foreground">
                    نمایش{" "}
                    <span className="font-semibold text-foreground">
                      {filteredNews.length}
                    </span>{" "}
                    از{" "}
                    <span className="font-semibold text-foreground">
                      {news.length}
                    </span>{" "}
                    خبر
                  </p>
                  <h2 className="text-lg font-bold text-foreground sm:text-xl">
                    آخرین اخبار پیشرو
                  </h2>
                </div>
                {stats.featured > 0 && (
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5">
                    <Sparkles className="size-3.5 text-primary" />
                    <span className="text-xs font-semibold text-primary">
                      {stats.featured} خبر ویژه
                    </span>
                  </div>
                )}
                {query.trim().length > 0 && (
                  <p className="w-full text-xs text-muted-foreground">
                    نتایج برای:{" "}
                    <span className="font-semibold text-foreground">
                      «{query}»
                    </span>
                  </p>
                )}
              </div>

              {filteredNews.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                  {filteredNews.map((newsItem) => (
                    <NewsCard
                      key={newsItem.id}
                      data={{
                        ...newsItem,
                        tags: (Array.isArray(newsItem.tags)
                          ? newsItem.tags
                          : []) as string[],
                        createdAt: newsItem.createdAt ?? new Date(),
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-border/50 bg-card/70 p-10 text-center backdrop-blur-xl">
                  <p className="text-base font-semibold text-foreground">
                    هیچ خبری پیدا نشد
                  </p>
                  <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                    با فیلترهای فعلی خبری نیست. فیلترها را تغییر دهید یا پاک
                    کنید.
                  </p>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="mt-5 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform duration-300 hover:scale-105"
                    >
                      حذف تمام فیلترها
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Active filter: compact floating left popup — doesn't cover news */}
      <AnimatePresence>
        {filtersVisible && hasActiveFilters && (
          <motion.aside
            initial={{ opacity: 0, x: -24, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -24, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none fixed inset-y-0 start-0 z-40 hidden items-center pl-3 lg:flex"
          >
            <div className="pointer-events-auto w-[220px] rounded-3xl border border-white/20 bg-background/75 p-3 shadow-2xl shadow-black/20 backdrop-blur-2xl">
              <NewsFilterControls {...filterProps} compact />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile sticky compact filter when active */}
      <AnimatePresence>
        {filtersVisible && hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed inset-x-3 bottom-3 z-40 lg:hidden"
          >
            <div className="max-h-[42vh] overflow-y-auto rounded-3xl border border-white/20 bg-background/85 p-3 shadow-2xl backdrop-blur-2xl">
              <NewsFilterControls {...filterProps} compact />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewsPageContent;
