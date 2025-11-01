"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Bookmark, BookOpen, Clock, Search, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import {
  curatedCollections,
  libraryBooks,
  type BookCategory,
  type BookFormat,
  type LibraryBook,
} from "./data";
import { useLibraryFilters, type SortOption } from "./hooks/useLibraryFilters";

const LibraryPageContent = () => {
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
  } = useLibraryFilters(libraryBooks);

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
      <LibraryHero query={query} onQueryChange={setQuery} stats={stats} />

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
    </div>
  );
};

export default LibraryPageContent;

// -------------------------------------------------
// Sections
// -------------------------------------------------

const LibraryHero = ({
  query,
  onQueryChange,
  stats,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  stats: {
    totalBooks: number;
    highlighted: number;
    newReleases: number;
    avgRating: number;
  };
}) => {
  return (
    <section className="relative overflow-hidden bg-[#0d1b2a] pb-32 pt-36 text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/40 to-slate-900/80" />
      <div className="absolute -left-10 top-24 h-64 w-64 rounded-full bg-sky-500/30 blur-3xl" />
      <div className="absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />

      <div className="container-xl relative z-10 flex flex-col gap-10">
        <div className="max-w-3xl space-y-6">
          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-medium text-slate-100">
            کتابخانه الهام‌بخش پیشرو
          </span>
          <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
            دنیای کتاب‌هایی که ذهنیت سرمایه‌گذاران آینده را می‌سازند
          </h1>
          <p className="text-base text-slate-200 md:text-lg">
            مجموعه‌ای منتخب از کتاب‌های داستانی و تخصصی که با دقت توسط تیم
            محتوای پیشرو انتخاب شده‌اند تا شما را در مسیر رشد شخصی، حرفه‌ای و
            خلاقانه همراهی کنند.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300" />
              <Input
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                placeholder="جستجوی عنوان، نویسنده یا برچسب"
                className="h-12 rounded-2xl border-white/20 bg-white/10 pr-12 text-white placeholder:text-slate-300 focus-visible:ring-white"
              />
            </div>
            <Button
              variant="secondary"
              className="h-12 rounded-2xl bg-white/15 text-white hover:bg-white/25"
            >
              کاوش هوشمند کتابخانه
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "کتاب در دسترس",
              value: stats.totalBooks,
              icon: <BookOpen className="h-5 w-5" />,
            },
            {
              label: "منتخب تحریریه",
              value: stats.highlighted,
              icon: <Bookmark className="h-5 w-5" />,
            },
            {
              label: "انتشار سال جاری",
              value: stats.newReleases,
              icon: <Clock className="h-5 w-5" />,
            },
            {
              label: "میانگین امتیاز",
              value: stats.avgRating.toFixed(1),
              icon: <Star className="h-5 w-5" />,
            },
          ].map((item) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-5 py-4 backdrop-blur"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white">
                {item.icon}
              </span>
              <div className="flex flex-col">
                <span className="text-lg font-semibold">{item.value}</span>
                <span className="text-sm text-slate-200">{item.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FilterControls = ({
  categories,
  selectedCategory,
  onCategoryChange,
  query,
  onQueryChange,
  formatOptions,
  selectedFormat,
  onFormatChange,
  sortOptions,
  selectedSort,
  onSortChange,
  hasActiveFilters,
  onResetFilters,
}: {
  categories: (BookCategory | "همه")[];
  selectedCategory: BookCategory | "همه";
  onCategoryChange: (value: BookCategory | "همه") => void;
  query: string;
  onQueryChange: (value: string) => void;
  formatOptions: (BookFormat | "همه")[];
  selectedFormat: BookFormat | "همه";
  onFormatChange: (value: BookFormat | "همه") => void;
  sortOptions: SortOption[];
  selectedSort: SortOption;
  onSortChange: (value: SortOption) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}) => {
  return (
    <div className="flex flex-col gap-6 border-b border-slate-200 pb-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <h2 className="text-xl font-bold text-slate-900">کتاب‌ها</h2>
          <p className="text-sm text-slate-500">
            کتابخانه را بر اساس علاقه خود فیلتر کنید و پیشنهادهای جدید را
            ببینید.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Select value={selectedFormat} onValueChange={onFormatChange}>
            <SelectTrigger className="w-full min-w-[180px] rounded-2xl border-slate-200 bg-white">
              <SelectValue placeholder="فرمت" />
            </SelectTrigger>
            <SelectContent>
              {formatOptions.map((format) => (
                <SelectItem key={format} value={format}>
                  {format}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedSort} onValueChange={onSortChange}>
            <SelectTrigger className="w-full min-w-[180px] rounded-2xl border-slate-200 bg-white">
              <SelectValue placeholder="مرتب‌سازی" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            className="w-full bg-transparent text-sm text-slate-600 outline-none"
            placeholder="جستجوی سریع در بین کتاب‌ها"
          />
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="whitespace-nowrap text-xs font-semibold text-slate-500 transition-colors hover:text-slate-800"
            >
              حذف فیلترها
            </button>
          )}
        </div>

        <div className="flex gap-3 overflow-x-auto pb-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={cn(
                "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all",
                selectedCategory === category
                  ? "border-slate-900 bg-slate-900 text-white shadow"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const ResultsSummary = ({ query, count }: { query: string; count: number }) => {
  const hasQuery = query.trim().length > 0;

  return (
    <div className="mt-8 rounded-2xl border border-slate-200 bg-white px-4 py-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-slate-900">
          {hasQuery ? `نتایج جستجو برای "${query.trim()}"` : "نتایج فیلتر شده"}
        </h3>
        <span className="text-sm text-slate-500">
          {count > 0
            ? `${count} عنوان مطابق با فیلترهای شما یافت شد.`
            : "موردی مطابق فیلترها پیدا نشد."}
        </span>
      </div>
    </div>
  );
};

const FeaturedRow = ({ books }: { books: LibraryBook[] }) => {
  if (!books.length) {
    return null;
  }

  return (
    <div className="mt-8 space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            پیشنهاد ویژه کتابخانه
          </h3>
          <p className="text-sm text-slate-500">
            کتاب‌هایی که بیشترین امتیاز و بازدید را این هفته داشته‌اند.
          </p>
        </div>
        <Button variant="ghost" className="text-slate-600">
          مشاهده همه پیشنهادها
        </Button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {books.map((book) => (
          <motion.div
            key={book.id}
            whileHover={{ y: -6 }}
            className="min-w-[220px] flex-1 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="relative mb-4 h-40 overflow-hidden rounded-2xl">
              <Image
                src={book.cover}
                alt={book.title}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 240px, 60vw"
                priority
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3 text-sm text-white">
                <div className="flex items-center justify-between">
                  <span>{book.category}</span>
                  <span className="flex items-center gap-1 text-xs">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {book.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
            <h4 className="text-base font-semibold text-slate-900">
              {book.title}
            </h4>
            <p className="mt-1 text-sm text-slate-500">{book.author}</p>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span>{book.year}</span>
              <span>{book.readingTime}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const CollectionsRow = () => {
  return (
    <div className="mt-10 grid gap-4 lg:grid-cols-3">
      {curatedCollections.map((collection) => (
        <div
          key={collection.id}
          className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 text-white"
        >
          <div
            className={cn(
              "absolute inset-0 opacity-80 blur-2xl transition-opacity group-hover:opacity-100",
              `bg-gradient-to-br ${collection.accent}`
            )}
          />
          <div className="relative z-10 space-y-3 p-6">
            <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/80">
              مجموعه منتخب
            </span>
            <h4 className="text-lg font-bold leading-7">{collection.title}</h4>
            <p className="text-sm text-slate-200/90">
              {collection.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

const BookGrid = ({ books }: { books: LibraryBook[] }) => {
  if (!books.length) {
    return (
      <div className="mt-16 flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
        <h4 className="text-lg font-semibold text-slate-700">
          کتابی با این مشخصات پیدا نکردیم
        </h4>
        <p className="max-w-md text-sm text-slate-500">
          فیلترهای فعال را تغییر دهید یا دسته‌بندی دیگری را انتخاب کنید. ما هر
          هفته کتاب‌های جدیدی به کتابخانه اضافه می‌کنیم.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {books.map((book) => (
        <motion.div
          key={book.id}
          whileHover={{ y: -8 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="relative h-72 overflow-hidden">
            <Image
              src={book.cover}
              alt={book.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 1280px) 360px, (min-width: 1024px) 320px, 80vw"
            />
            <div className="absolute inset-x-0 top-0 flex justify-between p-4">
              <span className="rounded-full bg-black/65 px-3 py-1 text-xs text-white">
                {book.status}
              </span>
              <span className="rounded-full bg-black/65 px-3 py-1 text-xs text-white">
                {book.rating.toFixed(1)}
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 text-white">
              <p className="text-sm font-medium">{book.category}</p>
            </div>
          </div>

          <div className="space-y-3 p-5">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">{book.title}</h3>
              <p className="text-sm text-slate-500">{book.author}</p>
            </div>
            <p className="text-sm leading-6 text-slate-600 line-clamp-3">
              {book.description}
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              {book.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-slate-100 px-3 py-1 text-slate-600"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {book.formats.join("، ")}
              </span>
              <span>{book.year}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
