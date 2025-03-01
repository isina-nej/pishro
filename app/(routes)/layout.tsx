import type { Metadata } from "next";

import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";
import ChatWidget from "@/components/utils/ChatWidget";

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
    <>
      <Navbar />
      {children}
      <Footer />
      <ChatWidget />
    </>
  );
}
