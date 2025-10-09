import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";

import "@/app/styles/globals.css";

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

// const iransansXV = localFont({
//   src: "../public/font/IRANSansXV.woff2",
//   weight: "400",
//   style: "normal",
//   variable: "--font-iransans-xv",
// });
// const irSansXRegular = localFont({
//   src: "../public/font/Woff2/IRSansXFaNum-Regular.woff2",
//   weight: "400",
//   style: "normal",
//   variable: "--font-irsansx-regular",
// });

// const irSansXMedium = localFont({
//   src: "../public/font/Woff2/IRSansXFaNum-Medium.woff2",
//   weight: "500",
//   style: "normal",
//   variable: "--font-irsansx-medium",
// });

// const irSansXBold = localFont({
//   src: "../public/font/Woff2/IRSansXFaNum-Bold.woff2",
//   weight: "700",
//   style: "normal",
//   variable: "--font-irsansx-bold",
// });

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
        className={`font-yekan ${charismaExtraBold.variable} ${charismaRegular.variable} ${montserrat.variable} rtl`}
      >
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
      </body>
    </html>
  );
}
