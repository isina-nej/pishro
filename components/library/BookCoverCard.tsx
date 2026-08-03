"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star, BookOpen, TrendingUp } from "lucide-react";
import BookmarkButton from "@/components/bookmarks/bookmarkButton";
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
        className="group relative overflow-hidden rounded-2xl border border-border bg-card dark:bg-cardBg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col h-full"
      >
        {/* Cover Image Container - Proper Aspect Ratio */}
        <div className={`relative ${getAspectRatio()} overflow-hidden bg-gradient-to-br from-muted to-muted flex-shrink-0 w-full`}>
          {book.cover && (
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
                  : "(min-width: 1280px) 360px, 1024px) 320px, 80vw"
              }
              priority={priority}
              quality={85}
            />
          )}

          {/* Gradient Overlays - Subtle */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/30" />

          {/* Top Status Badge */}
          <motion.div
            className="absolute top-0 right-0 left-0 flex justify-between p-3"
            variants={badgeVariants}
          >
            <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-accent/95 to-accent/95 px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-lg backdrop-blur-sm border border-accent/30">
              <TrendingUp className="h-3 w-3" />
              {book.status}
            </div>

            <div className="flex items-center gap-2">
              <BookmarkButton
                type="book"
                itemId={book.id}
                className="size-8 border-border/30 bg-card/90 backdrop-blur-sm/80"
              />

              {/* Rating Badge */}
              <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-premium/95 to-premium/95 px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-lg backdrop-blur-sm border border-premium/30">
                <Star className="h-3.5 w-3.5 fill-white" />
                {book.rating.toFixed(1)}
              </div>
            </div>
          </motion.div>

          {/* Category Overlay - Bottom - More Transparent */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/60 via-background/20 to-transparent p-4 text-primary-foreground">
            <p className="text-xs font-semibold text-premium mb-1 uppercase tracking-wider">
              {book.category}
            </p>
            <p className="text-sm font-bold line-clamp-2">{book.title}</p>
          </div>
        </div>

        {/* Content Section - Only for grid variant */}
        {variant === "grid" && (
          <div className="flex-grow flex flex-col p-5 space-y-3 bg-card dark:bg-cardBg">
            <div className="space-y-1">
              <h3 className="font-bold text-foreground text-lg line-clamp-2">
                {book.title}
              </h3>
              <p className="text-sm text-muted-foreground font-medium">{book.author}</p>
            </div>

            {/* Description */}
            <p className="text-xs leading-5 text-muted-foreground line-clamp-2 flex-grow">
              {book.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {book.tags && book.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gradient-to-r from-primary to-accent px-2.5 py-1 text-xs font-medium text-muted-foreground dark:text-textSecondary border border-primary"
                >
                  #{tag}
                </span>
              ))}
              {book.tags && book.tags.length > 2 && (
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  +{book.tags.length - 2}
                </span>
              )}
            </div>

            {/* Footer Stats */}
            <div className="flex items-center justify-between gap-2 border-t border-border pt-3 mt-auto">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <BookOpen className="h-3.5 w-3.5" />
                <span>{book.votes.toLocaleString('fa')} رای</span>
              </div>
              <div className="text-xs font-medium text-muted-foreground dark:text-textSecondary bg-muted px-2 py-1 rounded">
                {book.year}
              </div>
            </div>
          </div>
        )}

        {/* Featured/Compact Variant - Minimal Info */}
        {(variant === "featured" || variant === "compact") && (
          <div className="p-3 space-y-2 bg-card dark:bg-cardBg">
            <h4 className="font-semibold text-foreground text-base line-clamp-2">
              {book.title}
            </h4>
            <p className="text-xs text-muted-foreground line-clamp-1">{book.author}</p>
            {variant === "featured" && (
              <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
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
