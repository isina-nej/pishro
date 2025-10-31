"use client";

import React, { useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";
import { HiMiniArrowLeftEndOnRectangle } from "react-icons/hi2";
import { navbarData } from "@/public/data";
import NavbarItems from "./navbarItems";
import NavbarLinks from "./NavbarLinks";
import NavbarActions from "./NavbarActions";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isDark =
    pathname === "/" ||
    pathname === "/investment-consulting" ||
    pathname === "/investment-plans" ||
    pathname === "/investment-plans/custom";

  return (
    <nav className="w-full flex flex-col z-[100]">
      {/* دسکتاپ: NavbarItems نمایش فقط در سایز md به بالا */}
      <div className="hidden md:block">
        <NavbarItems
          isDark={isDark}
          navbarData={navbarData}
          indicatorStyle={indicatorStyle}
          setIndicatorStyle={setIndicatorStyle}
        />
      </div>
      {/* موبایل: همبرگری و منوی تمام صفحه */}
      <div
        className={clsx(
          "fixed top-0 left-0 w-full flex justify-between items-center md:hidden py-2 px-4 z-[100]",
          mobileMenuOpen
            ? "bg-mySecondary/5 text-white border-b border-white/20"
            : "bg-white/95 backdrop-blur-sm shadow-md"
        )}
      >
        <div className="flex justify-between items-center w-full relative">
          <div className="flex items-center gap-2">
            {mobileMenuOpen ? (
              <button
                aria-label="بستن منو"
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl focus:outline-none p-2"
              >
                <FiX />
              </button>
            ) : (
              <button
                aria-label="باز کردن منو"
                onClick={() => setMobileMenuOpen(true)}
                className="text-2xl focus:outline-none p-2"
              >
                <FiMenu />
              </button>
            )}
            <span className="font-bold text-lg">پیشرو</span>
          </div>
          <div>
            <div className="flex items-center gap-4">
              <Link
                href={"/login"}
                className={clsx(
                  "border transition-colors pr-2 pl-2 py-1.5 rounded-lg text-sm",
                  !isDark
                    ? "border-white hover:bg-black/20 text-white"
                    : "border-mySecondary hover:bg-mySecondary/10",
                  mobileMenuOpen ? "border-white" : "border-mySecondary"
                )}
              >
                <span className="flex items-center gap-1 font-medium text-xs">
                  ورود | ثبت نام
                  <HiMiniArrowLeftEndOnRectangle className="size-4" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* منوی تمام‌صفحه موبایل */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-mySecondary/95 backdrop-blur-md animate-fade-in transition-all pt-20">
          <NavbarLinks
            navbarData={navbarData}
            onClick={() => setMobileMenuOpen(false)}
            className="flex flex-col items-start gap-6 px-8 text-lg text-white"
          />
          <div className="flex flex-col items-center mt-10 gap-4">
            <NavbarActions isDark={isDark} />
          </div>
          {/* Overlay برای بسته‌شدن با کلیک روی اطراف */}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
