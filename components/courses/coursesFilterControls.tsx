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
    <div className="flex flex-col gap-6 border-b border-slate-200 pb-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <h2 className="text-xl font-bold text-slate-900">دوره‌های آموزشی</h2>
          <p className="text-sm text-slate-500">
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
                "w-full min-w-[180px] rounded-2xl border-slate-200 bg-white",
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
                "w-full min-w-[180px] rounded-2xl border-slate-200 bg-white",
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
            "flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm",
            disabled && "opacity-60"
          )}
        >
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            className="w-full bg-transparent text-sm text-slate-600 outline-none"
            placeholder="جستجوی سریع در بین دوره‌ها"
            disabled={disabled}
            aria-disabled={disabled}
          />
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="whitespace-nowrap text-xs font-semibold text-slate-500 transition-colors hover:text-slate-800"
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
                  ? "border-slate-900 bg-slate-900 text-white shadow"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100",
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
