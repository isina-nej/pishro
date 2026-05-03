"use client";

import React from "react";
import { VideoPlayer as SecureVideoPlayer } from "@/components/video/videoPlayer";

interface VideoPlayerProps {
  videoId: string | null;
  label: string;
  description?: string | null;
  duration?: string | null;
  views?: number;
  createdAt?: Date;
  thumbnail?: string | null;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoId,
  label,
  description,
  duration,
  views,
  createdAt,
  thumbnail,
}) => {
  // اگر videoId وجود نداشت، پیام خطا نمایش می‌دهیم
  if (!videoId) {
    return (
      <div className="py-8" dir="rtl">
        <div className="w-full max-w-4xl rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            ویدیویی برای این درس در دسترس نیست
          </p>
        </div>
        <div className="w-full max-w-4xl">
          <p className="mt-8 text-2xl font-bold">{label}</p>
          {description && (
            <div>
              <p className="text-sm text-[#666] font-medium mt-4">{description}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="py-8" dir="rtl">
      {/* استفاده از پلیر امن با سیستم HLS و token */}
      <div className="w-full max-w-4xl rounded-lg overflow-hidden">
        <SecureVideoPlayer
          videoId={videoId}
          className="w-full"
          autoPlay={false}
          controls={true}
          poster={thumbnail || undefined}
        />
      </div>

      {/* اطلاعات ویدیو */}
      <div className="w-full max-w-4xl">
        <p className="mt-8 text-2xl font-bold">{label}</p>
        <div className="flex justify-between gap-4 flex-wrap items-center mt-2">
          {duration && <p className="text-sm text-[#666]">مدت زمان: {duration}</p>}
          <div className="flex items-center gap-4 text-sm text-[#666] font-medium">
            {createdAt && (
              <p>
                {new Date(createdAt).toLocaleDateString("fa-IR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </p>
            )}
            {views !== undefined && <p>{views.toLocaleString("fa-IR")} مشاهده</p>}
          </div>
        </div>
        {description && (
          <div>
            <p className="text-sm text-[#666] font-medium mt-4">{description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
