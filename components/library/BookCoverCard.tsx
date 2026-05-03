"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star, BookOpen, TrendingUp } from "lucide-react";
import type { LibraryBook } from "./data";

interface BookCoverCardProps {
  book: LibraryBook;
  variant?: "grid" | "featured" | "compact";
  priority?: boolean;
}

export const BookCoverCard = ({
  book,
  variant = "grid",
  priority = false,
}: BookCoverCardProps) => {
  const containerVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.02, y: -8 },
  };

  const badgeVariants = {
    rest: { opacity: 0.8 },
    hover: { opacity: 1 },
  };

  // Aspect ratio برای کاور کتاب (3:4 - standard book cover)
  const getAspectRatio = () => {
    switch (variant) {
      case "featured":
        return "aspect-[3/4]";
      case "compact":
        return "aspect-[3/4]";
      case "grid":
      default:
        return "aspect-[3/4]";
    }
  };



  return (
    <Link href={`/library/${book.slug}`}>
      <motion.div
        initial="rest"
        whileHover="hover"
        variants={containerVariants}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col h-full"
      >
        {/* Cover Image Container - Proper Aspect Ratio */}
        <div className={`relative ${getAspectRatio()} overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 flex-shrink-0 w-full`}>
          <Image
            src={book.cover}
            alt={book.title}
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-105"
            sizes={
              variant === "featured"
                ? "(min-width: 1024px) 220px, 50vw"
                : variant === "compact"
                ? "(min-width: 768px) 140px, 40vw"
                : "(min-width: 1280px) 360px, (min-width: 1024px) 320px, 80vw"
            }
            priority={priority}
            quality={85}
          />

          {/* Gradient Overlays - Subtle */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />

          {/* Top Status Badge */}
          <motion.div
            className="absolute top-0 right-0 left-0 flex justify-between p-3"
            variants={badgeVariants}
          >
            <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-purple-600/95 to-purple-700/95 px-3 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-sm border border-purple-500/30">
              <TrendingUp className="h-3 w-3" />
              {book.status}
            </div>

            {/* Rating Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500/95 to-orange-500/95 px-3 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-sm border border-amber-400/30">
              <Star className="h-3.5 w-3.5 fill-white" />
              {book.rating.toFixed(1)}
            </div>
          </motion.div>

          {/* Category Overlay - Bottom - More Transparent */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4 text-white">
            <p className="text-xs font-semibold text-amber-300 mb-1 uppercase tracking-wider">
              {book.category}
            </p>
            <p className="text-sm font-bold line-clamp-2">{book.title}</p>
          </div>
        </div>

        {/* Content Section - Only for grid variant */}
        {variant === "grid" && (
          <div className="flex-grow flex flex-col p-5 space-y-3 bg-white">
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-lg line-clamp-2">
                {book.title}
              </h3>
              <p className="text-sm text-slate-600 font-medium">{book.author}</p>
            </div>

            {/* Description */}
            <p className="text-xs leading-5 text-slate-600 line-clamp-2 flex-grow">
              {book.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {book.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gradient-to-r from-blue-50 to-purple-50 px-2.5 py-1 text-xs font-medium text-slate-700 border border-blue-100"
                >
                  #{tag}
                </span>
              ))}
              {book.tags.length > 2 && (
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  +{book.tags.length - 2}
                </span>
              )}
            </div>

            {/* Footer Stats */}
            <div className="flex items-center justify-between gap-2 border-t border-slate-200 pt-3 mt-auto">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <BookOpen className="h-3.5 w-3.5" />
                <span>{book.votes.toLocaleString('fa')} رای</span>
              </div>
              <div className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded">
                {book.year}
              </div>
            </div>
          </div>
        )}

        {/* Featured/Compact Variant - Minimal Info */}
        {(variant === "featured" || variant === "compact") && (
          <div className="p-3 space-y-2 bg-white">
            <h4 className="font-semibold text-slate-900 text-base line-clamp-2">
              {book.title}
            </h4>
            <p className="text-xs text-slate-600 line-clamp-1">{book.author}</p>
            {variant === "featured" && (
              <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                <span>{book.year}</span>
                <span className="font-medium">{book.readingTime}</span>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </Link>
  );
};
