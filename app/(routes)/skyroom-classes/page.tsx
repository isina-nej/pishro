import { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import SkyRoomPageContent from "@/components/skyroom/skyroomPageContent";
import { getSkyRoomMeetingLink } from "@/lib/services/skyroom-service";

export const metadata: Metadata = {
  title: "همایش آنلاین | پیشرو",
  description: "ورود به همایش آنلاین پیشرو - عنوان مهمان",
};

export const revalidate = 3600;

export default async function SkyRoomClassesPage() {
  try {
    const meetingLink = await getSkyRoomMeetingLink();

    return (
      <main className="w-full h-screen">
        <Suspense
          fallback={
            <div className="h-screen flex items-center justify-center bg-gradient-to-br from-primary via-accent to-destructive">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-border" />
            </div>
          }
        >
          <SkyRoomPageContent meetingLink={meetingLink} />
        </Suspense>
      </main>
    );
  } catch (error) {
    console.error("Error loading skyroom page:", error);
    return (
      <main className="w-full h-screen">
        <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary via-accent to-destructive">
          <h1 className="text-3xl font-bold text-primary-foreground mb-4">خطا در بارگذاری صفحه</h1>
          <p className="text-primary-foreground/80 mb-6">متأسفانه مشکلی در بارگذاری همایش پیش آمد</p>
          <Link
            href="/"
            className="px-8 py-3 bg-card dark:bg-cardBg text-primary dark:text-textPrimary rounded-lg font-semibold hover:bg-muted dark:hover:bg-darkBgHidden transition inline-block"
          >
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </main>
    );
  }
}
