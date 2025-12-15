"use client";

import React from "react";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import HoverableLink from "./HoverableLink";
import Link from "next/link";
import useIsDarkNavbar from "./useNavbarTheme";

interface NavbarPopoverProps {
  item: {
    label: string;
    link: string;
    data: {
      label: string;
      link: string;
    }[];
  };
}

const NavbarPopover = ({ item }: NavbarPopoverProps) => {
  const isDark = useIsDarkNavbar();
  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Link
          href={item.link}
          className="relative flex items-center gap-1 py-2 px-2"
        >
          {item.label}
          <ChevronDown className="w-4 h-4" />
        </Link>
      </HoverCardTrigger>

      <HoverCardContent
        align="start"
        style={
          {
            backdropFilter: "blur(10px) saturate(180%)",
            WebkitBackdropFilter: "blur(10px) saturate(180%)",
            backgroundColor: isDark
              ? "rgba(0, 0, 0, 0.4)"
              : "rgba(255, 255, 255, 0.4)",
          } as React.CSSProperties & {
            backdropFilter: string;
            WebkitBackdropFilter: string;
          }
        }
        className={cn(
          "flex flex-col gap-2 relative",
          "py-5 pr-3 pl-7 mt-4 min-w-[80px] w-fit -mr-0",
          "rounded-lg z-[200] border shadow-2xl",
          isDark
            ? "text-gray-100 border-white/15 shadow-black/20 ring-1 ring-white/10"
            : "text-gray-900 border-white/35 shadow-black/10 ring-1 ring-white/20",
          // Override zoom animations that break backdrop-filter - use opacity only
          "!transform-none data-[state=closed]:!zoom-out-95 data-[state=open]:!zoom-in-95"
        )}
        onAnimationStart={(e) => {
          // Ensure backdrop-filter works during animations
          if (e.currentTarget instanceof HTMLElement) {
            e.currentTarget.style.backdropFilter = "blur(10px) saturate(180%)";
            e.currentTarget.style.setProperty(
              "-webkit-backdrop-filter",
              "blur(10px) saturate(180%)"
            );
          }
        }}
      >
        {item.data.map((subItem, subIdx) => (
          <HoverableLink
            key={subIdx}
            label={subItem.label}
            href={subItem.link}
          />
        ))}
      </HoverCardContent>
    </HoverCard>
  );
};

export default NavbarPopover;
