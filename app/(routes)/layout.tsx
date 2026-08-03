import type { Metadata } from "next";

import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";
import ChatWidget from "@/components/utils/ChatWidget";
import ScrollToTopButton from "@/components/utils/ScrollToTopButton";
import FloatingCartButton from "@/components/utils/FloatingCartButton";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "پیشرو",
  description: "پیشرو",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // بدون prop سشن: خود SessionProvider سشن را از /api/auth/session می‌گیرد.
    // با `session={null}` سشن کلاینت روی null قفل می‌شد و useSession() برای
    // کاربرِ وارد‌شده هم "unauthenticated" برمی‌گرداند. پاس‌دادن نتیجهٔ auth()
    // هم درست بود ولی این layout را dynamic می‌کرد و رندر ایستای صفحات عمومی
    // را از بین می‌برد.
    <SessionProvider>
      <Navbar />
      {children}
      <Footer />
      <ScrollToTopButton />
      <FloatingCartButton />
      <ChatWidget />
    </SessionProvider>
  );
}
