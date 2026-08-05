"use client";

import Link from "next/link";
import { HiMiniArrowLeftEndOnRectangle } from "react-icons/hi2";
import { FiShoppingCart } from "react-icons/fi";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";
import { RiTelegram2Fill } from "react-icons/ri";
import clsx from "clsx";
import { contactInfo } from "@/lib/constants/contact";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/stores/cart-store";
import ThemeToggle from "@/components/ui/ThemeToggle";

interface NavbarActionsProps {
  isDark?: boolean;
}

const NavbarActions = ({ isDark }: NavbarActionsProps) => {
  const { data: session } = useSession();
  const cartCount = useCartStore((state) => state.items.length);
  const authLink = session ? "/profile/acc" : "/login";
  const authLabel = session ? "داشبورد" : "ورود | ثبت‌نام";

  return (
    <div className="mt-2 flex w-full items-center justify-between gap-5 px-8 sm:justify-center sm:gap-8 md:mt-0 md:w-fit md:px-0">
      <div className="flex items-center gap-3">
        <Link
          href={authLink}
          className={clsx(
            "inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200",
            isDark
              ? "border border-white/30 bg-white/10 text-white hover:bg-white/18"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          {authLabel}
          <HiMiniArrowLeftEndOnRectangle className="size-4" />
        </Link>

        <Link
          href="/checkout"
          className={clsx(
            "relative inline-flex size-10 items-center justify-center rounded-xl border transition-colors",
            isDark
              ? "border-white/25 text-white hover:bg-white/10"
              : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
          )}
          aria-label="سبد خرید"
        >
          <FiShoppingCart className="size-5" />
          {cartCount > 0 && (
            <span
              className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground"
              aria-label={`تعداد محصولات در سبد: ${cartCount}`}
            >
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      <div
        className={clsx(
          "flex items-center gap-1",
          isDark ? "text-white" : "text-muted-foreground"
        )}
      >
        <ThemeToggle />
        <Link
          href={contactInfo.socials.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="ایکس"
          className="rounded-lg p-1.5 transition-opacity hover:opacity-80"
        >
          <FaXTwitter className="size-[18px]" />
        </Link>
        <Link
          href={contactInfo.socials.instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="اینستاگرام"
          className="rounded-lg p-1.5 transition-colors hover:text-[#E1306C]"
        >
          <FaInstagram className="size-5" />
        </Link>
        <Link
          href={contactInfo.socials.telegram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="تلگرام"
          className="rounded-lg p-1.5 transition-colors hover:text-[#229ED9]"
        >
          <RiTelegram2Fill className="size-[18px]" />
        </Link>
      </div>
    </div>
  );
};

export default NavbarActions;
