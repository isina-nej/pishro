"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

import {
  getNavIcon,
  groupNavbarData,
  type NavLinkItem,
} from "./nav-config";

interface NavbarLinksProps {
  navbarData: NavLinkItem[];
  onClick?: () => void;
  className?: string;
  variant?: "desktop" | "mobile";
}

function isActivePath(pathname: string | null, link: string) {
  if (!pathname) return false;
  if (link === "/") return pathname === "/";
  return pathname === link || pathname.startsWith(`${link}/`);
}

const NavbarLinks = ({
  navbarData,
  onClick,
  className,
  variant = "desktop",
}: NavbarLinksProps) => {
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const groups = useMemo(() => groupNavbarData(navbarData), [navbarData]);

  if (variant === "mobile") {
    return (
      <nav className={clsx("w-full space-y-7", className)} aria-label="منوی اصلی">
        {groups.map((group, groupIndex) => (
          <section key={group.title} className="space-y-2.5">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * groupIndex, duration: 0.28 }}
              className="px-1 text-[11px] font-bold tracking-[0.16em] text-muted-foreground"
            >
              {group.title}
            </motion.p>
            <ul className="space-y-1.5">
              {group.items.map((item, itemIndex) => {
                const Icon = getNavIcon(item.link);
                const active = isActivePath(pathname, item.link);
                const hasSub = Boolean(item.data?.length);
                const open = openSubmenu === item.link;

                return (
                  <motion.li
                    key={item.link}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.05 * groupIndex + 0.03 * itemIndex,
                      duration: 0.28,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {hasSub ? (
                      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/40">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenSubmenu(open ? null : item.link)
                          }
                          className={clsx(
                            "flex w-full items-center gap-3 px-3.5 py-3 text-right transition-colors",
                            open ? "bg-primary/8 text-foreground" : "text-foreground"
                          )}
                          aria-expanded={open}
                        >
                          <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Icon className="size-[18px]" />
                          </span>
                          <span className="flex-1 text-sm font-semibold">{item.label}</span>
                          <ChevronDown
                            className={clsx(
                              "size-4 text-muted-foreground transition-transform duration-200",
                              open && "rotate-180"
                            )}
                          />
                        </button>
                        <AnimatePresence initial={false}>
                          {open && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.22 }}
                              className="space-y-1 overflow-hidden border-t border-border/60 px-2 pb-2 pt-1"
                            >
                              {item.data!.map((subItem) => (
                                <li key={subItem.link}>
                                  <Link
                                    href={subItem.link}
                                    onClick={onClick}
                                    className="block rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                                  >
                                    {subItem.label}
                                  </Link>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={item.link}
                        onClick={onClick}
                        className={clsx(
                          "group flex items-center gap-3 rounded-2xl border px-3.5 py-3 transition-all duration-200",
                          active
                            ? "border-primary/25 bg-primary/10 text-foreground shadow-sm shadow-primary/5"
                            : "border-transparent bg-card/35 text-foreground hover:border-border/80 hover:bg-card/70"
                        )}
                      >
                        <span
                          className={clsx(
                            "inline-flex size-10 items-center justify-center rounded-xl transition-colors",
                            active
                              ? "bg-primary text-primary-foreground"
                              : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                          )}
                        >
                          <Icon className="size-[18px]" />
                        </span>
                        <span className="flex-1 text-sm font-semibold tracking-tight">
                          {item.label}
                        </span>
                        {active && (
                          <span className="size-1.5 rounded-full bg-primary" />
                        )}
                      </Link>
                    )}
                  </motion.li>
                );
              })}
            </ul>
          </section>
        ))}
      </nav>
    );
  }

  return (
    <ul className={className || "flex items-center gap-1 sm:gap-2"}>
      {navbarData.map((item) => {
        const active = isActivePath(pathname, item.link);
        return (
          <li key={item.link}>
            <Link
              href={item.link}
              onClick={onClick}
              className={clsx(
                "relative block rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
              {active && (
                <span className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-primary/70" />
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavbarLinks;
