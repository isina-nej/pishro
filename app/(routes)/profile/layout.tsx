// app/profile/layout.tsx
import type { Metadata } from "next";
import { headers } from "next/headers";
import ProfileHeader from "@/components/profile/profileHeader";
import ProfileAside from "@/components/profile/profileAside";
import UserPanelThemeShell from "@/components/theme/UserPanelPaletteApplier";
import {
  getHiddenPages,
  getPublicUserPanelTheme,
} from "@/lib/services/settings-service";
import {
  firstVisibleProfilePath,
  isItemHidden,
  profilePathToVisibilityId,
} from "@/lib/site/hidable-pages";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "پیشرو",
  description: "پیشرو",
};

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const [panelTheme, hiddenPages] = await Promise.all([
    getPublicUserPanelTheme(),
    getHiddenPages(),
  ]);

  const headerStore = await headers();
  const pathname = headerStore.get("x-pathname") || "/profile/acc";
  const profileId = profilePathToVisibilityId(pathname);
  if (profileId && isItemHidden(profileId, hiddenPages)) {
    const fallback = firstVisibleProfilePath(hiddenPages);
    if (fallback && fallback !== pathname) {
      redirect(fallback);
    }
    notFound();
  }

  return (
    <UserPanelThemeShell
      paletteId={panelTheme.paletteId}
      light={panelTheme.light}
      dark={panelTheme.dark}
      className="min-h-screen w-full bg-background py-6 text-foreground md:py-8 mt-16 md:mt-20"
    >
      <ProfileHeader />
      <div className="container-xl w-full flex flex-col gap-5 px-4 md:flex-row md:px-0">
        <ProfileAside hiddenPages={hiddenPages} />
        <main className="w-full min-w-0">{children}</main>
      </div>
    </UserPanelThemeShell>
  );
}
