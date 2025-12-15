"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import useIsDarkNavbar from "./useNavbarTheme";
import clsx from "clsx";

interface HoverableLinkProps {
  label: string;
  href: string;
}

const HoverableLink = ({ label, href }: HoverableLinkProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const isDark = useIsDarkNavbar();

  return (
    <Link
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={clsx(
        "relative px-2 py-1 text-sm transition duration-300",
        isDark ? " text-[#fff]" : " text-[#111]"
      )}
    >
      {/* Make the label span relative and inline-block */}
      <span className="relative inline-block z-10">
        {label}

        {/* AnimatePresence ensures exit animation works smoothly */}
        <AnimatePresence>
          {isHovered && (
            <motion.span
              className={clsx(
                "absolute right-0 -bottom-1 h-[2px]",
                isDark
                  ? "bg-[rgba(240,240,240,0.4)]"
                  : "bg-[rgba(30,30,30,0.4)]"
              )}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{
                transformOrigin: "right",
                width: "100%",
              }}
            />
          )}
        </AnimatePresence>
      </span>
    </Link>
  );
};

export default HoverableLink;
