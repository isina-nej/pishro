// app/components/TransparentVideoPlayer.tsx
"use client";

import { useRef, useEffect } from "react";

interface TransparentVideoPlayerProps {
  src: string;
  videoWidthClass?: string; // for responsiveness (e.g. max-w-4xl, w-[800px])
}

const TransparentVideoPlayer: React.FC<TransparentVideoPlayerProps> = ({
  src,
  videoWidthClass = "w-[800px]",
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch((e) => console.error("Autoplay failed:", e));
    }
  }, []);

  return (
    <div className="relative w-full overflow-hidden isolate">
      {/* Transparent gradient overlays */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[40%] bg-[linear-gradient(to_right,_#ffe8c7_70%,_transparent_100%)] z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[40%] bg-[linear-gradient(to_left,_#ffe8c7_70%,_transparent_100%)] z-10" />

      {/* Video centered */}
      <div className="flex justify-center items-center">
        <video
          ref={videoRef}
          src={src}
          className={`${videoWidthClass} rounded-md shadow-lg z-0`}
          muted
          autoPlay
          loop
          playsInline
        />
      </div>
    </div>
  );
};

export default TransparentVideoPlayer;
