import type { Metadata } from "next";

import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";
import ChatWidget from "@/components/utils/ChatWidget";
import ScrollToTopButton from "@/components/utils/ScrollToTopButton";
import FloatingCartButton from "@/components/utils/FloatingCartButton";
import HiddenPageGuard from "@/components/site/HiddenPageGuard";
import { SessionProvider } from "next-auth/react";
import { getPublicSiteChrome } from "@/lib/services/settings-service";

export const metadata: Metadata = {
  title: "پیشرو",
  description: "پیشرو",
};

export default async function RoutesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const chrome = await getPublicSiteChrome();

  return (
    // بدون prop سشن: خود SessionProvider سشن را از /api/auth/session می‌گیرد.
    <SessionProvider>
      <Navbar
        logoUrl={chrome.logoUrl}
        siteName={chrome.siteName}
        hiddenPages={chrome.hiddenPages}
      />
      <HiddenPageGuard hiddenPages={chrome.hiddenPages}>
        {children}
      </HiddenPageGuard>
      <Footer
        logoUrl={chrome.logoUrl}
        siteName={chrome.siteName}
        hiddenPages={chrome.hiddenPages}
      />
      <ScrollToTopButton />
      <FloatingCartButton />
      <ChatWidget />
    </SessionProvider>
  );
}
