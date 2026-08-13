"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { usePathname } from "next/navigation";
import useIsDarkNavbar from "./useNavbarTheme";
import { cn } from "@/lib/utils";

interface HoverableLinkProps {
  label: string;
  href: string;
}

const HoverableLink = ({ label, href }: HoverableLinkProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const isDark = useIsDarkNavbar();
  const pathname = usePathname();
  const active =
    href === "/"
      ? pathname === "/"
      : Boolean(
          pathname && (pathname === href || pathname.startsWith(`${href}/`))
        );

  return (
    <Link
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative block whitespace-nowrap rounded-lg px-2.5 py-2 text-[13px] font-medium tracking-tight transition duration-300",
        isDark
          ? active
            ? "text-white"
            : "text-white/85 hover:text-white"
          : active
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
      )}
    >
      <span className="relative z-10 inline-block">
        {label}
        <AnimatePresence>
          {(isHovered || active) && (
            <motion.span
              className={cn(
                "absolute right-0 -bottom-1 h-[2px] rounded-full",
                isDark ? "bg-[var(--home-gold,#D4B06A)]" : "bg-primary"
              )}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{ transformOrigin: "right", width: "100%" }}
            />
          )}
        </AnimatePresence>
      </span>
    </Link>
  );
};

export default HoverableLink;
