"use client";

import { useCallback, useEffect } from "react";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { FiMenu, FiShoppingCart, FiX } from "react-icons/fi";
import { HiMiniArrowLeftEndOnRectangle } from "react-icons/hi2";
import { useSession } from "next-auth/react";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";
import { RiTelegram2Fill } from "react-icons/ri";

import NavbarLinks from "./NavbarLinks";
import useHideOnScroll from "./useHideOnScroll";
import SiteLogo from "@/components/branding/SiteLogo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { contactInfo } from "@/lib/constants/contact";
import { useCartStore } from "@/stores/cart-store";
import type { NavLinkItem } from "./nav-config";
import { useState } from "react";
import type { NavSocialLinks } from "./NavbarActions";

type NavbarMobileProps = {
  isDark: boolean;
  navbarData: NavLinkItem[];
  logoUrl?: string;
  siteName?: string;
  socials?: NavSocialLinks;
};

const NavbarMobile = ({
  navbarData,
  logoUrl,
  siteName,
  socials,
}: NavbarMobileProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isHidden = useHideOnScroll({ disabled: isOpen });
  const { data: session } = useSession();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const cartCount = useCartStore((state) => state.items.length);
  const authLink = session ? "/profile/acc" : "/login";
  const authLabel = session ? "داشبورد" : "ورود | ثبت‌نام";

  const openMenu = useCallback(() => setIsOpen(true), []);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [closeMenu, isOpen]);

  return (
    <>
      <div
        className={clsx(
          "fixed top-0 left-0 z-[9999] flex w-full items-center justify-between px-4 py-2.5 transition-transform duration-300 md:hidden",
          isHidden ? "-translate-y-full" : "translate-y-0",
          isOpen
            ? "border-b border-border/40 bg-background/80 text-foreground backdrop-blur-xl"
            : isHome
              ? "border-b border-transparent bg-transparent text-white"
              : "border-b border-border/30 bg-card/90 text-foreground shadow-sm backdrop-blur-md dark:bg-card/90"
        )}
      >
        <div className="relative flex w-full items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label={isOpen ? "بستن منو" : "باز کردن منو"}
              aria-expanded={isOpen}
              onClick={isOpen ? closeMenu : openMenu}
              className={clsx(
                "inline-flex size-10 items-center justify-center rounded-xl border transition-all duration-200",
                isOpen
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-border/70 bg-background/50 text-foreground hover:border-primary/30 hover:bg-primary/5"
              )}
            >
              <span className="relative block size-5">
                <FiMenu
                  className={clsx(
                    "absolute inset-0 size-5 transition-all duration-200",
                    isOpen ? "rotate-90 scale-75 opacity-0" : "rotate-0 opacity-100"
                  )}
                />
                <FiX
                  className={clsx(
                    "absolute inset-0 size-5 transition-all duration-200",
                    isOpen ? "rotate-0 opacity-100" : "-rotate-90 scale-75 opacity-0"
                  )}
                />
              </span>
            </button>
            <SiteLogo
              logoUrl={logoUrl}
              siteName={siteName}
              className="h-8 w-[96px]"
              priority
            />
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/checkout"
              className="relative inline-flex size-10 items-center justify-center rounded-xl border border-border/70 bg-background/40 text-foreground transition-colors hover:border-primary/30"
              aria-label="سبد خرید"
            >
              <FiShoppingCart className="size-[18px]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              href={authLink}
              className="inline-flex items-center gap-1.5 rounded-xl border border-primary/25 bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {authLabel}
              <HiMiniArrowLeftEndOnRectangle className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[9998] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              type="button"
              aria-label="بستن منو"
              className="absolute inset-0 bg-[#0A100E]/45 backdrop-blur-[2px]"
              onClick={closeMenu}
            />

            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="منوی موبایل"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-0 right-0 flex w-[min(100%,22rem)] flex-col border-l border-border/60 bg-background shadow-2xl shadow-black/25"
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-80"
                aria-hidden="true"
                style={{
                  backgroundImage:
                    "radial-gradient(ellipse 70% 40% at 100% 0%, hsl(var(--primary) / 0.12), transparent 55%), radial-gradient(ellipse 50% 35% at 0% 100%, hsl(var(--premium) / 0.08), transparent 50%)",
                }}
              />

              <div className="relative flex items-center justify-between border-b border-border/50 px-4 pb-3 pt-20">
                <div>
                  <p className="text-[11px] font-bold tracking-[0.14em] text-primary">منو</p>
                  <p className="mt-0.5 text-sm font-semibold text-foreground">
                    مسیر خود را انتخاب کنید
                  </p>
                </div>
                <ThemeToggle />
              </div>

              <div className="relative flex-1 overflow-y-auto px-4 py-5">
                <NavbarLinks
                  variant="mobile"
                  navbarData={navbarData}
                  onClick={closeMenu}
                />
              </div>

              <div className="relative space-y-4 border-t border-border/50 px-4 py-5">
                <Link
                  href={authLink}
                  onClick={closeMenu}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
                >
                  {authLabel}
                  <HiMiniArrowLeftEndOnRectangle className="size-4" />
                </Link>

                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] text-muted-foreground">شبکه‌های اجتماعی</p>
                  <div className="flex items-center gap-1.5">
                    <Link
                      href={socials?.instagram || contactInfo.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="اینستاگرام"
                      className="inline-flex size-9 items-center justify-center rounded-xl border border-border/70 text-muted-foreground transition hover:text-[#E1306C]"
                    >
                      <FaInstagram className="size-4" />
                    </Link>
                    <Link
                      href={socials?.telegram || contactInfo.socials.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="تلگرام"
                      className="inline-flex size-9 items-center justify-center rounded-xl border border-border/70 text-muted-foreground transition hover:text-[#229ED9]"
                    >
                      <RiTelegram2Fill className="size-4" />
                    </Link>
                    <Link
                      href={socials?.twitter || contactInfo.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="ایکس"
                      className="inline-flex size-9 items-center justify-center rounded-xl border border-border/70 text-muted-foreground transition hover:text-foreground"
                    >
                      <FaXTwitter className="size-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavbarMobile;
