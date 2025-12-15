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
    <div className="group h-[270px] border border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-mySecondary/10 hover:border-mySecondary/30 transition-all duration-500 bg-white relative">
      <Link
        className="size-full flex flex-col md:flex-row md:justify-between "
        href={`/news/${data.slug}`}
      >
        {/* Gradient accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-mySecondary to-mySecondary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* تصویر */}
        <div className="relative flex-shrink-0 w-full md:w-[220px] xl:w-[250px] h-[200px] md:min-h-[240px] md:h-full overflow-hidden">
          <Image
            src={data.coverImage ?? "/images/default-news.jpg"}
            alt={data.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 100vw, 260px"
            priority={false}
          />

          {/* Category badge */}
          <div className="absolute top-4 right-4 z-10">
            <span
              className={`${getCategoryColor(
                data.category
              )} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm`}
            >
              {data.category}
            </span>
          </div>
        </div>

        {/* محتوا */}
        <div className="px-4 md:px-4 xl:px-6 py-4 md:py-6 flex flex-col justify-between flex-1">
          <div className="flex flex-col justify-between h-full">
            <div className="space-y-2 md:space-y-3">
              <h5 className="font-bold text-base md:text-lg xl:text-xl text-[#131b22] line-clamp-2 leading-relaxed group-hover:text-mySecondary transition-colors duration-300">
                {data.title}
              </h5>

              <p className="font-normal text-sm xl:text-base text-gray-600 line-clamp-2 md:line-clamp-3 leading-relaxed">
                {data.excerpt}
              </p>
            </div>
            <div className="space-y-2 md:space-y-3">
              {data.author && (
                <div className="flex items-center gap-2 pt-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-mySecondary to-mySecondary/70 flex items-center justify-center text-white text-xs font-bold">
                    {data.author.charAt(0)}
                  </div>
                  <p className="text-xs text-gray-600 font-medium">
                    {data.author}
                  </p>
                </div>
              )}
              {/* Meta information */}
              <div className="flex flex-wrap items-center gap-3 md:gap-4 pt-1 md:pt-2">
                {data.publishedAt && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(data.publishedAt)}</span>
                  </div>
                )}

                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{data.views.toLocaleString("fa-IR")} بازدید</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{readingTime} دقیقه مطالعه</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default NewsCard;
