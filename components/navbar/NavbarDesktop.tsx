"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

import NavbarActions from "./NavbarActions";
import NavbarPopover from "./navbarPopover";
import SiteLogo from "@/components/branding/SiteLogo";
import type { NavLinkItem } from "./nav-config";
import type { NavSocialLinks } from "./NavbarActions";

interface NavbarDesktopProps {
  isDark: boolean;
  logoUrl?: string;
  siteName?: string;
  navbarData: NavLinkItem[];
  socials?: NavSocialLinks;
}

function isActivePath(pathname: string | null, link: string) {
  if (!pathname) return false;
  if (link === "/") return pathname === "/";
  return pathname === link || pathname.startsWith(`${link}/`);
}

const NavbarDesktop = ({
  isDark,
  navbarData,
  logoUrl,
  siteName,
  socials,
}: NavbarDesktopProps) => {
  const pathname = usePathname();
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-[100] px-3 pt-3 sm:px-5 lg:px-6">
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className={cn(
          "pointer-events-auto relative mx-auto flex h-14 max-w-[1480px] items-center gap-2 rounded-2xl border px-2.5 shadow-2xl backdrop-blur-2xl sm:h-[3.75rem] sm:gap-3 sm:px-3 lg:px-4",
          isDark
            ? "border-white/15 bg-white/10 text-white dark:border-white/12 dark:bg-[rgba(12,18,15,0.55)]"
            : "border-border/70 bg-[rgba(251,249,245,0.92)] text-foreground shadow-primary/10 dark:border-white/12 dark:bg-[rgba(12,18,15,0.72)] dark:text-white"
        )}
        style={{
          boxShadow: isDark
            ? "0 18px 50px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)"
            : "0 14px 40px rgba(11,61,46,0.12), inset 0 1px 0 rgba(255,255,255,0.7)",
        }}
      >
        {/* ambient glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
        >
          <div className="absolute -right-10 -top-10 size-32 rounded-full bg-primary/25 blur-3xl" />
          <div className="absolute -bottom-12 left-1/3 size-40 rounded-full bg-[rgba(var(--home-gold-rgb,184,145,58),0.12)] blur-3xl" />
        </div>

        <div className="relative z-10 shrink-0">
          <SiteLogo
            logoUrl={logoUrl}
            siteName={siteName}
            priority
            className={cn("h-8 w-[96px] lg:h-9 lg:w-[110px]", isDark && "brightness-110")}
          />
        </div>

        <nav
          className="relative z-10 min-w-0 flex-1"
          aria-label="منوی اصلی"
          onMouseLeave={() => setHoveredLink(null)}
        >
          <ul className="flex items-center justify-center gap-0.5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {navbarData.map((item) => {
              const active = isActivePath(pathname, item.link);
              const showPill = hoveredLink === item.link || active;

              return (
                <li
                  key={item.link}
                  className="relative shrink-0"
                  onMouseEnter={() => setHoveredLink(item.link)}
                >
                  {"data" in item && item.data?.length ? (
                    <div className="relative">
                      {showPill && (
                        <motion.span
                          layoutId="nav-desktop-pill"
                          className={cn(
                            "absolute inset-0 rounded-xl",
                            isDark ? "bg-white/14" : "bg-primary/12"
                          )}
                          transition={{
                            type: "spring",
                            stiffness: 420,
                            damping: 32,
                          }}
                        />
                      )}
                      <div className="relative z-10">
                        <NavbarPopover
                          item={
                            item as NavLinkItem & {
                              data: { label: string; link: string }[];
                            }
                          }
                        />
                      </div>
                    </div>
                  ) : item.label ? (
                    <Link
                      href={item.link}
                      className={cn(
                        "relative z-10 block whitespace-nowrap rounded-xl px-2 py-2 text-[11px] font-semibold tracking-tight transition-colors duration-300 lg:px-2.5 lg:text-xs xl:px-3 xl:text-[13px]",
                        isDark
                          ? active
                            ? "text-white"
                            : "text-white/80 hover:text-white"
                          : active
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {showPill && (
                        <motion.span
                          layoutId="nav-desktop-pill"
                          className={cn(
                            "absolute inset-0 -z-10 rounded-xl",
                            isDark ? "bg-white/14" : "bg-primary/12"
                          )}
                          transition={{
                            type: "spring",
                            stiffness: 420,
                            damping: 32,
                          }}
                        />
                      )}
                      <span className="relative">{item.label}</span>
                      <AnimatePresence>
                        {active && (
                          <motion.span
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: 1, opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={cn(
                              "absolute inset-x-3 -bottom-0.5 h-0.5 origin-center rounded-full",
                              isDark ? "bg-[var(--home-gold,#D4B06A)]" : "bg-primary"
                            )}
                          />
                        )}
                      </AnimatePresence>
                    </Link>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="relative z-10 shrink-0">
          <NavbarActions isDark={isDark} socials={socials} compact />
        </div>
      </motion.div>
    </div>
  );
};

export default NavbarDesktop;
