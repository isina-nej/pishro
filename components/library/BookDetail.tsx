"use client";

import { useBookDetail } from "@/lib/hooks/useBooks";
import { BookCoverLightbox } from "./BookCoverLightbox";
import { Button } from "@/components/ui/button";
import {
  Star,
  Eye,
  Download,
  BookOpen,
  Calendar,
  FileText,
  Globe,
  Building,
} from "lucide-react";
import { useState } from "react";

interface BookDetailProps {
  bookId: string;
}

const BookDetail = ({ bookId }: BookDetailProps) => {
  const { data: book, isLoading, error } = useBookDetail(bookId);
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (type: "pdf" | "cover" | "audio") => {
    try {
      setDownloading(type);
      const downloadUrl = `/api/library/${bookId}/download/${type}`;
      console.log("Downloading from:", downloadUrl);
      
      // بجای fetch، مستقیم window.location رو استفاده کن
      // این باعث می‌شود تا browser خود درخواست کند و CORS مسائل نباشد
      window.location.href = downloadUrl;
      
    } catch (error) {
      console.error("خطا در دانلود:", error);
      alert("خطا در دانلود فایل");
    } finally {
      setDownloading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="container-xl py-20 flex justify-center items-center min-h-[600px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground dark:text-textSecondary">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="container-xl py-20 flex justify-center items-center min-h-[600px]">
        <div className="text-center text-destructive">
          <p className="text-xl font-bold">خطا در بارگذاری کتاب</p>
          <p className="text-sm mt-2">{error?.message || "کتاب یافت نشد"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-xl py-10 mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Book Cover & Quick Info */}
          <div className="md:col-span-1">
            <div className="sticky top-24">
              {book.cover && (
                <BookCoverLightbox
                  src={book.cover}
                  alt={book.title}
                  title={book.title}
                />
              )}
              <div className="bg-muted dark:bg-darkBgHidden rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground dark:text-textSecondary">امتیاز:</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-premium" />
                    <span className="font-bold">
                      {book.rating.toFixed(1)}
                    </span>
                    <span className="text-xs text-muted-foreground dark:text-textSecondary">
                      ({book.votes} رای)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground dark:text-textSecondary">بازدید:</span>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4 text-muted-foreground dark:text-textSecondary" />
                    <span className="font-medium">{book.views}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground dark:text-textSecondary">دانلود:</span>
                  <div className="flex items-center gap-1">
                    <Download className="w-4 h-4 text-muted-foreground dark:text-textSecondary" />
                    <span className="font-medium">{book.downloads}</span>
                  </div>
                </div>

                {book.readingTime && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground dark:text-textSecondary">زمان مطالعه:</span>
                    <span className="font-medium">{book.readingTime}</span>
                  </div>
                )}
              </div>

              {book.fileUrl && (
                <Button 
                  onClick={() => handleDownload("pdf")}
                  disabled={downloading === "pdf"}
                  className="w-full mt-4" 
                  size="lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {downloading === "pdf" ? "در حال دانلود..." : "دانلود PDF"}
                </Button>
              )}

              {book.audioUrl && (
                <Button 
                  onClick={() => handleDownload("audio")}
                  disabled={downloading === "audio"}
                  className="w-full mt-2" 
                  variant="outline" 
                  size="lg"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  {downloading === "audio" ? "در حال دانلود..." : "دانلود صوتی"}
                </Button>
              )}

              {book.cover && (
                <Button 
                  onClick={() => handleDownload("cover")}
                  disabled={downloading === "cover"}
                  className="w-full mt-2" 
                  variant="ghost" 
                  size="lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {downloading === "cover" ? "در حال دانلود..." : "دانلود کاور"}
                </Button>
              )}
            </div>
          </div>

          {/* Book Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Title & Category */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {book.category}
                </span>
                {book.status.map((status) => (
                  <span
                    key={status}
                    className="px-3 py-1 bg-primary text-primary rounded-full text-sm font-medium"
                  >
                    {status}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-foreground dark:text-textPrimary mb-2">
                {book.title}
              </h1>

              <p className="text-xl text-muted-foreground dark:text-textSecondary mb-4">
                نوشته: {book.author}
              </p>
            </div>

            {/* Book Info Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {book.publisher && (
                <div className="flex items-start gap-3 p-4 bg-muted dark:bg-darkBgHidden rounded-lg">
                  <Building className="w-5 h-5 text-muted-foreground dark:text-textSecondary mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground dark:text-textSecondary mb-1">ناشر</p>
                    <p className="font-medium">{book.publisher}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 p-4 bg-muted dark:bg-darkBgHidden rounded-lg">
                <Calendar className="w-5 h-5 text-muted-foreground dark:text-textSecondary mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground dark:text-textSecondary mb-1">سال انتشار</p>
                  <p className="font-medium">{book.year}</p>
                </div>
              </div>

              {book.pages && (
                <div className="flex items-start gap-3 p-4 bg-muted dark:bg-darkBgHidden rounded-lg">
                  <FileText className="w-5 h-5 text-muted-foreground dark:text-textSecondary mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground dark:text-textSecondary mb-1">تعداد صفحات</p>
                    <p className="font-medium">{book.pages}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 p-4 bg-muted dark:bg-darkBgHidden rounded-lg">
                <Globe className="w-5 h-5 text-muted-foreground dark:text-textSecondary mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground dark:text-textSecondary mb-1">زبان</p>
                  <p className="font-medium">{book.language}</p>
                </div>
              </div>
            </div>

            {/* Formats */}
            {book.formats.length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-3">فرمت‌های موجود</h3>
                <div className="flex flex-wrap gap-2">
                  {book.formats.map((format) => (
                    <span
                      key={format}
                      className="px-4 py-2 bg-primary text-primary rounded-lg text-sm font-medium"
                    >
                      {format}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="text-lg font-bold mb-3">درباره کتاب</h3>
              <p className="text-muted-foreground dark:text-textPrimary leading-relaxed">{book.description}</p>
            </div>

            {/* Tags */}
            {book.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-3">برچسب‌ها</h3>
                <div className="flex flex-wrap gap-2">
                  {book.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-muted dark:bg-cardBg text-muted-foreground dark:text-textPrimary rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ISBN */}
            {book.isbn && (
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground dark:text-textSecondary">
                  ISBN: <span className="font-mono">{book.isbn}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
