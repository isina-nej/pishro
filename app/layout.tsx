import type { Metadata } from "next";

import "@/app/styles/fonts.css";
import "@/app/styles/globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

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
      <body className={`font-irsans antialiased rtl`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
