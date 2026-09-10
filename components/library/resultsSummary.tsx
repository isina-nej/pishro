"use client";

import { usePublicCopy } from "@/components/site/PublicContentProvider";

interface ResultsSummaryProps {
  query: string;
  count: number;
}

export const ResultsSummary = ({ query, count }: ResultsSummaryProps) => {
  const copy = usePublicCopy("library");
  const hasQuery = query.trim().length > 0;

  return (
    <div className="mt-8 rounded-2xl border border-border bg-card dark:bg-cardBg px-4 py-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          {hasQuery ? `${copy("results.searchPrefix", "نتایج جستجو برای")} "${query.trim()}"` : copy("results.filtered", "نتایج فیلتر شده")}
        </h3>
        <span className="text-sm text-muted-foreground">
          {count > 0
            ? `${count} ${copy("results.foundSuffix", "عنوان مطابق با فیلترهای شما یافت شد.")}`
            : copy("results.none", "موردی مطابق فیلترها پیدا نشد.")}
        </span>
      </div>
    </div>
  );
};
