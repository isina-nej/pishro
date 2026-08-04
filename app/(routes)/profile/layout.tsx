// app/profile/layout.tsx
import type { Metadata } from "next";
import ProfileHeader from "@/components/profile/profileHeader";
import ProfileAside from "@/components/profile/profileAside";
import UserPanelThemeShell from "@/components/theme/UserPanelPaletteApplier";
import { getPublicUserPanelTheme } from "@/lib/services/settings-service";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

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

  const panelTheme = await getPublicUserPanelTheme();

  return (
    <UserPanelThemeShell
      paletteId={panelTheme.paletteId}
      light={panelTheme.light}
      dark={panelTheme.dark}
      className="min-h-screen w-full bg-background py-6 text-foreground md:py-8 mt-16 md:mt-20"
    >
      <ProfileHeader />
      <div className="container-xl w-full flex flex-col gap-5 px-4 md:flex-row md:px-0">
        <ProfileAside />
        <main className="w-full min-w-0">{children}</main>
      </div>
    </UserPanelThemeShell>
  );
}
