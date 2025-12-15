"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiChevronDown } from "react-icons/fi";
import clsx from "clsx";

interface SubMenuItem {
  label: string;
  link: string;
}

interface NavbarLinkItem {
  label: string;
  link: string;
  data?: SubMenuItem[];
}

interface NavbarLinksProps {
  navbarData: NavbarLinkItem[];
  onClick?: () => void;
  className?: string;
}

const NavbarLinks: React.FC<NavbarLinksProps> = ({
  navbarData,
  onClick,
  className,
}) => {
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);

  const toggleSubmenu = (idx: number) => {
    setOpenSubmenu(openSubmenu === idx ? null : idx);
  };

  return (
    <ul className={className || "flex items-center gap-3 sm:gap-5"}>
      {navbarData.map((item, idx) => (
        <li key={idx}>
          {item.data && item.data.length > 0 ? (
            <div>
              <button
                onClick={() => toggleSubmenu(idx)}
                className="flex items-center justify-between w-full py-2 px-2 rounded transition-colors"
              >
                <span>{item.label}</span>
                <FiChevronDown
                  className={clsx(
                    "transition-transform duration-200",
                    openSubmenu === idx && "rotate-180"
                  )}
                />
              </button>
              <ul
                className={clsx(
                  "overflow-hidden transition-all duration-200 pr-4",
                  openSubmenu === idx ? "max-h-96 mt-2" : "max-h-0"
                )}
              >
                {item.data.map((subItem, subIdx) => (
                  <li key={subIdx} className="py-1">
                    <Link
                      href={subItem.link}
                      className="block py-2 px-2 rounded transition-colors hover:bg-white/10"
                      onClick={onClick}
                    >
                      {subItem.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <Link
              href={item.link}
              className="block py-2 px-2 rounded transition-colors"
              onClick={onClick}
            >
              {item.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
};

export default NavbarLinks;
