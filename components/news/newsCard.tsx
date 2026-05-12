import Image from "next/image";
import Link from "next/link";
import { Calendar, Eye, Clock } from "lucide-react";

interface NewsCardProps {
  data: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content?: string; // Optional because it's not always loaded in list views
    coverImage: string | null;
    author: string | null;
    category: string;
    tags: string[];
    published: boolean;
    publishedAt: Date | null;
    views: number;
    createdAt: Date;
    updatedAt?: Date; // Optional for consistency
  };
}

const NewsCard = ({ data }: NewsCardProps) => {
  // محاسبه تقریبی زمان مطالعه (بر اساس تعداد کلمات)
  const getReadingTime = (content?: string) => {
    if (!content) return 1; // حداقل 1 دقیقه برای محتوای خالی یا undefined
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes;
  };

  // فرمت تاریخ فارسی
  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const d = new Date(date);
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(d);
  };

  // دریافت رنگ دسته‌بندی
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      اخبار: "bg-mySecondary",
      آموزش: "bg-mySecondary",
      فناوری: "bg-mySecondary",
      رویداد: "bg-mySecondary",
      پروژه: "bg-mySecondary",
    };
    return colors[category] || "bg-mySecondary";
  };

  const readingTime = getReadingTime(data.content || data.excerpt);

  return (
    <div className="group border border-gray-200 dark:border-borderColor rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-mySecondary/10 hover:border-mySecondary/30 transition-all duration-500 bg-white dark:bg-cardBg">
      <Link
        className="flex flex-col md:flex-row h-full"
        href={`/news/${data.slug}`}
      >
        {/* Gradient accent line */}
        <div className="h-1 bg-gradient-to-r from-mySecondary to-mySecondary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* تصویر - Fixed Width on Desktop, Full Width on Mobile */}
        <div className="relative w-full md:w-[280px] lg:w-[320px] h-[200px] sm:h-[240px] md:h-[220px] lg:h-[240px] flex-shrink-0 overflow-hidden">
          <Image
            src={data.coverImage ?? "/images/default-news.jpg"}
            alt={data.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out w-full h-full"
            sizes="(max-width: 640px) 100vw, 768px) 1024px) 280px, 320px"
            priority={false}
          />

          {/* Category badge */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
            <span
              className={`${getCategoryColor(
                data.category
              )} text-white text-xs sm:text-sm font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg backdrop-blur-sm`}
            >
              {data.category}
            </span>
          </div>
        </div>

        {/* محتوا - Flexible Layout with Proper Spacing */}
        <div className="flex flex-col justify-between flex-1 px-3 sm:px-4 md:px-4 lg:px-6 py-3 sm:py-4 md:py-5 lg:py-6">
          {/* Title and Excerpt */}
          <div className="space-y-2 sm:space-y-2.5 md:space-y-2">
            <h5 className="font-bold text-sm sm:text-base md:text-base lg:text-lg text-[#131b22] leading-snug sm:leading-relaxed group-hover:text-mySecondary transition-colors duration-300">
              {data.title}
            </h5>

            <p className="font-normal text-xs sm:text-sm md:text-sm text-gray-600 dark:text-textSecondary leading-relaxed line-clamp-2 md:line-clamp-3">
              {data.excerpt}
            </p>
          </div>

          {/* Author and Meta Information */}
          <div className="space-y-2 sm:space-y-2.5 pt-2 sm:pt-3 border-t border-gray-100 dark:border-borderColor mt-2 sm:mt-3">
            {data.author && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-mySecondary to-mySecondary/70 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {data.author.charAt(0)}
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-textSecondary font-medium truncate">
                  {data.author}
                </p>
              </div>
            )}

            {/* Meta information - Responsive */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-2">
              {data.publishedAt && (
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-textSecondary">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{formatDate(data.publishedAt)}</span>
                </div>
              )}

              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-textSecondary">
                <Eye className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{(data.views ?? 0).toLocaleString("fa-IR")} بازدید</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-textSecondary">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{readingTime} دقیقه</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default NewsCard;
