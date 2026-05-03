"use client";

import Image from "next/image";
import Link from "next/link";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { aboutUsData } from "@/public/data";
import { useCounter } from "@/lib/hooks/useCounter";
import { AboutUsDecorations } from "./aboutUsDecorations";

const AboutUs: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  // once: true یعنی فقط یکبار اجرا بشه

  const clientCount = useCounter(
    isInView ? aboutUsData.stats[0].value : 0,
    1000
  );
  const employeeCount = useCounter(
    isInView ? aboutUsData.stats[1].value : 0,
    1000
  );
  const projectCount = useCounter(
    isInView ? aboutUsData.stats[2].value : 0,
    1000
  );

  return (
    <div className="z-10 py-20 container-md flex items-center justify-between gap-8 relative">
      {/* Right section */}
      <div className="flex-1">
        <h3 className="text-4xl mb-4 mt-16">{aboutUsData.title}</h3>
        <p className="leading-relaxed text-gray-800">
          {aboutUsData.description}
        </p>

        {/* stats */}
        <div ref={ref} className="flex items-center justify-between mt-10 px-8">
          {/* Clients */}
          <div className="text-mySecondary flex flex-col items-center gap-8">
            <div className="font-bold text-5xl ltr">+{clientCount}</div>
            <div className="bg-mySecondary h-2.5 w-16 rounded-full"></div>
            <div className="text-2xl font-medium">
              {aboutUsData.stats[0].label}
            </div>
          </div>

          {/* Employees */}
          <div className="text-mySecondary flex flex-col items-center gap-8">
            <div className="font-bold text-5xl ltr">+{employeeCount}</div>
            <div className="bg-mySecondary h-2.5 w-16 rounded-full"></div>
            <div className="text-2xl font-medium">
              {aboutUsData.stats[1].label}
            </div>
          </div>

          {/* Projects */}
          <div className="text-mySecondary flex flex-col items-center gap-8">
            <div className="font-bold text-5xl ltr">+{projectCount}</div>
            <div className="bg-mySecondary h-2.5 w-16 rounded-full"></div>
            <div className="text-2xl font-medium">
              {aboutUsData.stats[2].label}
            </div>
          </div>
        </div>

        <button className="bg-mySecondary rounded-full py-3 px-24 text-white mt-12 hover:scale-105 transition-transform">
          <Link href={"/about-us"} className="size-full text-xl font-medium">
            بیشتر
          </Link>
        </button>
      </div>

      {/* Left section */}
      <div className="flex-1 overflow-hidden">
        <div className="relative w-full h-[620px] mr-10">
          <Image
            src={aboutUsData.image.src}
            alt={aboutUsData.image.alt}
            fill
            className="object-cover"
          />
        </div>
      </div>
      <AboutUsDecorations />
    </div>
  );
};

export default AboutUs;
