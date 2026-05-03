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

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55 z-10" />

      {/* White bottom gradient overlay */}
      <div className="absolute inset-x-0 bottom-0 h-[160px] bg-gradient-to-t from-black/80 via-black/30 to-transparent z-20 pointer-events-none" />

      {/* Title with animation */}
      <div className="absolute inset-0 z-30 flex items-center justify-center px-4 text-center">
        <h1 className="text-white text-3xl md:text-5xl font-bold drop-shadow-md mb-12">
          به دنیای{" "}
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
