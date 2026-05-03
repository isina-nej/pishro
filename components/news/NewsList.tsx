"use client";

import { useNewsList } from "@/lib/hooks/useNews";
import NewsCard from "./newsCard";

const NewsList = () => {
  const { data, isLoading, error } = useNewsList({ page: 1, limit: 12 });

  if (isLoading) {
    return (
      <div className="mt-8 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری اخبار...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 flex justify-center items-center min-h-[400px]">
        <div className="text-center text-red-500">
          <p>خطا در بارگذاری اخبار</p>
          <p className="text-sm mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!data?.items || data.items.length === 0) {
    return (
      <div className="mt-8 flex justify-center items-center min-h-[400px]">
        <p className="text-gray-500">هیچ خبری یافت نشد</p>
      </div>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-x-[16px] xl:gap-x-[32px] gap-y-[12px] xl:gap-y-[20px]">
      {data.items.map((newsItem) => (
        <NewsCard key={newsItem.id} data={newsItem} />
      ))}
    </div>
  );
};

export default NewsList;
