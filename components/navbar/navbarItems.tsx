"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiMiniArrowLeftEndOnRectangle } from "react-icons/hi2";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";
import { RiTelegram2Fill } from "react-icons/ri";
import { FiShoppingCart } from "react-icons/fi";
import NavbarPopover from "./navbarPopover";
import clsx from "clsx";

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
  const pathname = usePathname(); // 👈 get current route

  const isDark =
    pathname === "/" ||
    pathname === "/investment-consulting" ||
    pathname === "/investment-plans"; // 👈 check if we are on homepage

  return (
    <div
      className={`absolute top-0 w-full z-[100] pt-8 pb-8 text-xs px-[60px] flex justify-between items-center transition-colors duration-300
        ${
          isDark
            ? "text-white bg-gradient-to-b from-black/70 via-black/40 to-transparent backdrop-blur-[2px]"
            : "text-mySecondary bg-transparent"
        }`}
      onMouseLeave={() => setIsIndicatorActive(false)}
    >
      <ul className="h-full flex items-center gap-5 relative">
        {navbarData.map((item, idx) => (
          <React.Fragment key={idx}>
            <li
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
              {item.data ? (
                <NavbarPopover item={item} />
              ) : (
                <Link
                  href={item.link}
                  className={`relative inline-block transition-colors hover:opacity-80 ${
                    isDark ? "text-white" : "text-mySecondary"
                  }`}
                >
                  {item.label}
                </Link>
              )}
            </li>

            {idx === 9 && (
              <li
                className={`border-l h-6 mx-2 ${
                  isDark ? "border-white" : "border-mySecondary/50"
                }`}
              ></li>
            )}
          </React.Fragment>
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
        ></div>
      </ul>

      <div className="flex items-center gap-10">
        {/* login / signup */}
        <div className="flex items-center gap-4">
          <Link
            href={"/login"}
            className={`border transition-colors pr-4 pl-5 py-1.5 rounded-lg ${
              isDark
                ? "border-white hover:bg-black/20"
                : "border-mySecondary hover:bg-mySecondary/10"
            }`}
          >
            <button className="flex items-center gap-1">
              <HiMiniArrowLeftEndOnRectangle className="size-5" />
              <span className="font-medium text-xs">ورود | ثبت نام</span>
            </button>
          </Link>

          <Link href={"/checkout"} className="group">
            <button className="flex items-center gap-1">
              <FiShoppingCart
                className={clsx(
                  "size-6 ",
                  isDark ? "text-white" : "text-mySecondary "
                )}
              />
            </button>
          </Link>
        </div>

        {/* social links */}
        <div
          className={`flex items-center gap-2 ${
            isDark ? "text-white" : "text-mySecondary"
          }`}
        >
          <Link
            href="https://x.com/YourXAccount"
            target="_blank"
            className="hover:opacity-80 transition-colors p-1"
          >
            <FaXTwitter className="size-5" />
          </Link>
          <Link
            href="https://instagram.com/YourInstagram"
            target="_blank"
            className="hover:text-[#E1306C] transition-colors p-1"
          >
            <FaInstagram className="size-5" />
          </Link>
          <Link
            href="https://t.me/YourTelegram"
            target="_blank"
            className="hover:text-[#229ED9] transition-colors p-1"
          >
            <RiTelegram2Fill className="size-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavbarItems;
