// app/profile/layout.tsx
import type { Metadata } from "next";
import ProfileHeader from "@/components/profile/profileHeader";
import ProfileAside from "@/components/profile/profileAside";
import { auth } from "@/auth"; // ✅ از فایل خودت که NextAuth رو ساخته‌ای
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
    <div className="w-full bg-[#F5F8FA] py-10 mt-20">
      <ProfileHeader />
      <div className="container-xl w-full flex gap-5 mt-4">
        <ProfileAside />
        <main className="w-full max-w-[990px]">{children}</main>
      </div>
    </div>
  );
}
