import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";

import "@/app/styles/globals.css";
import ReactQueryProvider from "@/lib/providers/ReactQueryProvider";
import ThemeProvider from "@/lib/providers/ThemeProvider";

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
  weight: "100 900", // محدوده وزن فونت متغیر
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" suppressHydrationWarning>
      <body
        className={`font-yekan ${charismaExtraBold.variable} ${charismaRegular.variable} ${montserrat.variable} rtl bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
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
