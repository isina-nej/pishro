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
  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Link
          href={item.link}
          className="hover:text-gray-200 relative flex items-center gap-1 py-2 px-4"
        >
          {item.label}
          <ChevronDown className="w-4 h-4" />
        </Link>
      </HoverCardTrigger>

      <HoverCardContent
        align="start"
        className={cn(
          "flex flex-col gap-3 bg-mySecondary/95 !backdrop-blur-md text-gray-100 border-none",
          "py-5 pr-3 pl-7 mt-4 min-w-[80px] w-fit -mr-0",
          "shadow-lg rounded-lg z-50"
        )}
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
