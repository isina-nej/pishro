"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HiMiniArrowLeftEndOnRectangle } from "react-icons/hi2";
import { FiShoppingCart } from "react-icons/fi";
import { Globe } from "lucide-react";
import { DynamicIcon } from "@/components/site/DynamicIcon";
import { cn } from "@/lib/utils";
import { contactInfo } from "@/lib/constants/contact";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/stores/cart-store";
import ThemeToggle from "@/components/ui/ThemeToggle";
import SoundMuteToggle from "@/components/sound/SoundMuteToggle";
import type { FooterSocialItem } from "@/lib/site/chrome-content";

/** @deprecated trio shape — Navbar now receives FooterSocialItem[] from layout. */
export type NavSocialLinks = {
  instagram?: string;
  telegram?: string;
  twitter?: string;
};

type NavbarSocialsInput = NavSocialLinks | FooterSocialItem[];

function normalizeSocials(
  socials: NavbarSocialsInput | undefined
): FooterSocialItem[] {
  if (Array.isArray(socials)) return socials;
  return [
    {
      id: "instagram",
      name: "اینستاگرام",
      href: socials?.instagram || contactInfo.socials.instagram,
      icon: "Instagram",
    },
    {
      id: "telegram",
      name: "تلگرام",
      href: socials?.telegram || contactInfo.socials.telegram,
      icon: "Send",
    },
    {
      id: "x",
      name: "ایکس",
      href: socials?.twitter || contactInfo.socials.linkedin,
      icon: "Twitter",
    },
  ];
}

interface NavbarActionsProps {
  isDark?: boolean;
  socials?: NavbarSocialsInput;
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
  const socialItems = normalizeSocials(socials);

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
            data-sound="auth"
            data-sound-role="auth"
            data-cursor="button"
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
          data-sound="cart"
          data-sound-role="cart"
          data-cursor="cart"
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
        <SoundMuteToggle
          className={
            isDark
              ? "border border-white/20 bg-white/10 text-white hover:bg-white/18"
              : undefined
          }
        />
        <ThemeToggle />
        <div
          className={cn(
            "items-center",
            compact ? "hidden gap-0.5 2xl:flex" : "flex gap-1"
          )}
        >
          {socialItems.map((social) => (
            <Link
              key={social.id || social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              title={social.name}
              className="rounded-lg p-1.5 transition-all duration-300 hover:scale-110 hover:text-foreground"
            >
              <DynamicIcon name={social.icon} fallback={Globe} className="size-4" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavbarActions;
