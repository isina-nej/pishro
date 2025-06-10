"use client";

import { usePathname } from "next/navigation";
import { landingData } from "@/public/data";
import { cn } from "@/lib/utils";

interface LandingProps {
  size?: "small" | "normal";
  darker?: boolean;
}

const Landing = ({ size = "normal", darker }: LandingProps) => {
  const pathname = usePathname();

  // داده پیش‌فرض در صورتی که مسیر مطابقت نداشته باشد
  const data =
    landingData[pathname as keyof typeof landingData] || landingData["/"];

  return (
    <div
      className={cn(
        "relative bg-no-repeat bg-cover bg-center flex justify-center text-white",
        size === "small" ? "h-[360px]" : "",
        size === "normal" ? "h-[474px]" : ""
      )}
      style={{ backgroundImage: `url('${data.backgroundImage}')` }}
    >
      {/* Overlay */}
      <div
        className={cn("absolute inset-0 bg-black/30", darker ? "" : "hidden")}
      ></div>

      <div className="relative mt-[140px] w-full mx-[90px]">
        <h1 className="text-2xl md:text-4xl font-bold mb-6">{data.title}</h1>
        <p className="text-sm md:text-base font-semibold">{data.description}</p>
      </div>
    </div>
  );
};

export default Landing;
