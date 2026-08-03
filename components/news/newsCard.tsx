import Image from "next/image";
import Link from "next/link";
import { Calendar, Eye, Clock, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import BookmarkButton from "@/components/bookmarks/bookmarkButton";

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
      اخبار: { bg: "from-primary/20 to-primary/20", text: "from-primary to-primary", icon: "bg-primary/20 text-primary" },
      آموزش: { bg: "from-accent/20 to-destructive/20", text: "from-accent to-destructive", icon: "bg-accent/20 text-accent" },
      فناوری: { bg: "from-primary/20 to-primary/20", text: "from-primary to-primary", icon: "bg-primary/20 text-primary" },
      رویداد: { bg: "from-premium/20 to-destructive/20", text: "from-premium to-destructive", icon: "bg-premium/20 text-premium" },
      پروژه: { bg: "from-primary/20 to-accent/20", text: "from-primary to-accent", icon: "bg-primary/20 text-primary" },
    };
    return colors[category] || { bg: "from-primary/20 to-primary/20", text: "from-primary to-primary", icon: "bg-primary/20 text-primary" };
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
        <div className="relative w-full h-56 sm:h-60 md:h-64 overflow-hidden bg-gradient-to-br from-muted to-card">
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
            <div className={`bg-gradient-to-r ${categoryColor.bg} backdrop-blur-xl px-3 py-2 rounded-full border border-border/20`}>
              <span className={`text-xs sm:text-sm font-bold bg-gradient-to-r ${categoryColor.text} bg-clip-text text-transparent`}>
                {data.category}
              </span>
            </div>
          </div>

          {/* Bookmark */}
          <div className="absolute top-4 left-4 z-10">
            <BookmarkButton
              type="news"
              itemId={data.id}
              className="backdrop-blur-xl border-border/20"
            />
          </div>

          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="flex flex-col justify-between flex-1 p-5 sm:p-6">
          {/* Title and Excerpt */}
          <div className="space-y-3 mb-4">
            <h3 className="font-bold text-base sm:text-lg md:text-xl text-foreground leading-tight group-hover:text-mySecondary transition-colors duration-300 line-clamp-2">
              {data.title}
            </h3>

            <p className="font-normal text-sm text-muted-foreground dark:text-textSecondary leading-relaxed line-clamp-2">
              {data.excerpt}
            </p>

            {/* Tags */}
            {data.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {data.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-muted/50 text-muted-foreground border border-border/50"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-muted to-transparent mb-4" />

          {/* Author and Meta Info */}
          <div className="space-y-3">
            {data.author && (
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-mySecondary to-mySecondary/70 flex items-center justify-center text-foreground text-xs font-bold flex-shrink-0 shadow-md">
                  {data.author.charAt(0)}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium truncate">
                  {data.author}
                </p>
              </div>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-muted-foreground">
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
          <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
            <span className="text-xs font-semibold text-mySecondary">مطالعه بیشتر</span>
            <ArrowLeft className="w-4 h-4 text-mySecondary group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default NewsCard;
