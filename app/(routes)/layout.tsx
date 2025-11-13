import type { Metadata } from "next";

import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";
import ChatWidget from "@/components/utils/ChatWidget";
import ScrollToTopButton from "@/components/utils/ScrollToTopButton";
import FloatingCartButton from "@/components/utils/FloatingCartButton";
import { SessionProvider } from "next-auth/react";

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
    <SessionProvider>
      <Navbar />
      {children}
      <Footer />
      <ScrollToTopButton />
      <FloatingCartButton />
      <ChatWidget />
    </SessionProvider>
  );
}
