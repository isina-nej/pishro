"use client";

import Image from "next/image";
import { useNewsDetail } from "@/lib/hooks/useNews";
import { Calendar, User, Eye, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { faIR } from "date-fns/locale";

interface NewsDetailProps {
  articleId: string;
}

const NewsDetail = ({ articleId }: NewsDetailProps) => {
  const { data: article, isLoading, error } = useNewsDetail(articleId);

  if (isLoading) {
    return (
      <div className="container-xl py-20 flex justify-center items-center min-h-[600px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container-xl py-20 flex justify-center items-center min-h-[600px]">
        <div className="text-center text-red-500">
          <p className="text-xl font-bold">خطا در بارگذاری مقاله</p>
          <p className="text-sm mt-2">{error?.message || "مقاله یافت نشد"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 mt-20">
      <article className="container-xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {article.category}
            </span>
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>

          <p className="text-lg text-gray-600 mb-6">{article.excerpt}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            {article.author && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{article.author}</span>
              </div>
            )}
            {article.publishedAt && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {formatDistanceToNow(new Date(article.publishedAt), {
                    addSuffix: true,
                    locale: faIR,
                  })}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{article.views} بازدید</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              {/* <span>{article.comments?.length || 0} نظر</span> */}
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {article.coverImage && (
          <div className="relative w-full h-[400px] rounded-2xl overflow-hidden mb-8">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-lg prose-slate max-w-none mb-12 leading-loose [&>p]:leading-loose [&>p]:text-base [&>p]:mb-6"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Comments Section */}
        {/* {article.comments && article.comments.length > 0 && (
          <section className="mt-12 border-t pt-8">
            <h2 className="text-2xl font-bold mb-6">
              نظرات ({article.comments.length})
            </h2>
            <div className="space-y-6">
              {article.comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {comment.user?.firstName} {comment.user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                          locale: faIR,
                        })}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))}
            </div>
          </section>
        )} */}
      </article>
    </div>
  );
};

export default NewsDetail;
