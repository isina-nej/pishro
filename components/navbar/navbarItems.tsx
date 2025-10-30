"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import NavbarLinks from "./NavbarLinks";
import NavbarActions from "./NavbarActions";

interface NavbarItemsProps {
  navbarData: (
    | { label: string; link: string; data?: undefined }
    | { label: string; link: string; data: { label: string; link: string }[] }
  )[];
  indicatorStyle: { left: number; width: number };
  setIndicatorStyle: React.Dispatch<
    React.SetStateAction<{ left: number; width: number }>
  >;
}

const NavbarItems = ({
  navbarData,
  indicatorStyle,
  setIndicatorStyle,
}: NavbarItemsProps) => {
  const [isIndicatorActive, setIsIndicatorActive] = useState(true);
  const pathname = usePathname();

  const isDark =
    pathname === "/" ||
    pathname === "/investment-consulting" ||
    pathname === "/investment-plans" ||
    pathname === "/investment-plans/custom";

  return (
    <div
      className={`absolute top-0 w-full z-[100] pt-4 md:pt-8 pb-4 md:pb-8 text-xs px-2 sm:px-8 md:px-[60px] flex flex-col md:flex-row justify-between items-center transition-colors duration-300 ${
        isDark
          ? "text-white bg-gradient-to-b from-black/70 via-black/40 to-transparent backdrop-blur-[2px]"
          : "text-mySecondary bg-transparent"
      }`}
      onMouseLeave={() => setIsIndicatorActive(false)}
    >
      {/* لیست منو */}
      <div className="relative w-full md:w-auto flex-1 flex justify-center md:justify-start">
        <ul className="h-full flex items-center gap-3 sm:gap-5 relative flex-wrap">
          {navbarData.map((item, idx) => (
            <li
              key={idx}
              className="group relative h-full flex items-center pb-1"
              onMouseEnter={(e) => {
                const target = e.currentTarget;
                setIndicatorStyle({
                  left: target.offsetLeft,
                  width: target.clientWidth,
                });
                setIsIndicatorActive(true);
              }}
            >
              {item.label && <NavbarLinks navbarData={[item]} />}
            </li>
          ))}

          {/* Underline indicator */}
          <div
            className={`absolute bottom-0 h-[2px] rounded transition-all duration-300 ${
              isIndicatorActive
                ? isDark
                  ? "bg-red-500"
                  : "bg-mySecondary"
                : "opacity-0"
            }`}
            style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
          />
        </ul>
      </div>

      {/* بخش اکشن و سوشال */}
      <NavbarActions isDark={isDark} />
    </div>
  );
};

export default NavbarItems;
