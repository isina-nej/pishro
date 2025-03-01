import React, { useState } from "react";
import Link from "next/link";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="hover:text-gray-200 relative flex items-center gap-1">
          {item.label}
          <ChevronDown className="w-4 h-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="bg-white text-gray-800 min-w-[80px] w-fit shadow-lg rounded-sm z-50 mt-2 p-3"
      >
        {item.data.map((subItem, subIdx: number) => (
          <Link
            key={subIdx}
            href={subItem.link}
            className={cn(
              "block p-1 hover:bg-gray-100 text-xs",
              subIdx !== item.data.length - 1 ? "border-b" : ""
            )}
            onClick={() => setIsOpen(false)}
          >
            {subItem.label}
          </Link>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export default NavbarPopover;
