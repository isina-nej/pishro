// app/profile/layout.tsx
import type { Metadata } from "next";
import ProfileHeader from "@/components/profile/profileHeader";
import ProfileAside from "@/components/profile/profileAside";
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
  // ✅ دریافت session با استفاده از تابع auth()
  const session = await auth();

  // ✅ اگر سشن وجود ندارد → ریدایرکت به لاگین
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 py-6 text-slate-900 dark:bg-bodyBg dark:text-textPrimary md:py-8 mt-16 md:mt-20">
      <ProfileHeader />
      <div className="container-xl w-full flex flex-col gap-5 px-4 md:flex-row md:px-0">
        <ProfileAside />
        <main className="w-full min-w-0">{children}</main>
      </div>
    </div>
  );
}
