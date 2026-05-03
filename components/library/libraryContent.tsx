"use client";

import React from "react";
import { useBooksList } from "@/lib/hooks/useBooks";
import { libraryBooks, type LibraryBook } from "./data";
import { useLibraryFilters } from "./hooks/useLibraryFilters";
import { LibraryHero } from "./libraryHero";
import { FilterControls } from "./filterControls";
import { ResultsSummary } from "./resultsSummary";
import { FeaturedRow } from "./featuredRow";
import { CollectionsRow } from "./collectionsRow";
import { BookGrid } from "./bookGrid";
import { LoadingPlaceholder } from "./loadingPlaceholder";

type BooksQueryReturn = {
  data?: {
    items: LibraryBook[];
    total?: number;
  };
  isLoading: boolean;
  error?: Error | null;
  refetch?: () => Promise<unknown>;
};

const LibraryPageContent = () => {
  // Fetch books from API (با تایپ مشخص برای دسترسی به refetch)
  const { data: booksData, isLoading } = useBooksList({
    page: 1,
    limit: 100,
  }) as BooksQueryReturn;

  // اگر API داده داشت از اون استفاده کن، در غیر این صورت به mock (libraryBooks) برگرد
  const books = booksData?.items ?? libraryBooks;

  const {
    categories,
    formatOptions,
    sortOptions,
    query,
    selectedCategory,
    selectedFormat,
    selectedSort,
    setQuery,
    setCategory,
    setFormat,
    setSort,
    filteredBooks,
    featuredBooks,
    stats,
  } = useLibraryFilters(books as LibraryBook[]);

  const hasActiveFilters =
    query.trim().length > 0 ||
    selectedCategory !== "همه" ||
    selectedFormat !== "همه";

  const handleResetFilters = () => {
    setQuery("");
    setCategory("همه");
    setFormat("همه");
    setSort("جدیدترین");
  };

  return (
    <div className="w-full pb-24">
      {isLoading ? (
        <LoadingPlaceholder />
      ) : (
        <>
          <LibraryHero stats={stats} />

          <section className="relative -mt-16 z-10">
            <div className="container-xl space-y-12">
              <div className="rounded-3xl border border-white/30 bg-white/85 px-5 py-8 shadow-lg backdrop-blur">
                <FilterControls
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setCategory}
                  query={query}
                  onQueryChange={setQuery}
                  formatOptions={formatOptions}
                  selectedFormat={selectedFormat}
                  onFormatChange={setFormat}
                  sortOptions={sortOptions}
                  selectedSort={selectedSort}
                  onSortChange={setSort}
                  hasActiveFilters={hasActiveFilters}
                  onResetFilters={handleResetFilters}
                  disabled={false}
                />

                {hasActiveFilters ? (
                  <ResultsSummary query={query} count={filteredBooks.length} />
                ) : (
                  <>
                    <FeaturedRow books={featuredBooks} />
                    <CollectionsRow />
                  </>
                )}

                <BookGrid books={filteredBooks} />
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default LibraryPageContent;
