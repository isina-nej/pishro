import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";

import "@/app/styles/globals.css";
import ReactQueryProvider from "@/lib/providers/ReactQueryProvider";
import ThemeProvider from "@/lib/providers/ThemeProvider";
import SitePaletteApplier from "@/components/theme/SitePaletteApplier";
import { getPublicSiteTheme } from "@/lib/services/settings-service";

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

export const metadata: Metadata = {
  title: "پیشرو سرمایه",
  description: "پیشرو - آموزش و سرمایه‌گذاری",
  icons: {
    icon: "/favicon.ico",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "پیشرو سرمایه",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteTheme = await getPublicSiteTheme();

  return (
    <html lang="fa" suppressHydrationWarning>
      <body
        className={`font-yekan ${charismaExtraBold.variable} ${charismaRegular.variable} ${montserrat.variable} rtl bg-background text-foreground transition-colors duration-300 ease-in-out`}
      >
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
            {children}
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
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
