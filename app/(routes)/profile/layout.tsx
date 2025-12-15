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
    <div className="w-full bg-[#F5F8FA] py-6 md:py-10 mt-16 md:mt-20">
      <ProfileHeader />
      <div className="container-xl w-full flex flex-col md:flex-row gap-4 md:gap-5 mt-4 px-4 md:px-0">
        <ProfileAside />
        <main className="w-full md:max-w-[990px]">{children}</main>
      </div>
    </div>
  );
}
