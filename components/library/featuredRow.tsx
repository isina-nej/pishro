"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BookCoverCard } from "./BookCoverCard";
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
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-lg font-bold text-slate-900">
            🌟 پیشنهادهای ویژه کتابخانه
          </h3>
          <p className="text-sm text-slate-500">
            کتاب‌هایی که بیشترین امتیاز و بازدید را این هفته داشته‌اند
          </p>
        </motion.div>
        <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
          مشاهده همه پیشنهادها
        </Button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
        {books.map((book, index) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex-shrink-0 w-48 snap-start h-full"
          >
            <BookCoverCard book={book} variant="featured" priority={index < 2} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
