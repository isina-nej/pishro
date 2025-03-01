"use client";

import React, { useState } from "react";
import { navbarData } from "@/public/data";
import NavbarTop from "./navbarTop";
import NavbarItems from "./navbarItems";

const Navbar = () => {
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  return (
    <nav className="h-[115px] w-full flex flex-col z-30">
      {/* بخش بالایی */}
      <NavbarTop />

      {/* بخش آیتم‌های منو */}
      <NavbarItems
        navbarData={navbarData}
        indicatorStyle={indicatorStyle}
        setIndicatorStyle={setIndicatorStyle}
      />
    </nav>
  );
};

export default Navbar;
