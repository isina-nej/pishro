import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";

import "@/app/styles/globals.css";
import ReactQueryProvider from "@/lib/providers/ReactQueryProvider";
import ThemeProvider from "@/lib/providers/ThemeProvider";
import SitePaletteApplier from "@/components/theme/SitePaletteApplier";
import {
  getPublicSiteChrome,
  getPublicSiteTheme,
} from "@/lib/services/settings-service";
import { getBaseUrl } from "@/lib/get-base-url";
import {
  DEFAULT_FAVICON_URL,
  DEFAULT_LOGO_URL,
  DEFAULT_OG_IMAGE_URL,
  DEFAULT_SITE_NAME,
  resolveAssetUrl,
  toAbsoluteAssetUrl,
} from "@/lib/site/branding";
import BootSplashDismiss from "@/components/loading/BootSplashDismiss";
import ServiceWorkerRegister from "@/components/pwa/ServiceWorkerRegister";
import { SoundProvider } from "@/components/sound/SoundProvider";
import GlobalUiEffects from "@/components/site/GlobalUiEffects";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const charismaExtraBold = localFont({
  src: "../public/font/CharismaTF-ExtraBold.woff2",
  weight: "800",
  style: "normal",
  variable: "--font-charisma-extra-bold",
});

const charismaRegular = localFont({
  src: "../public/font/CharismaTF-Regular.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-charisma-regular",
});

const montserrat = localFont({
  src: "../public/font/Montserrat-VariableFont.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-montserrat",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export async function generateMetadata(): Promise<Metadata> {
  const chrome = await getPublicSiteChrome();
  const base = getBaseUrl();
  const favicon = toAbsoluteAssetUrl(base, chrome.faviconUrl, DEFAULT_FAVICON_URL);
  const logo = toAbsoluteAssetUrl(base, chrome.logoUrl, DEFAULT_LOGO_URL);
  const og = toAbsoluteAssetUrl(base, chrome.ogImageUrl, DEFAULT_OG_IMAGE_URL);

  return {
    metadataBase: new URL(base),
    title: {
      default: chrome.siteName,
      template: `%s | ${chrome.siteName}`,
    },
    description: chrome.siteDescription,
    applicationName: chrome.siteName,
    icons: {
      icon: [
        { url: favicon },
        { url: logo, type: "image/png" },
      ],
      shortcut: favicon,
      apple: favicon,
    },
    openGraph: {
      type: "website",
      locale: "fa_IR",
      siteName: chrome.siteName,
      title: chrome.siteName,
      description: chrome.siteDescription,
      images: [{ url: og, alt: chrome.siteName }],
    },
    twitter: {
      card: "summary",
      title: chrome.siteName,
      description: chrome.siteDescription,
      images: [og],
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: chrome.siteName,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [siteTheme, chrome] = await Promise.all([
    getPublicSiteTheme(),
    getPublicSiteChrome(),
  ]);
  const splashLogo = resolveAssetUrl(chrome.logoUrl, DEFAULT_LOGO_URL);

  return (
    <html lang="fa" suppressHydrationWarning>
      <body
        className={`font-yekan ${charismaExtraBold.variable} ${charismaRegular.variable} ${montserrat.variable} rtl bg-background text-foreground transition-colors duration-300 ease-in-out`}
      >
        <div
          id="site-boot-splash"
          role="status"
          aria-live="polite"
          aria-busy="true"
          aria-label="بارگذاری"
          dangerouslySetInnerHTML={{
            __html: `
              <div class="boot-logo-wrap" aria-hidden="true">
                <span class="boot-ring"></span>
                <span class="boot-ring-slow"></span>
                <div class="boot-logo-box">
                  <img src="${escapeHtml(splashLogo)}" alt="" width="88" height="88" />
                </div>
              </div>
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){function d(){var s=document.getElementById('site-boot-splash');if(!s||s.classList.contains('is-done'))return;s.classList.add('is-done');setTimeout(function(){s.remove()},320)}if(document.readyState==='complete'){d()}else{window.addEventListener('load',d,{once:true})}setTimeout(d,2200)})();`,
          }}
        />
        <BootSplashDismiss />
        <ServiceWorkerRegister />
        <ThemeProvider
          attribute="class"
          defaultTheme={siteTheme.themeMode}
          enableSystem={siteTheme.themeMode === "system"}
          disableTransitionOnChange={false}
        >
          <SitePaletteApplier
            paletteId={siteTheme.paletteId}
            light={siteTheme.light}
            dark={siteTheme.dark}
          />
          <ReactQueryProvider>
            <SoundProvider>
              {children}
              <GlobalUiEffects />
              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 3000,
                  style: {
                    fontSize: "14px",
                    direction: "rtl",
                  },
                }}
              />
            </SoundProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
