"use client";

import { Search, Filter, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { NewsSortOption } from "./hooks/useNewsFilters";

interface NewsFilterControlsProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  query: string;
  onQueryChange: (value: string) => void;
  sortOptions: NewsSortOption[];
  selectedSort: NewsSortOption;
  onSortChange: (value: NewsSortOption) => void;
  timeRange: string;
  onTimeRangeChange: (value: string) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  disabled?: boolean;
  compact?: boolean;
}

const timeRangeOptions = [
  { label: "همه", value: "همه" },
  { label: "امروز", value: "امروز" },
  { label: "هفته گذشته", value: "هفته" },
  { label: "ماه گذشته", value: "ماه" },
  { label: "سال گذشته", value: "سال" },
];

export const NewsFilterControls = ({
  categories,
  selectedCategory,
  onCategoryChange,
  query,
  onQueryChange,
  sortOptions,
  selectedSort,
  onSortChange,
  timeRange,
  onTimeRangeChange,
  hasActiveFilters,
  onResetFilters,
  disabled = false,
  compact = false,
}: NewsFilterControlsProps) => {
  return (
    <div className={cn("flex flex-col", compact ? "gap-3" : "gap-4")}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Filter className="size-3.5" />
          </span>
          <div>
            <h2 className={cn("font-bold text-foreground", compact ? "text-sm" : "text-base")}>
              فیلترها
            </h2>
            {!compact && (
              <p className="text-[11px] text-muted-foreground">جستجو، دسته و زمان</p>
            )}
          </div>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            disabled={disabled}
            className="rounded-full border border-border/50 bg-background/40 px-2.5 py-1 text-[11px] font-medium text-foreground transition-transform duration-300 hover:scale-105"
          >
            پاک کردن
          </button>
        )}
      </div>

      <div
        className={cn(
          "flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-3 py-2 shadow-inner backdrop-blur-xl dark:bg-white/5",
          disabled && "opacity-60"
        )}
      >
        <Search className="size-3.5 shrink-0 text-muted-foreground" />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          placeholder="جستجو در اخبار..."
          disabled={disabled}
        />
        {query ? (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            className="text-muted-foreground transition-transform hover:scale-110"
            aria-label="پاک کردن جستجو"
          >
            <X className="size-3.5" />
          </button>
        ) : null}
      </div>

      <div className={cn("grid gap-2", compact ? "grid-cols-1" : "grid-cols-2")}>
        <Select
          value={selectedSort}
          onValueChange={(v) => onSortChange(v as NewsSortOption)}
          disabled={disabled}
        >
          <SelectTrigger className="h-9 rounded-xl border-white/15 bg-white/10 text-xs text-foreground backdrop-blur-xl dark:bg-white/5">
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

        <Select value={timeRange} onValueChange={onTimeRangeChange} disabled={disabled}>
          <SelectTrigger className="h-9 rounded-xl border-white/15 bg-white/10 text-xs text-foreground backdrop-blur-xl dark:bg-white/5">
            <SelectValue placeholder="بازه زمانی" />
          </SelectTrigger>
          <SelectContent>
            {timeRangeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <p className="text-[11px] font-medium text-muted-foreground">دسته‌بندی</p>
        <div className={cn("flex gap-1.5", compact ? "flex-col" : "flex-wrap")}>
          {categories.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => onCategoryChange(category)}
                disabled={disabled}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-start text-xs font-medium transition-transform duration-300 hover:scale-105",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-white/15 bg-white/10 text-foreground dark:bg-white/5",
                  disabled && "pointer-events-none opacity-60"
                )}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
