"use client";

import { motion } from "framer-motion";
import { Share2 } from "lucide-react";
import BookmarkButton from "@/components/bookmarks/bookmarkButton";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

type Props = {
  courseId: string;
  subject: string;
  description?: string | null;
  slug?: string | null;
  className?: string;
  /** ظاهر روی پس‌زمینه روشن کارت (نه روی تصویر تیره) */
  tone?: "surface" | "on-media";
};

export default function CourseActionIcons({
  courseId,
  subject,
  description,
  slug,
  className,
  tone = "surface",
}: Props) {
  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/courses/${slug || ""}`
        : "";

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: subject,
          text: description ?? undefined,
          url,
        });
      } catch {
        // cancelled
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(`${subject}\n${url}`);
      toast.success("لینک کپی شد");
    } catch (err) {
      console.error("Error copying to clipboard:", err);
    }
  };

  const iconBtn =
    tone === "on-media"
      ? "border-white/25 bg-white/12 text-white backdrop-blur-xl hover:bg-white/20"
      : "border-border/60 bg-background/70 text-muted-foreground backdrop-blur-md hover:text-foreground";

  return (
    <div
      className={cn("flex items-center justify-start gap-2", className)}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <motion.button
        type="button"
        data-sound="share"
        whileHover={{ scale: 1.12, rotate: -6 }}
        whileTap={{ scale: 0.88, rotate: 4 }}
        transition={{ type: "spring", stiffness: 420, damping: 18 }}
        onClick={handleShare}
        title="اشتراک‌گذاری"
        aria-label="اشتراک‌گذاری"
        className={cn(
          "flex size-9 items-center justify-center rounded-full border shadow-sm transition-shadow hover:shadow-md",
          iconBtn
        )}
      >
        <motion.span
          animate={{ y: [0, -1.5, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="flex"
        >
          <Share2 size={16} strokeWidth={1.85} />
        </motion.span>
      </motion.button>

      <motion.div
        data-sound="bookmark"
        whileHover={{ scale: 1.12, y: -2 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 420, damping: 18 }}
      >
        <BookmarkButton
          type="course"
          itemId={courseId}
          className={cn(
            "size-9 shadow-sm transition-shadow hover:shadow-md",
            tone === "on-media"
              ? "border-white/25 bg-white/12 text-white backdrop-blur-xl hover:text-white data-[active]:bg-[var(--btn-primary-bg)]/90 [[aria-pressed=true]]:border-[var(--btn-primary-bg)]/50 [[aria-pressed=true]]:bg-[var(--btn-primary-bg)]/90 [[aria-pressed=true]]:text-white"
              : "bg-background/70 backdrop-blur-md"
          )}
        />
      </motion.div>
    </div>
  );
}
