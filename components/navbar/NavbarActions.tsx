"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HiMiniArrowLeftEndOnRectangle } from "react-icons/hi2";
import { FiShoppingCart } from "react-icons/fi";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";
import { RiTelegram2Fill } from "react-icons/ri";
import { cn } from "@/lib/utils";
import { contactInfo } from "@/lib/constants/contact";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/stores/cart-store";
import ThemeToggle from "@/components/ui/ThemeToggle";

export type NavSocialLinks = {
  instagram?: string;
  telegram?: string;
  twitter?: string;
};

interface NavbarActionsProps {
  isDark?: boolean;
  socials?: NavSocialLinks;
  /** فشرده‌تر برای نوبار شیشه‌ای دسکتاپ */
  compact?: boolean;
}

const iconBtn = (isDark?: boolean) =>
  cn(
    "inline-flex size-9 items-center justify-center rounded-xl border transition-all duration-300 hover:scale-105 active:scale-95",
    isDark
      ? "border-white/20 bg-white/10 text-white hover:bg-white/18"
      : "border-border/70 bg-card/70 text-muted-foreground hover:border-primary/35 hover:text-foreground"
  );

const NavbarActions = ({
  isDark,
  socials,
  compact = false,
}: NavbarActionsProps) => {
  const { data: session } = useSession();
  const cartCount = useCartStore((state) => state.items.length);
  const authLink = session ? "/profile/acc" : "/login";
  const authLabel = session ? "داشبورد" : "ورود | ثبت‌نام";
  const authShort = session ? "حساب" : "ورود";
  const instagram = socials?.instagram || contactInfo.socials.instagram;
  const telegram = socials?.telegram || contactInfo.socials.telegram;
  const twitter = socials?.twitter || contactInfo.socials.linkedin;

  return (
    <div
      className={cn(
        "flex items-center",
        compact
          ? "gap-1.5"
          : "mt-2 w-full justify-between gap-5 px-8 sm:justify-center sm:gap-8 md:mt-0 md:w-fit md:px-0"
      )}
    >
      <div className={cn("flex items-center", compact ? "gap-1.5" : "gap-3")}>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Link
            href={authLink}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-xl text-xs font-semibold transition-all duration-300",
              compact ? "px-2.5 py-2 xl:px-3.5" : "px-4 py-2",
              isDark
                ? "border border-white/25 bg-white/12 text-white hover:bg-white/20"
                : "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90"
            )}
          >
            <span className={cn(compact && "hidden xl:inline")}>{authLabel}</span>
            {compact ? (
              <span className="xl:hidden">{authShort}</span>
            ) : null}
            <HiMiniArrowLeftEndOnRectangle className="size-4" />
          </Link>
        </motion.div>

        <Link
          href="/checkout"
          className={iconBtn(isDark)}
          aria-label="سبد خرید"
        >
          <span className="relative">
            <FiShoppingCart className="size-[18px]" />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                {cartCount}
              </span>
            )}
          </span>
        </Link>
      </div>

      <div
        className={cn(
          "flex items-center",
          compact ? "gap-0.5" : "gap-1",
          isDark ? "text-white" : "text-muted-foreground"
        )}
      >
        <ThemeToggle />
        <div
          className={cn(
            "items-center",
            compact ? "hidden gap-0.5 2xl:flex" : "flex gap-1"
          )}
        >
          <Link
            href={twitter}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ایکس"
            className="rounded-lg p-1.5 transition-all duration-300 hover:scale-110 hover:opacity-90"
          >
            <FaXTwitter className="size-4" />
          </Link>
          <Link
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="اینستاگرام"
            className="rounded-lg p-1.5 transition-all duration-300 hover:scale-110 hover:text-[#E1306C]"
          >
            <FaInstagram className="size-[18px]" />
          </Link>
          <Link
            href={telegram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="تلگرام"
            className="rounded-lg p-1.5 transition-all duration-300 hover:scale-110 hover:text-[#229ED9]"
          >
            <RiTelegram2Fill className="size-[18px]" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavbarActions;
