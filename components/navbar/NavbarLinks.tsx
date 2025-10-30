import React from "react";
import Link from "next/link";

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
}) => (
  <ul className={className || "flex items-center gap-3 sm:gap-5"}>
    {navbarData.map((item, idx) => (
      <li key={idx}>
        <Link
          href={item.link}
          className="block py-2 px-4 rounded hover:bg-white/10 transition-colors"
          onClick={onClick}
        >
          {item.label}
        </Link>
      </li>
    ))}
  </ul>
);

export default NavbarLinks;
