import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";

import "@/app/styles/globals.css";
import ReactQueryProvider from "@/lib/providers/ReactQueryProvider";

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

export const metadata: Metadata = {
  title: "52392950",
  description: "پیشرو",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa">
      <body
        className={`font-yekan ${charismaExtraBold.variable} ${charismaRegular.variable} ${montserrat.variable} rtl`}
      >
        <ReactQueryProvider>
          {children}
          <Toaster
            position="top-center" // می‌تونی تغییر بدی
            toastOptions={{
              duration: 3000,
              style: {
                fontSize: "14px",
                direction: "rtl",
              },
            }}
          />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
