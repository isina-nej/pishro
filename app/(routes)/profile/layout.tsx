import type { Metadata } from "next";
import ProfileHeader from "@/components/profile/profileHeader";
import ProfileAside from "@/components/profile/profileAside";

export const metadata: Metadata = {
  title: "پیشرو",
  description: "پیشرو",
};

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="w-full bg-[#F5F8FA] py-10">
        <ProfileHeader />
        <div className="container-xl w-full flex gap-5 mt-4">
          <ProfileAside />
          <main className="w-full max-w-[990px]">{children}</main>
        </div>
      </div>
    </>
  );
}
