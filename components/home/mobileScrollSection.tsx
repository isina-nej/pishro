"use client";

import { DesktopScroller } from "./mobile-scroll/DesktopScroller";
import { MobileSwiper } from "./mobile-scroll/MobileSwiper";

export default function MobileScrollSection() {
  return (
    <div id="mobile-scroll">
      <div className="hidden lg:block">
        <DesktopScroller />
      </div>
      <div className="lg:hidden">
        <MobileSwiper />
      </div>
    </div>
  );
}
