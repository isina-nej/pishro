import type { Metadata } from "next";

import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";
import ChatWidget from "@/components/utils/ChatWidget";
import ScrollToTopButton from "@/components/utils/ScrollToTopButton";
import FloatingCartButton from "@/components/utils/FloatingCartButton";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "پیشرو",
  description: "پیشرو",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <Navbar />
      {children}
      <Footer />
      <ScrollToTopButton />
      <FloatingCartButton />
      <ChatWidget />
    </SessionProvider>
  );
}
