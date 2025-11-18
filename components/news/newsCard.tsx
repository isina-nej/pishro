import Image from "next/image";
import Link from "next/link";
import { Calendar, Eye, Clock } from "lucide-react";

interface NewsCardProps {
  data: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string | null;
    author: string | null;
    category: string;
    tags: string[];
    published: boolean;
    publishedAt: Date | null;
    views: number;
    createdAt: Date;
    updatedAt: Date;
  };
}

const NewsCard = ({ data }: NewsCardProps) => {
  // محاسبه تقریبی زمان مطالعه (بر اساس تعداد کلمات)
  const getReadingTime = (content: string) => {
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
      "اخبار": "bg-blue-500",
      "آموزش": "bg-green-500",
      "فناوری": "bg-purple-500",
      "رویداد": "bg-orange-500",
      "پروژه": "bg-pink-500",
    };
    return colors[category] || "bg-myPrimary";
  };

  const readingTime = getReadingTime(data.content);

  return (
    <div className="group min-h-[240px] flex justify-between border border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-myPrimary/10 hover:border-myPrimary/30 transition-all duration-500 bg-white relative">
      {/* Gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-myPrimary to-myPrimary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* تصویر */}
      <div className="relative flex-shrink-0 w-[220px] xl:w-[250px] min-h-[240px] overflow-hidden">
        <Image
          src={data.coverImage ?? "/images/default-news.jpg"}
          alt={data.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          sizes="(max-width: 768px) 100vw, 250px"
          priority={false}
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Category badge */}
        <div className="absolute top-4 right-4 z-10">
          <span className={`${getCategoryColor(data.category)} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm`}>
            {data.category}
          </span>
        </div>
      </div>

      {/* محتوا */}
      <div className="px-6 xl:px-8 py-6 flex flex-col justify-between flex-1">
        <div className="space-y-3">
          <h5 className="font-bold text-lg xl:text-xl text-[#131b22] line-clamp-2 leading-relaxed group-hover:text-myPrimary transition-colors duration-300">
            {data.title}
          </h5>

          <p className="font-normal text-sm xl:text-base text-gray-600 line-clamp-3 leading-relaxed">
            {data.excerpt}
          </p>

          {/* Meta information */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
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

          {data.author && (
            <div className="flex items-center gap-2 pt-1">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-myPrimary to-myPrimary/70 flex items-center justify-center text-white text-xs font-bold">
                {data.author.charAt(0)}
              </div>
              <p className="text-xs text-gray-600 font-medium">
                {data.author}
              </p>
            </div>
          )}
        </div>

        {/* دکمه ادامه مطلب */}
        <Link
          href={`/news/${data.slug}`}
          className="mt-4 text-sm font-bold text-myPrimary hover:text-myPrimary/80 transition-all duration-300 self-start inline-flex items-center gap-2 no-underline group-hover:gap-3"
        >
          <span>ادامه مطلب</span>
          <span className="text-base group-hover:-translate-x-1 transition-transform duration-300">←</span>
        </Link>
      </div>
    </div>
  );
};

export default NewsCard;
