"use client";

import { useMemo } from "react";
import NavbarDesktop from "./NavbarDesktop";
import NavbarMobile from "./NavbarMobile";
import { useIsDarkNavbar } from "./useNavbarTheme";
import { filterNavByHiddenPages } from "@/lib/site/hidable-pages";
import {
  DEFAULT_NAVBAR_ITEMS,
  type NavbarItem,
} from "@/lib/site/chrome-content";
import type { NavSocialLinks } from "./NavbarActions";

type NavbarProps = {
  logoUrl?: string;
  siteName?: string;
  hiddenPages?: string[];
  navItems?: NavbarItem[];
  socials?: NavSocialLinks;
};

const Navbar = ({
  logoUrl,
  siteName,
  hiddenPages = [],
  navItems,
  socials,
}: NavbarProps) => {
  const isDark = useIsDarkNavbar();
  const links = useMemo(
    () =>
      filterNavByHiddenPages(
        navItems?.length ? navItems : DEFAULT_NAVBAR_ITEMS,
        hiddenPages
      ),
    [hiddenPages, navItems]
  );

  return (
    <nav className="z-[9999] flex w-full flex-col">
      <div className="hidden md:block">
        <NavbarDesktop
          isDark={isDark}
          navbarData={links}
          logoUrl={logoUrl}
          siteName={siteName}
          socials={socials}
        />
      </div>
      <NavbarMobile
        isDark={isDark}
        navbarData={links}
        logoUrl={logoUrl}
        siteName={siteName}
        socials={socials}
      />
    </nav>
  );
};

export default Navbar;
