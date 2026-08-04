"use client";

import { usePathname } from "next/navigation";
import { notFound } from "next/navigation";
import { isPathHidden } from "@/lib/site/hidable-pages";

type HiddenPageGuardProps = {
  hiddenPages: string[];
  children: React.ReactNode;
};

/**
 * Hides main public pages that admins marked as hidden (404 for visitors).
 */
export default function HiddenPageGuard({
  hiddenPages,
  children,
}: HiddenPageGuardProps) {
  const pathname = usePathname() || "/";

  // Skip profile / login / checkout flows — only main marketing pages are hidable.
  if (
    pathname.startsWith("/profile") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/admin")
  ) {
    return <>{children}</>;
  }

  if (isPathHidden(pathname, hiddenPages)) {
    notFound();
  }

  return <>{children}</>;
}
