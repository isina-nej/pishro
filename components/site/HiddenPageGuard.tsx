import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isPathHidden } from "@/lib/site/hidable-pages";

type HiddenPageGuardProps = {
  hiddenPages: string[];
  children: React.ReactNode;
};

/**
 * Server-side gate for admin-hidden main pages (true 404, SEO-safe).
 */
export default async function HiddenPageGuard({
  hiddenPages,
  children,
}: HiddenPageGuardProps) {
  const headerStore = await headers();
  const pathname = headerStore.get("x-pathname") || "/";

  if (
    pathname.startsWith("/profile") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api")
  ) {
    return <>{children}</>;
  }

  if (isPathHidden(pathname, hiddenPages)) {
    notFound();
  }

  return <>{children}</>;
}
