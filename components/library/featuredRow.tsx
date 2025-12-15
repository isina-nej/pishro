"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LibraryBook } from "./data";

interface FeaturedRowProps {
  books: LibraryBook[];
}

export const FeaturedRow = ({ books }: FeaturedRowProps) => {
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
          <Link key={book.id} href={`/library/${book.slug}`}>
            <motion.div
              whileHover={{ y: -6 }}
              className="min-w-[220px] flex-1 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm cursor-pointer"
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
          </Link>
        ))}
      </div>
    </div>
  );
};
