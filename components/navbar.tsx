import React from "react";
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

// Import HoverCard components from shadcn
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";

const Navbar = () => {
  return (
    <nav className="h-[115px] w-full flex flex-col z-30">
      {/* قسمت بالایی */}
      <div className="px-[72px] py-5 h-20 flex justify-between items-center">
        {/* بخش سمت راست */}
        <div className="w-full max-w-[650px] flex items-center gap-6">
          <div className="h-10 w-[100px] flex items-center">
            <Image src={"/icons/Logo.png"} alt="logo" width={90} height={32} />
          </div>
          <div className="relative h-8 w-full max-w-[526px]">
            {/* آیکون جستجو */}
            <button className="absolute top-1/2 transform -translate-y-1/2 h-8 px-4">
              <SearchNormalIcon width={12} height={12} />
            </button>
            {/* اینپوت */}
            <Input
              type="text"
              placeholder="جستجو"
              className="pl-12 pr-12 w-full h-8"
            />
            {/* آیکون فیلتر */}
            <button className="absolute left-0 top-1/2 transform -translate-y-1/2 h-full w-7 bg-[#EDF4F8] border-transparent flex justify-center items-center rounded-l-sm">
              <FilterIcon width={20} height={20} />
            </button>
          </div>
        </div>
        {/* بخش سمت چپ */}
        <div className="flex items-center gap-7">
          <Link href={"/login"}>
            <button className="flex items-center gap-1">
              <UserIcon width={18} height={18} />
              <span className="font-medium text-xs"> ورود یا ثبت نام</span>
            </button>
          </Link>
          <button className="flex items-center gap-1">
            <BuyIcon width={18} height={18} />
            <span className="text-white bg-myPrimary size-4 rounded-[2px] text-xs font-bold text-center">
              6
            </span>
          </button>
        </div>
      </div>

      {/* قسمت پایین و منوها */}
      <div className="bg-mySecondary h-9 text-white text-xs px-[60px] relative">
        <ul className="h-9 flex items-center gap-5">
          {navbarData.map((item, idx) => (
            <React.Fragment key={idx}>
              <li className="group relative h-full flex items-center">
                {!item.data && (
                  <Link href={item.link} className="hover:text-gray-200">
                    {item.label}
                  </Link>
                )}
                {/* برای منوهای کشویی، HoverCard استفاده می‌شود */}
                {item.data && (
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Link href={item.link} className="hover:text-gray-200">
                        {item.label}
                      </Link>
                    </HoverCardTrigger>

                    {/* Dropdown Menu با HoverCardContent */}
                    {item.data && (
                      <HoverCardContent className="bg-white text-gray-800 min-w-[80px] shadow-lg rounded-sm z-50 mt-2">
                        {item.data.map((subItem, subIdx) => (
                          <Link
                            key={subIdx}
                            href={subItem.link}
                            className={cn(
                              "block p-1 hover:bg-gray-100 text-xs",
                              subIdx !== item.data.length ? "border-b" : ""
                            )}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </HoverCardContent>
                    )}
                  </HoverCard>
                )}
              </li>
              {idx === 8 && (
                <li className="border-l border-white h-6 mx-2"></li>
              )}
            </React.Fragment>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
