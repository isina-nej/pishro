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
}: NewsFilterControlsProps) => {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-mySecondary" />
          <h2 className="text-xl font-bold text-foreground">فیلترها</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          اخبار را بر اساس علاقه و زمان خود بسازید
        </p>
      </div>

      {/* Search Input */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-muted-foreground">
          جستجو
        </label>
        <div
          className={cn(
            "flex items-center gap-3 rounded-2xl border border-border/60 bg-card/60 p-3 shadow-inner backdrop-blur-xl transition-all focus-within:border-primary/60/10/5",
            disabled && "opacity-60"
          )}
        >
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            className="w-full bg-transparent text-sm text-muted-foreground outline-none placeholder-slate-400"
            placeholder="جستجو در اخبار..."
            disabled={disabled}
            aria-disabled={disabled}
          />
          {query && (
            <button
              onClick={() => onQueryChange("")}
              className="text-muted-foreground hover:text-muted-foreground dark:hover:text-muted-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Sort and Time Range */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-muted-foreground">
            مرتب‌سازی
          </label>
          <Select
            value={selectedSort}
            onValueChange={(v) => onSortChange(v as NewsSortOption)}
            disabled={disabled}
          >
            <SelectTrigger
              className={cn(
                "w-full rounded-2xl border-border/60 bg-card/60 backdrop-blur-xl/10/5",
                disabled && "opacity-60"
              )}
              aria-disabled={disabled}
            >
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

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-muted-foreground">
            بازه زمانی
          </label>
          <Select
            value={timeRange}
            onValueChange={onTimeRangeChange}
            disabled={disabled}
          >
            <SelectTrigger
              className={cn(
                "w-full rounded-2xl border-border/60 bg-card/60 backdrop-blur-xl/10/5",
                disabled && "opacity-60"
              )}
              aria-disabled={disabled}
            >
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
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-muted-foreground">
          دسته‌بندی
        </label>
        <div className="flex flex-col gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={cn(
                "px-4 py-3 rounded-xl text-sm font-medium text-start transition-all duration-200 border",
                selectedCategory === category
                  ? "border-[#112b3a] bg-[#112b3a] text-primary-foreground shadow-lg"
                  : "border-border/60 bg-card/55 text-[#405c6b] hover:border-primary/50 hover:bg-card/80/10/5 dark:hover:bg-card/10",
                disabled && "pointer-events-none opacity-60"
              )}
              aria-pressed={selectedCategory === category}
              aria-disabled={disabled}
            >
              <div className="flex items-center justify-between">
                <span>{category}</span>
                {selectedCategory === category && (
                  <span className="w-2 h-2 rounded-full bg-mySecondary" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Reset Filters Button */}
      {hasActiveFilters && (
        <button
          onClick={onResetFilters}
          disabled={disabled}
          className="w-full px-4 py-3 rounded-xl text-sm font-semibold bg-muted text-muted-foreground hover:bg-muted dark:hover:bg-accent transition-all duration-200 border border-border"
        >
          ✕ حذف تمام فیلترها
        </button>
      )}
    </div>
  );
};
