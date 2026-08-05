"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import NavbarActions from "./NavbarActions";
import NavbarPopover from "./navbarPopover";
import HoverableLink from "./HoverableLink";
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
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  return (
    <div
      className={clsx(
        "absolute top-0 z-[100] flex w-full flex-col items-center justify-between px-2 pb-4 pt-4 text-xs transition-colors duration-300 sm:px-8 md:flex-row md:px-[60px] md:pb-8 md:pt-8",
        isDark
          ? "bg-gradient-to-b from-black/65 via-black/35 to-transparent text-white"
          : "bg-transparent text-muted-foreground"
      )}
      onMouseLeave={() => setIsIndicatorActive(false)}
    >
      <div className="mb-3 shrink-0 md:mb-0 md:ml-4">
        <SiteLogo
          logoUrl={logoUrl}
          siteName={siteName}
          priority
          className={isDark ? "brightness-110" : undefined}
        />
      </div>

      <div className="relative flex w-full flex-1 justify-center md:w-auto md:justify-start">
        <ul className="relative flex h-full flex-wrap items-center gap-0.5 md:gap-1">
          {navbarData.map((item) => {
            const active = isActivePath(pathname, item.link);
            return (
              <li
                key={item.link}
                className="group relative flex h-full items-center pb-1"
                onMouseEnter={(e) => {
                  const target = e.currentTarget;
                  setIndicatorStyle({
                    left: target.offsetLeft,
                    width: target.clientWidth,
                  });
                  setIsIndicatorActive(true);
                }}
              >
                {"data" in item && item.data?.length ? (
                  <NavbarPopover item={item as NavLinkItem & { data: { label: string; link: string }[] }} />
                ) : (
                  item.label && (
                    <div
                      className={clsx(
                        "rounded-lg transition-colors",
                        active && (isDark ? "bg-white/10" : "bg-primary/8")
                      )}
                    >
                      <HoverableLink label={item.label} href={item.link} />
                    </div>
                  )
                )}
              </li>
            );
          })}

          <div
            className={clsx(
              "absolute bottom-0 h-[2px] rounded-full transition-all duration-300",
              isIndicatorActive
                ? isDark
                  ? "bg-white/75"
                  : "bg-primary/80"
                : "opacity-0"
            )}
            style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
          />
        </ul>
      </div>

      <NavbarActions isDark={isDark} socials={socials} />
    </div>
  );
};

export default NavbarDesktop;
