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
      آموزش: { bg: "from-accent/20 to-destructive/20", text: "from-accent to-destructive", icon: "bg-accent/20 text-accent-foreground" },
      فناوری: { bg: "from-primary/20 to-primary/20", text: "from-primary to-primary", icon: "bg-primary/20 text-primary" },
      رویداد: { bg: "from-premium/20 to-destructive/20", text: "from-premium to-destructive", icon: "bg-premium/20 text-premium" },
      پروژه: { bg: "from-primary/20 to-accent/20", text: "from-primary to-accent", icon: "bg-primary/20 text-primary" },
    };
    return colors[category] || { bg: "from-primary/20 to-primary/20", text: "from-primary to-primary", icon: "bg-primary/20 text-primary" };
  };

  const readingTime = getReadingTime(data.content || data.excerpt);
  const categoryColor = getCategoryColor(data.category);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -8 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-card transition-all duration-500 hover:border-primary/30 hover:shadow-2xl"
    >
      <Link
        className="flex h-full flex-col"
        href={`/news/${data.slug}`}
      >
        {/* Image Container — fixed 16/10 frame, full image always visible */}
        <div className="relative w-full shrink-0 overflow-hidden bg-gradient-to-br from-muted to-card">
          <div className="relative aspect-[16/10] w-full">
            <Image
              src={data.coverImage ?? "/images/default-news.jpg"}
              alt={data.title}
              fill
              className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 500px, 600px"
              priority={false}
            />
          </div>

          {/* Category Badge */}
          <div className="absolute right-4 top-4 z-10">
            <div className={`rounded-full border border-border/20 bg-background/70 px-3 py-2 backdrop-blur-xl`}>
              <span className={`bg-gradient-to-r text-xs font-bold sm:text-sm ${categoryColor.text} bg-clip-text text-transparent`}>
                {data.category}
              </span>
            </div>
          </div>

          {/* Bookmark */}
          <div className="absolute left-4 top-4 z-10">
            <BookmarkButton
              type="news"
              itemId={data.id}
              className="border-border/20 backdrop-blur-xl"
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
          {/* Title and Excerpt */}
          <div className="mb-4 space-y-3">
            <h3 className="line-clamp-2 text-base font-bold leading-tight text-foreground transition-colors duration-300 group-hover:text-primary sm:text-lg md:text-xl">
              {data.title}
            </h3>

            <p className="line-clamp-2 text-sm font-normal leading-relaxed text-muted-foreground">
              {data.excerpt}
            </p>

            {/* Tags */}
            {data.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {data.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full border border-border/50 bg-muted/50 px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="mb-4 h-px bg-gradient-to-r from-transparent via-muted to-transparent" />

          {/* Author and Meta Info */}
          <div className="space-y-3">
            {data.author && (
              <div className="flex items-center gap-2.5">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-xs font-bold text-primary-foreground shadow-md">
                  {data.author.charAt(0)}
                </div>
                <p className="truncate text-xs font-medium text-muted-foreground sm:text-sm">
                  {data.author}
                </p>
              </div>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:gap-3">
              {data.publishedAt && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="size-3.5 shrink-0" />
                  <span className="truncate">{formatDate(data.publishedAt)}</span>
                </div>
              )}

              <div className="flex items-center gap-1.5">
                <Eye className="size-3.5 shrink-0" />
                <span className="truncate">{(data.views ?? 0).toLocaleString("fa-IR")}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Clock className="size-3.5 shrink-0" />
                <span className="truncate">{readingTime} د</span>
              </div>
            </div>
          </div>

          {/* Read More Link */}
          <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-4">
            <span className="text-xs font-semibold text-primary">مطالعه بیشتر</span>
            <ArrowLeft className="size-4 text-primary transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default NewsCard;
