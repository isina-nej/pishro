import { Metadata } from "next";
import { Suspense } from "react";
import SkyRoomPageContent from "@/components/skyroom/skyroomPageContent";
import { getSkyRoomMeetingLink } from "@/lib/services/skyroom-service";

export const metadata: Metadata = {
  title: "همایش آنلاین | پیشرو",
  description: "ورود به همایش آنلاین پیشرو - ورود به عنوان مهمان",
};

export const revalidate = 3600;

export default async function SkyRoomClassesPage() {
  const meetingLink = await getSkyRoomMeetingLink();

  return (
    <main className="w-full h-screen">
      <Suspense
        fallback={
          <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
          </div>
        }
      >
        <SkyRoomPageContent meetingLink={meetingLink} />
      </Suspense>
    </main>
  );
}
