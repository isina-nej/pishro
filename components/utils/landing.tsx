"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface LandingProps {
  imageUrl: string;
  title: string;
}

const Landing = ({ imageUrl, title }: LandingProps) => {
  return (
    <div className={cn("relative w-full h-[calc(100vh-115px)]")}>
      {/* Background image */}
      <Image
        src={imageUrl}
        alt="landing"
        fill
        sizes="100vw"
        className="object-cover"
        priority
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* White bottom gradient overlay */}
      <div className="absolute inset-x-0 bottom-0 h-[320px] bg-gradient-to-t from-white via-white/60 to-transparent z-20 pointer-events-none" />

      {/* Title */}
      <div className="absolute inset-0 z-30 flex items-start justify-center px-4 text-center">
        <h1 className="text-white text-3xl md:text-5xl font-bold drop-shadow-md mt-32">
          {title}
        </h1>
      </div>
    </div>
  );
};

export default Landing;
