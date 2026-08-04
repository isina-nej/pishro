import type { Metadata } from "next";

import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";
import ChatWidget from "@/components/utils/ChatWidget";
import ScrollToTopButton from "@/components/utils/ScrollToTopButton";
import FloatingCartButton from "@/components/utils/FloatingCartButton";
import HiddenPageGuard from "@/components/site/HiddenPageGuard";
import { VisibilityProvider } from "@/components/site/VisibilityProvider";
import { SessionProvider } from "next-auth/react";
import { getPublicSiteChrome } from "@/lib/services/settings-service";
import { isItemHidden } from "@/lib/site/hidable-pages";

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
  const hidden = chrome.hiddenPages;
  const showNavbar = !isItemHidden("chrome:navbar", hidden);
  const showFooter = !isItemHidden("chrome:footer", hidden);
  const showChat = !isItemHidden("chrome:chat", hidden);
  const showCart = !isItemHidden("chrome:floating-cart", hidden);
  const showScrollTop = !isItemHidden("chrome:scroll-top", hidden);

  return (
    <SessionProvider>
      <VisibilityProvider hiddenPages={hidden}>
        {showNavbar && (
          <Navbar
            logoUrl={chrome.logoUrl}
            siteName={chrome.siteName}
            hiddenPages={hidden}
          />
        )}
        <HiddenPageGuard hiddenPages={hidden}>{children}</HiddenPageGuard>
        {showFooter && (
          <Footer
            logoUrl={chrome.logoUrl}
            siteName={chrome.siteName}
            hiddenPages={hidden}
          />
        )}
        {showScrollTop && <ScrollToTopButton />}
        {showCart && <FloatingCartButton />}
        {showChat && <ChatWidget />}
      </VisibilityProvider>
    </SessionProvider>
  );
}
