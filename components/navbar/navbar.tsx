"use client";

import { useMemo } from "react";
import { navbarData } from "@/public/data";
import NavbarDesktop from "./NavbarDesktop";
import NavbarMobile from "./NavbarMobile";
import { useIsDarkNavbar } from "./useNavbarTheme";
import { filterNavByHiddenPages } from "@/lib/site/hidable-pages";

type NavbarProps = {
  logoUrl?: string;
  siteName?: string;
  hiddenPages?: string[];
};

const Navbar = ({
  logoUrl,
  siteName,
  hiddenPages = [],
}: NavbarProps) => {
  const isDark = useIsDarkNavbar();
  const links = useMemo(
    () => filterNavByHiddenPages(navbarData, hiddenPages),
    [hiddenPages]
  );

  return (
    <nav className="w-full flex flex-col z-[9999]">
      <div className="hidden md:block">
        <NavbarDesktop
          isDark={isDark}
          navbarData={links}
          logoUrl={logoUrl}
          siteName={siteName}
        />
      </div>
      <NavbarMobile
        isDark={isDark}
        navbarData={links}
        logoUrl={logoUrl}
        siteName={siteName}
      />
    </nav>
  );
};

export default Navbar;
