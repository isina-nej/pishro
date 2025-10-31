"use client";

import { navbarData } from "@/public/data";
import NavbarDesktop from "./NavbarDesktop";
import NavbarMobile from "./NavbarMobile";
import { useIsDarkNavbar } from "./useNavbarTheme";

const Navbar = () => {
  const isDark = useIsDarkNavbar();

  return (
    <nav className="w-full flex flex-col z-[100]">
      {/* دسکتاپ: NavbarDesktop نمایش فقط در سایز md به بالا */}
      <div className="hidden md:block">
        <NavbarDesktop isDark={isDark} navbarData={navbarData} />
      </div>
      <NavbarMobile isDark={isDark} navbarData={navbarData} />
    </nav>
  );
};

export default Navbar;
