import React from "react";
import Link from "next/link";
import { HiMiniArrowLeftEndOnRectangle } from "react-icons/hi2";
import { FiShoppingCart } from "react-icons/fi";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";
import { RiTelegram2Fill } from "react-icons/ri";
import clsx from "clsx";
import { contactInfo } from "@/lib/constants/contact";

interface NavbarActionsProps {
  isDark?: boolean;
}

const NavbarActions: React.FC<NavbarActionsProps> = ({ isDark }) => (
  <div className="w-full md:w-fit flex items-center justify-between sm:justify-center px-8 md:px-0 gap-6 sm:gap-10 mt-2 md:mt-0">
    {/* login/signup & cart */}
    <div className="flex items-center gap-4">
      <Link
        href={"/login"}
        className={clsx(
          "border transition-colors pr-4 pl-5 py-1.5 rounded-lg",
          isDark
            ? "border-white hover:bg-black/20 text-white"
            : "border-mySecondary hover:bg-mySecondary/10"
        )}
      >
        <span className="flex items-center gap-1 font-medium text-xs">
          <HiMiniArrowLeftEndOnRectangle className="size-5" /> ورود | ثبت نام
        </span>
      </Link>
      <Link href={"/checkout"} className="group">
        <span className="flex items-center gap-1">
          <FiShoppingCart
            className={clsx(
              "size-6",
              isDark ? "text-white" : "text-mySecondary"
            )}
          />
        </span>
      </Link>
    </div>
    {/* social links */}
    <div
      className={clsx(
        "flex items-center gap-2 text-xs sm:text-sm md:text-base",
        isDark ? "text-white" : "text-mySecondary"
      )}
    >
      <Link
        href={contactInfo.socials.linkedin}
        target="_blank"
        className="hover:opacity-80 transition-colors p-1"
      >
        <FaXTwitter className="size-5" />
      </Link>
      <Link
        href={contactInfo.socials.instagram}
        target="_blank"
        className="hover:text-[#E1306C] transition-colors p-1"
      >
        <FaInstagram className="size-6" />
      </Link>
      <Link
        href={contactInfo.socials.telegram}
        target="_blank"
        className="hover:text-[#229ED9] transition-colors p-1"
      >
        <RiTelegram2Fill className="size-5" />
      </Link>
    </div>
  </div>
);

export default NavbarActions;
