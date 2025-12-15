"use client";

import React, { useRef, useEffect, useState } from "react";
import "plyr/dist/plyr.css";

interface VideoSectionProps {
  videoUrl: string;
  label: string;
}

const VideoSection: React.FC<VideoSectionProps> = ({ videoUrl, label }) => {
  const [isClient, setIsClient] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<Plyr | null>(null);

  useEffect(() => {
    // Mark that the component is running on the client side
    setIsClient(true);

    // Dynamically import Plyr within useEffect to avoid SSR issues
    import("plyr").then((module) => {
      const Plyr = module.default;
      if (videoRef.current) {
        // Initialize Plyr on the video element
        playerRef.current = new Plyr(videoRef.current, {
          controls: [
            "play-large",
            "play",
            "progress",
            "current-time",
            "mute",
            "volume",
            "captions",
            "settings",
            "fullscreen",
          ],
          // i18n settings for Persian labels
          i18n: {
            restart: "شروع مجدد",
            rewind: "بازپخش {seektime} ثانیه",
            play: "پخش",
            pause: "توقف",
            fastForward: "پیش‌برد {seektime} ثانیه",
            seek: "جستجو",
            played: "پخش شده",
            buffered: "بارگذاری شده",
            currentTime: "زمان فعلی",
            duration: "مدت زمان",
            volume: "صدا",
            mute: "بی‌صدا",
            unmute: "با صدا",
            enableCaptions: "فعال کردن زیرنویس",
            disableCaptions: "غیرفعال کردن زیرنویس",
            download: "دانلود",
            enterFullscreen: "تمام صفحه",
            exitFullscreen: "خروج از تمام صفحه",
            frameTitle: "پخش‌کننده برای {title}",
            captions: "زیرنویس",
            settings: "تنظیمات",
            menuCaptions: "زیرنویس",
            speed: "سرعت",
            normal: "معمولی",
            quality: "کیفیت",
          },
        });
      }
    });

    // Cleanup on unmount: destroy the Plyr instance if exists
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoUrl, isClient]);

  if (!isClient) return null;

  return (
    // تنظیم جهت نمایش به صورت راست به چپ
    <div className="container-md py-8" dir="rtl">
      <div className="w-full max-w-[1080px] mx-auto rounded-xl overflow-hidden">
        <video ref={videoRef} className="plyr__video-embed" controls>
          <source src={videoUrl} type="video/mp4" />
        </video>
      </div>
      <p className="mt-4 text-lg font-semibold text-center">{label}</p>
    </div>
  );
};

export default VideoSection;
