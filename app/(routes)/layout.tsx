import type { Metadata } from "next";

import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";
import HiddenPageGuard from "@/components/site/HiddenPageGuard";
import PublicChromeExtras from "@/components/site/PublicChromeExtras";
import RouteProgressBar from "@/components/navigation/RouteProgressBar";
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
        <RouteProgressBar />
        {showNavbar && (
          <Navbar
            logoUrl={chrome.logoUrl}
            siteName={chrome.siteName}
            hiddenPages={hidden}
            navItems={chrome.navbarItems}
            socials={{
              instagram: chrome.footerContent.instagram,
              telegram: chrome.footerContent.telegram,
              twitter: chrome.footerContent.twitter,
            }}
          />
        )}
        <HiddenPageGuard hiddenPages={hidden}>{children}</HiddenPageGuard>
        {showFooter && (
          <Footer
            logoUrl={chrome.logoUrl}
            siteName={chrome.siteName}
            hiddenPages={hidden}
            content={chrome.footerContent}
          />
        )}
        <PublicChromeExtras
          showChat={showChat}
          showCart={showCart}
          showScrollTop={showScrollTop}
        />
      </VisibilityProvider>
    </SessionProvider>
  );
}
