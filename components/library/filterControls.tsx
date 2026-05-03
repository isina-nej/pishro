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
import type { BookCategory, BookFormat } from "./data";
import type { SortOption } from "./hooks/useLibraryFilters";

interface FilterControlsProps {
  categories: (BookCategory | "همه")[];
  selectedCategory: BookCategory | "همه";
  onCategoryChange: (value: BookCategory | "همه") => void;
  query: string;
  onQueryChange: (value: string) => void;
  formatOptions: (BookFormat | "همه")[];
  selectedFormat: BookFormat | "همه";
  onFormatChange: (value: BookFormat | "همه") => void;
  sortOptions: SortOption[];
  selectedSort: SortOption;
  onSortChange: (value: SortOption) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  disabled?: boolean;
}

export const FilterControls = ({
  categories,
  selectedCategory,
  onCategoryChange,
  query,
  onQueryChange,
  formatOptions,
  selectedFormat,
  onFormatChange,
  sortOptions,
  selectedSort,
  onSortChange,
  hasActiveFilters,
  onResetFilters,
  disabled = false,
}: FilterControlsProps) => {
  return (
    <div className="flex flex-col gap-6 border-b border-slate-200 pb-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <h2 className="text-xl font-bold text-slate-900">کتاب‌ها</h2>
          <p className="text-sm text-slate-500">
            کتابخانه را بر اساس علاقه خود فیلتر کنید و پیشنهادهای جدید را
            ببینید.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Select
            value={selectedFormat}
            onValueChange={(v) => onFormatChange(v as BookFormat | "همه")}
            disabled={disabled}
          >
            <SelectTrigger
              className={cn(
                "w-full min-w-[180px] rounded-2xl border-slate-200 bg-white",
                disabled && "opacity-60"
              )}
              aria-disabled={disabled}
            >
              <SelectValue placeholder="فرمت" />
            </SelectTrigger>
            <SelectContent>
              {formatOptions.map((format) => (
                <SelectItem key={format} value={format}>
                  {format}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedSort}
            onValueChange={(v) => onSortChange(v as SortOption)}
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
            placeholder="جستجوی سریع در بین کتاب‌ها"
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
