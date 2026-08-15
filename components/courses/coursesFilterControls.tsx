"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { CourseSortOption } from "./hooks/useCoursesFilters";

interface CoursesFilterControlsProps {
  query: string;
  onQueryChange: (value: string) => void;
  sortOptions: CourseSortOption[];
  selectedSort: CourseSortOption;
  onSortChange: (value: CourseSortOption) => void;
  levelFilter: string;
  onLevelFilterChange: (value: string) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  disabled?: boolean;
}

const levelOptions = [
  { label: "همه سطح‌ها", value: "همه" },
  { label: "مقدماتی", value: "مقدماتی" },
  { label: "متوسط", value: "متوسط" },
  { label: "پیشرفته", value: "پیشرفته" },
];

function ChipGroup({
  label,
  options,
  value,
  onChange,
  layoutId,
  disabled,
}: {
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  layoutId: string;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2.5">
      <p className="text-[11px] font-semibold tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {options.map((option) => {
          const active = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              disabled={disabled}
              onClick={() => onChange(option.value)}
              aria-pressed={active}
              className={cn(
                "relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300",
                active
                  ? "text-primary-foreground"
                  : "text-foreground/80 hover:text-foreground",
                disabled && "pointer-events-none opacity-60"
              )}
            >
              {active ? (
                <motion.span
                  layoutId={layoutId}
                  className="absolute inset-0 rounded-full bg-primary shadow-lg shadow-primary/25"
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                />
              ) : (
                <span className="absolute inset-0 rounded-full border border-border/70 bg-card/70 dark:bg-white/5" />
              )}
              <span className="relative z-10">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export const CoursesFilterControls = ({
  query,
  onQueryChange,
  sortOptions,
  selectedSort,
  onSortChange,
  levelFilter,
  onLevelFilterChange,
  hasActiveFilters,
  onResetFilters,
  disabled = false,
}: CoursesFilterControlsProps) => {
  return (
    <div className="flex flex-col gap-6 border-b border-border/40 pb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <SlidersHorizontal className="size-4" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-foreground">دوره‌های آموزشی</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              سطح و مرتب‌سازی را انتخاب کنید
            </p>
          </div>
        </div>

        {hasActiveFilters ? (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={onResetFilters}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 self-start rounded-full border border-border/60 bg-card/80 px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-sm dark:bg-white/5"
          >
            <X className="size-3.5" />
            پاک کردن فیلترها
          </motion.button>
        ) : null}
      </div>

      <div
        className={cn(
          "flex items-center gap-3 rounded-2xl border border-border/60 bg-card/70 px-4 py-3 shadow-inner backdrop-blur-xl dark:bg-white/5",
          disabled && "opacity-60"
        )}
      >
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          placeholder="جستجوی سریع در بین دوره‌ها"
          disabled={disabled}
          aria-disabled={disabled}
        />
        {query ? (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            className="text-muted-foreground transition-transform hover:scale-110 hover:text-foreground"
            aria-label="پاک کردن جستجو"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <ChipGroup
          label="سطح دوره"
          options={levelOptions}
          value={levelFilter}
          onChange={onLevelFilterChange}
          layoutId="courses-level-pill"
          disabled={disabled}
        />
        <ChipGroup
          label="مرتب‌سازی"
          options={sortOptions.map((option) => ({
            label: option,
            value: option,
          }))}
          value={selectedSort}
          onChange={(value) => onSortChange(value as CourseSortOption)}
          layoutId="courses-sort-pill"
          disabled={disabled}
        />
      </div>
    </div>
  );
};
