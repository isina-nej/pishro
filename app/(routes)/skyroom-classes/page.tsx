import { Metadata } from "next";
import { Suspense } from "react";
import SkyRoomPageContent from "@/components/skyroom/skyroomPageContent";
import { getAllSkyRoomClasses } from "@/lib/services/skyroom-service";

export const metadata: Metadata = {
  title: "کلاس‌های اسکای‌روم | پیشرو",
  description: "لیست کلاس‌های آنلاین اسکای‌روم پیشرو - ورود به عنوان مهمان",
};

export const revalidate = 3600;

export default async function SkyRoomClassesPage() {
  const classes = await getAllSkyRoomClasses();

  return (
    <main className="w-full min-h-screen">
      <Suspense
        fallback={
          <div className="h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-myPrimary" />
          </div>
        }
      >
        <SkyRoomPageContent classes={classes} />
      </Suspense>
    </main>
  );
}
