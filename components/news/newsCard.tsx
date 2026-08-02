import Image from "next/image";
import Link from "next/link";
import { Calendar, Eye, Clock, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface NewsCardProps {
  data: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content?: string;
    coverImage: string | null;
    author: string | null;
    category: string;
    tags: string[];
    published: boolean;
    publishedAt: Date | null;
    views: number;
    createdAt: Date;
    updatedAt?: Date | null;
  };
}

const NewsCard = ({ data }: NewsCardProps) => {
  const getReadingTime = (content?: string) => {
    if (!content) return 1;
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const d = new Date(date);
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(d);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, { bg: string; text: string; icon: string }> = {
      اخبار: { bg: "from-cyan-500/20 to-blue-500/20", text: "from-cyan-400 to-blue-400", icon: "bg-cyan-500/20 text-cyan-300" },
      آموزش: { bg: "from-purple-500/20 to-pink-500/20", text: "from-purple-400 to-pink-400", icon: "bg-purple-500/20 text-purple-300" },
      فناوری: { bg: "from-emerald-500/20 to-green-500/20", text: "from-emerald-400 to-green-400", icon: "bg-emerald-500/20 text-emerald-300" },
      رویداد: { bg: "from-orange-500/20 to-red-500/20", text: "from-orange-400 to-red-400", icon: "bg-orange-500/20 text-orange-300" },
      پروژه: { bg: "from-indigo-500/20 to-violet-500/20", text: "from-indigo-400 to-violet-400", icon: "bg-indigo-500/20 text-indigo-300" },
    };
    return colors[category] || { bg: "from-cyan-500/20 to-blue-500/20", text: "from-cyan-400 to-blue-400", icon: "bg-cyan-500/20 text-cyan-300" };
  };

  const readingTime = getReadingTime(data.content || data.excerpt);
  const categoryColor = getCategoryColor(data.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -8 }}
      className="group relative overflow-hidden rounded-3xl"
    >
      <Link
        className="public-page-card flex h-full flex-col overflow-hidden rounded-3xl transition-all duration-500 hover:shadow-2xl"
        href={`/news/${data.slug}`}
      >
        {/* Image Container */}
        <div className="relative w-full h-56 sm:h-60 md:h-64 overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900">
          <Image
            src={data.coverImage ?? "/images/default-news.jpg"}
            alt={data.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 500px, 600px"
            priority={false}
          />

          {/* Category Badge */}
          <div className="absolute top-4 right-4 z-10">
            <div className={`bg-gradient-to-r ${categoryColor.bg} backdrop-blur-xl px-3 py-2 rounded-full border border-white/20`}>
              <span className={`text-xs sm:text-sm font-bold bg-gradient-to-r ${categoryColor.text} bg-clip-text text-transparent`}>
                {data.category}
              </span>
            </div>
          </div>

          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="flex flex-col justify-between flex-1 p-5 sm:p-6">
          {/* Title and Excerpt */}
          <div className="space-y-3 mb-4">
            <h3 className="font-bold text-base sm:text-lg md:text-xl text-slate-900 dark:text-white leading-tight group-hover:text-mySecondary transition-colors duration-300 line-clamp-2">
              {data.title}
            </h3>

            <p className="font-normal text-sm text-slate-600 dark:text-textSecondary leading-relaxed line-clamp-2">
              {data.excerpt}
            </p>

            {/* Tags */}
            {data.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {data.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/50"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent mb-4" />

          {/* Author and Meta Info */}
          <div className="space-y-3">
            {data.author && (
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-mySecondary to-mySecondary/70 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-md">
                  {data.author.charAt(0)}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium truncate">
                  {data.author}
                </p>
              </div>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-500 dark:text-slate-400">
              {data.publishedAt && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{formatDate(data.publishedAt)}</span>
                </div>
              )}

              <div className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{(data.views ?? 0).toLocaleString("fa-IR")}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{readingTime} د</span>
              </div>
            </div>
          </div>

          {/* Read More Link */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
            <span className="text-xs font-semibold text-mySecondary">مطالعه بیشتر</span>
            <ArrowLeft className="w-4 h-4 text-mySecondary group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default NewsCard;
