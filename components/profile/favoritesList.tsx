"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, GraduationCap, Newspaper, Trash2 } from "lucide-react";
import ProfileHeader from "./header";
import EmptyState from "./emptyState";
import { cn } from "@/lib/utils";
import { useBookmarks, useToggleBookmark } from "@/lib/hooks/useBookmarks";
import type { BookmarkType } from "@/lib/schemas/bookmark-schema";
import type { BookmarkItem } from "@/lib/types/bookmark";

type FilterKey = "all" | BookmarkType;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "همه" },
  { key: "course", label: "دوره‌ها" },
  { key: "news", label: "اخبار" },
  { key: "book", label: "کتاب‌ها" },
];

const TYPE_META: Record<BookmarkType, { label: string; icon: typeof BookOpen }> = {
  course: { label: "دوره", icon: GraduationCap },
  news: { label: "خبر", icon: Newspaper },
  book: { label: "کتاب", icon: BookOpen },
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));

const BookmarkCard = ({ item }: { item: BookmarkItem }) => {
  const toggle = useToggleBookmark();
  const { label, icon: Icon } = TYPE_META[item.type];

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md">
      <Link href={item.href} className="relative block h-36 w-full bg-muted">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <span className="flex h-full items-center justify-center text-muted-foreground">
            <Icon className="size-8" />
          </span>
        )}
        <span className="absolute right-2 top-2 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-bold text-foreground">
          {label}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link
          href={item.href}
          className="line-clamp-2 text-sm font-medium text-foreground hover:text-primary"
        >
          {item.title}
        </Link>

        {item.subtitle && (
          <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
            {item.subtitle}
          </p>
        )}

        {item.badge && (
          <span className="mt-3 inline-flex w-fit rounded-md bg-muted px-2 py-1 text-[11px] text-muted-foreground">
            {item.badge}
          </span>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 pt-4 text-xs text-muted-foreground">
          <span className="font-irsans">{formatDate(item.createdAt)}</span>
          <button
            type="button"
            onClick={() =>
              toggle.mutate({
                type: item.type,
                itemId: item.itemId,
                bookmarked: true,
              })
            }
            disabled={toggle.isPending}
            aria-label="حذف از لیست"
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-destructive transition hover:bg-destructive/10 disabled:opacity-60"
          >
            <Trash2 className="size-3.5" />
            حذف
          </button>
        </div>
      </div>
    </div>
  );
};

const FavoritesList = () => {
  const [filter, setFilter] = useState<FilterKey>("all");
  const { data, isLoading } = useBookmarks();

  const items = useMemo(() => data ?? [], [data]);
  const visibleItems = useMemo(
    () => (filter === "all" ? items : items.filter((item) => item.type === filter)),
    [items, filter]
  );

  // ===== Loading State =====
  if (isLoading) {
    return (
      <div className="mb-8 flex items-center justify-center rounded-md bg-card p-10 shadow">
        <div className="relative">
          <div className="size-10 rounded-full border-4 border-muted" />
          <div className="absolute left-0 top-0 size-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  // ===== Empty State =====
  if (items.length === 0) {
    return (
      <div className="mb-8 rounded-md bg-card shadow">
        <ProfileHeader>
          <h4 className="text-sm font-medium text-foreground">لیست‌های محبوب شما</h4>
        </ProfileHeader>
        <div className="p-8">
          <EmptyState
            title="هنوز چیزی ذخیره نکرده‌ای"
            description="با دکمهٔ ذخیره روی دوره‌ها، اخبار و کتاب‌ها، هرچه را می‌خواهی بعداً ببینی اینجا جمع کن."
            href="/courses"
            action="مشاهده دوره‌ها"
          />
        </div>
      </div>
    );
  }

  // ===== Bookmark List =====
  return (
    <div className="mb-8 rounded-md bg-card shadow">
      <ProfileHeader>
        <h4 className="text-sm font-medium text-foreground">
          لیست‌های محبوب شما ({items.length})
        </h4>
      </ProfileHeader>

      <div className="flex flex-wrap gap-2 border-b border-border px-5 py-4">
        {FILTERS.map(({ key, label }) => {
          const count =
            key === "all"
              ? items.length
              : items.filter((item) => item.type === key).length;

          return (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition",
                filter === key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {label} ({count})
            </button>
          );
        })}
      </div>

      {visibleItems.length === 0 ? (
        <p className="p-8 text-center text-sm text-muted-foreground">
          در این دسته چیزی ذخیره نکرده‌ای.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleItems.map((item) => (
            <BookmarkCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesList;
