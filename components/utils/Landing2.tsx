"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Typewriter } from "react-simple-typewriter";
import React from "react";

interface LandingProps {
  imageUrl: string;
  title: string;
  titleColor?: string;
}

const Landing2 = ({ imageUrl, title, titleColor = "#fff" }: LandingProps) => {
  return (
    <div className={cn("relative w-full h-screen")}>
      {/* Background image */}
      <Image
        src={imageUrl}
        alt="landing"
        fill
        sizes="100vw"
        className="object-cover"
        priority
      />

      {/* Soft dark vignette — keep photo clear */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-black/10 to-black/50" />

      {/* Title with animation */}
      <div className="absolute inset-0 z-30 flex items-center justify-center px-4 text-center">
        <h1 className="mb-12 text-3xl font-bold text-white drop-shadow-md md:text-5xl">
          به دنیای{""}
          <span
            className="inline-block text:4xl md:text-7xl"
            style={{ color: titleColor }}
          >
            <Typewriter
              words={[title]}
              loop={0} // infinite
              cursor
              cursorStyle="|"
              typeSpeed={100}
              deleteSpeed={70}
              delaySpeed={1500}
            />
          </span>
          خوش آمدید
        </h1>
      </div>
    </div>
  );
};

export default Landing2;
