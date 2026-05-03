// @/components/video/videoPlayer.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { useVideoToken } from "@/lib/hooks/useVideos";

interface VideoPlayerProps {
  videoId: string;
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  poster?: string; // URL تصویر thumbnail
  onError?: (error: Error) => void;
  onReady?: () => void;
}

export function VideoPlayer({
  videoId,
  className = "",
  autoPlay = false,
  controls = true,
  poster,
  onError,
  onReady,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // دریافت توکن پخش
  const { refetch: getToken } = useVideoToken(videoId);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const initPlayer = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // دریافت توکن
        const { data: tokenData, error: tokenError } = await getToken();

        if (tokenError || !tokenData) {
          throw new Error("خطا در دریافت توکن پخش");
        }

        const token = tokenData.token;

        // ساخت URL پخش با توکن
        const playlistUrl = `/api/video/stream/${videoId}/index.m3u8?token=${token}`;

        // بررسی پشتیبانی از HLS
        if (Hls.isSupported()) {
          // استفاده از hls.js برای مرورگرهایی که HLS را پشتیبانی نمی‌کنند
          const hls = new Hls({
            debug: false,
            enableWorker: true,
            lowLatencyMode: false,
            backBufferLength: 90,
          });

          hlsRef.current = hls;

          hls.loadSource(playlistUrl);
          hls.attachMedia(video);

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log("HLS manifest loaded");
            setIsLoading(false);
            onReady?.();

            if (autoPlay) {
              video.play().catch((err) => {
                console.error("Auto-play failed:", err);
              });
            }
          });

          hls.on(Hls.Events.ERROR, (event, data) => {
            console.error("HLS error:", data);

            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  setError("خطای شبکه. لطفاً اتصال اینترنت خود را بررسی کنید.");
                  hls.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  setError("خطا در پخش ویدیو.");
                  hls.recoverMediaError();
                  break;
                default:
                  setError("خطایی در پخش ویدیو رخ داد.");
                  onError?.(new Error(data.details));
                  break;
              }
            }
          });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          // پشتیبانی native HLS (Safari)
          video.src = playlistUrl;

          video.addEventListener("loadedmetadata", () => {
            console.log("Video metadata loaded");
            setIsLoading(false);
            onReady?.();
          });

          video.addEventListener("error", () => {
            setError("خطایی در بارگذاری ویدیو رخ داد.");
            onError?.(new Error("Video load error"));
          });
        } else {
          setError("مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.");
          onError?.(new Error("HLS not supported"));
        }
      } catch (err) {
        console.error("Player initialization error:", err);
        setError(
          err instanceof Error ? err.message : "خطا در راه‌اندازی پخش‌کننده"
        );
        onError?.(err as Error);
      }
    };

    initPlayer();

    // Cleanup
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [videoId, autoPlay, getToken, onError, onReady]);

  return (
    <div className={`relative ${className}`}>
      {/* Video Element */}
      <video
        ref={videoRef}
        controls={controls}
        poster={poster}
        className="w-full h-full rounded-lg"
        playsInline
      >
        مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
      </video>

      {/* Loading Overlay */}
      {isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-white text-sm">در حال بارگذاری...</p>
          </div>
        </div>
      )}

      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 rounded-lg">
          <div className="text-center px-4">
            <svg
              className="w-16 h-16 mx-auto text-red-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-white text-lg font-semibold mb-2">
              خطا در پخش ویدیو
            </p>
            <p className="text-gray-300 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              تلاش مجدد
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
