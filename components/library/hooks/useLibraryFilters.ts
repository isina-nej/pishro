"use client";

import { useMemo, useState } from "react";

import type {
  BookCategory,
  BookFormat,
  LibraryBook,
} from "../data";

export type SortOption = "جدیدترین" | "امتیاز برتر" | "پربازدید";

interface LibraryFiltersHook {
  categories: (BookCategory | "همه")[];
  formatOptions: (BookFormat | "همه")[];
  sortOptions: SortOption[];
  query: string;
  selectedCategory: BookCategory | "همه";
  selectedFormat: BookFormat | "همه";
  selectedSort: SortOption;
  setQuery: (value: string) => void;
  setCategory: (value: BookCategory | "همه") => void;
  setFormat: (value: BookFormat | "همه") => void;
  setSort: (value: SortOption) => void;
  filteredBooks: LibraryBook[];
  featuredBooks: LibraryBook[];
  stats: {
    totalBooks: number;
    highlighted: number;
    newReleases: number;
    avgRating: number;
  };
}

const sorters: Record<SortOption, (a: LibraryBook, b: LibraryBook) => number> = {
  جدیدترین: (a, b) => b.year - a.year,
  "امتیاز برتر": (a, b) => b.rating - a.rating,
  پربازدید: (a, b) => b.popularity - a.popularity,
};

export const useLibraryFilters = (books: LibraryBook[]): LibraryFiltersHook => {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<BookCategory | "همه">(
    "همه"
  );
  const [selectedFormat, setSelectedFormat] = useState<BookFormat | "همه">(
    "همه"
  );
  const [selectedSort, setSelectedSort] = useState<SortOption>("جدیدترین");

  const categories = useMemo<(BookCategory | "همه")[]>(() => {
    const unique = new Set<BookCategory>();
    books.forEach((book) => unique.add(book.category));
    return ["همه", ...Array.from(unique)];
  }, [books]);

  const formatOptions = useMemo<(BookFormat | "همه")[]>(() => {
    const unique = new Set<BookFormat>();
    books.forEach((book) => book.formats.forEach((format) => unique.add(format)));
    return ["همه", ...Array.from(unique)];
  }, [books]);

  const sortOptions: SortOption[] = ["جدیدترین", "امتیاز برتر", "پربازدید"];

  const filteredBooks = useMemo(() => {
    const normalizedQuery = query.trim();

    return books
      .filter((book) =>
        selectedCategory === "همه" ? true : book.category === selectedCategory
      )
      .filter((book) =>
        selectedFormat === "همه"
          ? true
          : book.formats.some((format) => format === selectedFormat)
      )
      .filter((book) =>
        normalizedQuery
          ? [book.title, book.author, ...book.tags]
              .join(" ")
              .toLowerCase()
              .includes(normalizedQuery.toLowerCase())
          : true
      )
      .slice()
      .sort(sorters[selectedSort]);
  }, [books, selectedCategory, selectedFormat, query, selectedSort]);

  const featuredBooks = useMemo(
    () =>
      books
        .filter((book) => book.isFeatured)
        .sort((a, b) => b.rating - a.rating || b.popularity - a.popularity)
        .slice(0, 6),
    [books]
  );

  const stats = useMemo(() => {
    const totalBooks = books.length;
    const highlighted = books.filter((book) => book.status !== "ویژه").length;
    const newReleases = books.filter((book) => book.year >= 2024).length;
    const avgRating =
      books.reduce((sum, book) => sum + book.rating, 0) / (totalBooks || 1);

    return {
      totalBooks,
      highlighted,
      newReleases,
      avgRating,
    };
  }, [books]);

  return {
    categories,
    formatOptions,
    sortOptions,
    query,
    selectedCategory,
    selectedFormat,
    selectedSort,
    setQuery,
    setCategory: setSelectedCategory,
    setFormat: setSelectedFormat,
    setSort: setSelectedSort,
    filteredBooks,
    featuredBooks,
    stats,
  };
};


