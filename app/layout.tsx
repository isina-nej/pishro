import type { Metadata } from "next";
import localFont from "next/font/local";

import "@/app/styles/fonts.css";
import "@/app/styles/globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ChatWidget from "@/components/utils/ChatWidget";

const charismaExtraBold = localFont({
  src: "../public/font/CharismaTF-ExtraBold.woff2",
  weight: "800", // یا مقدار مناسب بر اساس فونت شما
  style: "normal",
  variable: "--font-charisma-extra-bold", // متغیر CSS اختیاری برای استفاده در Tailwind CSS یا استایل‌های سفارشی
});

const charismaRegular = localFont({
  src: "../public/font/CharismaTF-Regular.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-charisma-regular",
});

const iransansXV = localFont({
  src: "../public/font/IRANSansXV.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-iransans-xv",
});

const montserrat = localFont({
  src: "../public/font/Montserrat-VariableFont.woff2",
  weight: "100 900", // محدوده وزن فونت متغیر
  style: "normal",
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "پیشرو",
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
        className={`${iransansXV.variable} ${charismaExtraBold.variable} ${charismaRegular.variable} ${montserrat.variable} rtl`}
      >
        <Navbar />
        {children}
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
