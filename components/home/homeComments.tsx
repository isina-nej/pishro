// @/components/home/homeComments.tsx
"use client";

import CommentsSlider from "@/components/utils/CommentsSlider";
import { useFeaturedComments } from "@/lib/hooks";
import { getUserRolePersian } from "@/lib/role-utils";

export default function HomeComments() {
  const { data: commentsData, isLoading } = useFeaturedComments(13);

  // Transform comments for CommentsSlider
  const comments = commentsData
    ? commentsData.map((c) => ({
        id: c.id,
        userName:
          c.userName ||
          `${c.user?.firstName || ""} ${c.user?.lastName || ""}`.trim() ||
          "کاربر",
        userAvatar:
          c.userAvatar || c.user?.avatarUrl || "/images/default-avatar.png",
        userRole: getUserRolePersian(c.userRole),
        rating: c.rating || 5,
        content: c.text,
        date: c.createdAt,
        verified: c.verified,
        likes: c.likes.length,
      }))
    : [];

  if (isLoading) {
    return <div className="h-64 animate-pulse bg-white my-8" />;
  }

  if (comments.length === 0) {
    return null;
  }

  return <CommentsSlider comments={comments} title="نظرات دوره آموزان" />;
}
