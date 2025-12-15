"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import type { LibraryBook } from "./data";

interface BookGridProps {
  books: LibraryBook[];
}

export const BookGrid = ({ books }: BookGridProps) => {
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
        <Link key={book.id} href={`/library/${book.slug}`}>
          <motion.div
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm cursor-pointer"
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
        </Link>
      ))}
    </div>
  );
};
