"use client";

import React, { useRef, useEffect } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

interface VideoSectionProps {
  videoUrl: string;
  label: string;
}

const VideoSection: React.FC<VideoSectionProps> = ({ videoUrl, label }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<Plyr | null>(null);

  useEffect(() => {
    if (videoRef.current) {
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
        // تنظیمات i18n برای فارسی کردن کنترل‌های پلیر
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

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoUrl]);

  return (
    // تنظیم جهت نمایش به صورت راست به چپ
    <div className="container mx-auto py-8" dir="rtl">
      <div className="w-full max-w-3xl mx-auto">
        <video ref={videoRef} className="plyr__video-embed" controls>
          <source src={videoUrl} type="video/mp4" />
        </video>
      </div>
      <p className="mt-4 text-lg font-semibold text-center">{label}</p>
    </div>
  );
};

export default VideoSection;
