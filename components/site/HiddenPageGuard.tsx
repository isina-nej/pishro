import { headers } from "next/headers";
import { notFound } from "next/navigation";
import {
  isPathHidden,
  isItemHidden,
  profilePathToVisibilityId,
} from "@/lib/site/hidable-pages";

type HiddenPageGuardProps = {
  hiddenPages: string[];
  children: React.ReactNode;
};

/**
 * Server-side gate for admin-hidden pages and profile menu items.
 */
export default async function HiddenPageGuard({
  hiddenPages,
  children,
}: HiddenPageGuardProps) {
  const headerStore = await headers();
  const pathname = headerStore.get("x-pathname") || "/";

  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api")
  ) {
    return <>{children}</>;
  }

  // Profile routes: hide individual menu destinations
  if (pathname.startsWith("/profile")) {
    const profileId = profilePathToVisibilityId(pathname);
    if (profileId && isItemHidden(profileId, hiddenPages)) {
      notFound();
    }
    return <>{children}</>;
  }

  // Checkout can be fully disabled
  if (pathname.startsWith("/checkout") && isPathHidden("/checkout", hiddenPages)) {
    notFound();
  }

  if (isPathHidden(pathname, hiddenPages)) {
    notFound();
  }

  return <>{children}</>;
}
