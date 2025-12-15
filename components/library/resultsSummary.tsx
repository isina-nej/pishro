"use client";

interface ResultsSummaryProps {
  query: string;
  count: number;
}

export const ResultsSummary = ({ query, count }: ResultsSummaryProps) => {
  const hasQuery = query.trim().length > 0;

  return (
    <div className="mt-8 rounded-2xl border border-slate-200 bg-white px-4 py-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-slate-900">
          {hasQuery ? `نتایج جستجو برای "${query.trim()}"` : "نتایج فیلتر شده"}
        </h3>
        <span className="text-sm text-slate-500">
          {count > 0
            ? `${count} عنوان مطابق با فیلترهای شما یافت شد.`
            : "موردی مطابق فیلترها پیدا نشد."}
        </span>
      </div>
    </div>
  );
};
