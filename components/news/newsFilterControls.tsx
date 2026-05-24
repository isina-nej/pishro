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
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">فیلترها</h2>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          اخبار را بر اساس علاقه و زمان خود بسازید
        </p>
      </div>

      {/* Search Input */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
          جستجو
        </label>
        <div
          className={cn(
            "flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-3 shadow-sm transition-all focus-within:border-mySecondary focus-within:shadow-lg focus-within:shadow-mySecondary/10",
            disabled && "opacity-60"
          )}
        >
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            className="w-full bg-transparent text-sm text-slate-600 dark:text-slate-300 outline-none placeholder-slate-400"
            placeholder="جستجو در اخبار..."
            disabled={disabled}
            aria-disabled={disabled}
          />
          {query && (
            <button
              onClick={() => onQueryChange("")}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
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
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            مرتب‌سازی
          </label>
          <Select
            value={selectedSort}
            onValueChange={(v) => onSortChange(v as NewsSortOption)}
            disabled={disabled}
          >
            <SelectTrigger
              className={cn(
                "w-full rounded-2xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50",
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
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            بازه زمانی
          </label>
          <Select
            value={timeRange}
            onValueChange={onTimeRangeChange}
            disabled={disabled}
          >
            <SelectTrigger
              className={cn(
                "w-full rounded-2xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50",
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
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
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
                  ? "border-mySecondary bg-gradient-to-r from-mySecondary/10 to-mySecondary/5 text-mySecondary shadow-lg shadow-mySecondary/20"
                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 text-slate-600 dark:text-slate-300 hover:border-mySecondary/50 hover:bg-slate-50 dark:hover:bg-slate-800/50",
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
          className="w-full px-4 py-3 rounded-xl text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 border border-slate-200 dark:border-slate-700"
        >
          ✕ حذف تمام فیلترها
        </button>
      )}
    </div>
  );
};
