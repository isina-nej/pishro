"use client";

import clsx from "clsx";
import Image from "next/image";
import { MdOutlineComment } from "react-icons/md";
import { useCourseComments, Comment } from "@/lib/hooks/useComments";

interface CommentsSectionProps {
  courseId: string;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ courseId }) => {
  const { data: comments = [], isLoading, error } = useCourseComments(courseId, 50);

  const renderComment = (comment: Comment) => {
    // نام کاربر را تعیین کنید
    const userName = comment.user
      ? `${comment.user.firstName || ""} ${comment.user.lastName || ""}`.trim() || "کاربر"
      : comment.userName || "کاربر مهمان";

    // آواتار کاربر
    const userAvatar =
      comment.user?.avatarUrl ||
      comment.userAvatar ||
      "/images/profile/Avatar-24-24.png";

    return (
      <div key={comment.id} className="p-8 mb-6 bg-[#fafafa] shadow rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 mb-6">
            {/* Profile Image */}
            <div className="relative w-6 h-6">
              <Image
                src={userAvatar}
                alt={`${userName} profile`}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <span className="font-bold text-sm text-[#4D4D4D]">
              {userName}
            </span>
            {/* نمایش تاییدیه اگر نظر verified باشد */}
            {comment.verified && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                ✓ تایید شده
              </span>
            )}
            {/* نمایش ستاره‌ها اگر rating وجود داشت */}
            {comment.rating && (
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={clsx(
                      "text-sm",
                      i < comment.rating! ? "text-yellow-500" : "text-gray-300"
                    )}
                  >
                    ★
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="text-xs text-gray-500">
            {new Date(comment.createdAt).toLocaleDateString("fa-IR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        {/* Comment Message */}
        <div className="flex items-start gap-2 mt-2">
          <p className="text-xs text-[#666666] leading-6">{comment.text}</p>
        </div>

        {/* نمایش تعداد لایک/دیسلایک */}
        <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
          {comment.likes.length > 0 && (
            <span>👍 {comment.likes.length}</span>
          )}
          {comment.dislikes.length > 0 && (
            <span>👎 {comment.dislikes.length}</span>
          )}
          {comment.views > 0 && (
            <span>👁 {comment.views.toLocaleString("fa-IR")} بازدید</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-20 border-t">
      {/* Comments Section Header */}
      <div className="border-b w-full max-w-4xl">
        <h5 className="mt-8 mb-4 flex gap-3 items-center">
          <MdOutlineComment className="text-gray-600 text-xl" />
          نظرات دوره
        </h5>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="max-w-4xl mt-10 text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
          <p className="mt-4 text-gray-600">در حال بارگذاری نظرات...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="max-w-4xl mt-10 text-center py-12 bg-red-50 rounded-lg">
          <p className="text-red-600">خطا در بارگذاری نظرات</p>
          <p className="text-sm text-gray-600 mt-2">
            لطفاً بعداً دوباره تلاش کنید
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && comments.length === 0 && (
        <div className="max-w-4xl mt-10 text-center py-12 bg-gray-50 rounded-lg">
          <MdOutlineComment className="text-gray-400 text-5xl mx-auto mb-4" />
          <p className="text-gray-600">هنوز نظری برای این دوره ثبت نشده است</p>
          <p className="text-sm text-gray-500 mt-2">
            اولین نفری باشید که نظر می‌دهید!
          </p>
        </div>
      )}

      {/* Show Comments Section */}
      {!isLoading && !error && comments.length > 0 && (
        <div className="mt-10 max-w-4xl">
          <p className="text-sm text-gray-600 mb-6">
            {comments.length.toLocaleString("fa-IR")} نظر
          </p>
          {comments.map((comment) => renderComment(comment))}
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
