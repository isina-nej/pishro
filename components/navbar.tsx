"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  SearchNormalIcon,
  FilterIcon,
  UserIcon,
  BuyIcon,
} from "@/public/svgr-icons";
import { navbarData } from "@/public/data";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

const Navbar = () => {
  // State to hold the indicator's position and width for the animated underline
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  return (
    <nav className="h-[115px] w-full flex flex-col z-30">
      {/* Upper Section */}
      <div className="px-[72px] py-5 h-20 flex justify-between items-center">
        {/* Left Section */}
        <div className="w-full max-w-[650px] flex items-center gap-6">
          <div className="h-10 w-[100px] flex items-center">
            <Image src={"/icons/Logo.png"} alt="logo" width={90} height={32} />
          </div>
          <div className="relative h-8 w-full max-w-[526px]">
            {/* Search Icon */}
            <button className="absolute top-1/2 transform -translate-y-1/2 h-8 px-4">
              <SearchNormalIcon width={12} height={12} />
            </button>
            {/* Input Field */}
            <Input
              type="text"
              placeholder="جستجو"
              className="pl-12 pr-12 w-full h-8"
            />
            {/* Filter Icon */}
            <button className="absolute left-0 top-1/2 transform -translate-y-1/2 h-full w-7 bg-[#EDF4F8] border-transparent flex justify-center items-center rounded-l-sm">
              <FilterIcon width={20} height={20} />
            </button>
          </div>
        </div>
        {/* Right Section */}
        <div className="flex items-center gap-7">
          <Link href={"/login"}>
            <button className="flex items-center gap-1">
              <UserIcon width={18} height={18} />
              <span className="font-medium text-xs"> ورود یا ثبت نام</span>
            </button>
          </Link>
          <Link href={"/checkout"}>
            <button className="flex items-center gap-1">
              <BuyIcon width={18} height={18} />
              <span className="text-white bg-myPrimary size-4 rounded-[2px] text-xs font-bold text-center">
                2
              </span>
            </button>
          </Link>
        </div>
      </div>

      {/* Bottom Section with Navbar Items */}
      <div
        className="bg-mySecondary h-9 text-white text-xs px-[60px] relative"
        // Hide the indicator when the mouse leaves the container
        onMouseLeave={() => setIndicatorStyle({ left: 0, width: 0 })}
      >
        <ul className="h-9 flex items-center gap-5 relative">
          {navbarData.map((item, idx) => (
            <React.Fragment key={idx}>
              <li
                className="group relative h-full flex items-center"
                // Update the indicator position and width on mouse enter
                onMouseEnter={(e) => {
                  const target = e.currentTarget;
                  setIndicatorStyle({
                    left: target.offsetLeft,
                    width: target.clientWidth,
                  });
                }}
              >
                {/* If item has no dropdown data */}
                {!item.data && (
                  <Link
                    href={item.link}
                    className="hover:text-gray-200 relative inline-block"
                  >
                    {item.label}
                  </Link>
                )}
                {/* If item has dropdown data, use Popover */}
                {item.data && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Link
                        href={item.link}
                        className="hover:text-gray-200 relative flex items-center gap-1"
                      >
                        {item.label}
                        {/* Down arrow icon added next to label */}
                        <ChevronDown className="w-4 h-4" />
                      </Link>
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      className="bg-white text-gray-800 min-w-[80px] w-fit shadow-lg rounded-sm z-50 mt-2 p-3"
                    >
                      {item.data.map((subItem, subIdx) => {
                        return (
                          <Link
                            key={subIdx}
                            href={subItem.link}
                            className={cn(
                              "block p-1 hover:bg-gray-100 text-xs",
                              subIdx !== item.data.length - 1 ? "border-b" : ""
                            )}
                          >
                            {subItem.label}
                          </Link>
                        );
                      })}
                    </PopoverContent>
                  </Popover>
                )}
              </li>
              {idx === 8 && (
                <li className="border-l border-white h-6 mx-2"></li>
              )}
            </React.Fragment>
          ))}
          {/* Animated Red Underline Indicator */}
          <div
            className="absolute bottom-0 h-[2px] bg-red-500 transition-all duration-300"
            style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
          ></div>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
