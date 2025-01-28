"use client";

import { usePathname } from "next/navigation";
import { landingData } from "@/public/data";

const Landing = () => {
  const pathname = usePathname();

  // داده پیش‌فرض در صورتی که مسیر مطابقت نداشته باشد
  const data =
    landingData[pathname as keyof typeof landingData] || landingData["/"];

  return (
    <div
      className="relative h-[454px] bg-no-repeat bg-cover bg-center flex justify-center text-white"
      style={{ backgroundImage: `url('${data.backgroundImage}')` }}
    >
      <div className="mt-[140px] w-full mx-[90px]">
        <h1 className="text-2xl md:text-[32px] font-bold mb-6">{data.title}</h1>

        <p className="text-sm md:text-base font-semibold">{data.description}</p>
      </div>
    </div>
  );
};

export default Landing;
