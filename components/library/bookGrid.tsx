"use client";

import type { LibraryBook } from "./data";
import { BookCoverCard } from "./BookCoverCard";

interface BookGridProps {
  books: LibraryBook[];
}

export const BookGrid = ({ books }: BookGridProps) => {
  if (!books.length) {
    return (
      <div className="mt-16 flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
        <h4 className="text-lg font-semibold text-slate-700 dark:text-textSecondary">
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
    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-max">
      {books.map((book) => (
        <BookCoverCard key={book.id} book={book} variant="grid" />
      ))}
    </div>
  );
};

