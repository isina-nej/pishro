"use client";

import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { CourseSortOption } from "./hooks/useCoursesFilters";

interface CoursesFilterControlsProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
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

export const CoursesFilterControls = ({
  categories,
  selectedCategory,
  onCategoryChange,
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
    <div className="flex flex-col gap-6 border-b border-[#214254]/10 pb-8 dark:border-white/10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-textPrimary">دوره‌های آموزشی</h2>
          <p className="text-sm text-slate-500 dark:text-textSecondary">
            دوره‌ها را بر اساس دسته‌بندی، سطح دشواری و موضوع مورد نظر خود فیلتر کنید.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Select
            value={levelFilter}
            onValueChange={onLevelFilterChange}
            disabled={disabled}
          >
            <SelectTrigger
              className={cn(
                "w-full min-w-[180px] rounded-2xl border-white/60 bg-white/60 text-[#112b3a] shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:text-white",
                disabled && "opacity-60"
              )}
              aria-disabled={disabled}
            >
              <SelectValue placeholder="سطح دوره" />
            </SelectTrigger>
            <SelectContent>
              {levelOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedSort}
            onValueChange={(v) => onSortChange(v as CourseSortOption)}
            disabled={disabled}
          >
            <SelectTrigger
              className={cn(
                "w-full min-w-[180px] rounded-2xl border-white/60 bg-white/60 text-[#112b3a] shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:text-white",
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
      </div>

      <div className="flex flex-col gap-4">
        <div
          className={cn(
            "flex items-center gap-3 rounded-2xl border border-white/60 bg-white/60 p-3 shadow-inner backdrop-blur-xl dark:border-white/10 dark:bg-white/5",
            disabled && "opacity-60"
          )}
        >
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-textPrimary dark:placeholder:text-textSecondary"
            placeholder="جستجوی سریع در بین دوره‌ها"
            disabled={disabled}
            aria-disabled={disabled}
          />
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="whitespace-nowrap text-xs font-semibold text-slate-500 transition-colors hover:text-slate-800 dark:text-textSecondary dark:hover:text-textPrimary"
              disabled={disabled}
            >
              حذف فیلترها
            </button>
          )}
        </div>

        <div className="flex gap-3 overflow-x-auto pb-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={cn(
                "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all",
                selectedCategory === category
                  ? "border-[#112b3a] bg-[#112b3a] text-white shadow-lg"
                  : "border-white/60 bg-white/55 text-[#405c6b] hover:border-cyan-300/50 hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10",
                disabled && "pointer-events-none opacity-60"
              )}
              aria-pressed={selectedCategory === category}
              aria-disabled={disabled}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
