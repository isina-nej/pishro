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
          className={cn(
            "relative flex items-center gap-1 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors",
            isDark ? "text-white/95 hover:text-white" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {item.label}
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </Link>
      </HoverCardTrigger>

      <HoverCardContent
        align="start"
        style={
          {
            backdropFilter: "blur(10px) saturate(180%)",
            WebkitBackdropFilter: "blur(10px) saturate(180%)",
            backgroundColor: isDark
              ? "rgba(18, 26, 22, 0.92)"
              : "rgba(251, 249, 245, 0.94)",
          } as React.CSSProperties & {
            backdropFilter: string;
            WebkitBackdropFilter: string;
          }
        }
        className={cn(
          "relative z-[200] mt-4 flex w-fit min-w-[160px] -mr-0 flex-col gap-1",
          "rounded-2xl border border-border py-3 pr-2 pl-3 shadow-2xl shadow-black/10",
          "text-foreground",
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
