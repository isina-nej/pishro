import type { ReactNode } from "react";
import type { Metadata } from "next";
import AdminShellGate from "@/components/admin/shell/AdminShellGate";

export const metadata: Metadata = {
  title: "Pishro Sarmaye - Admin Panel",
  description: "Admin panel for Pishro Sarmaye",
  robots: { index: false, follow: false },
};

/** Root layout already owns ReactQueryProvider and Toaster. Do not remount them here. */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="royal-theme min-h-screen bg-background text-foreground">
      <AdminShellGate>{children}</AdminShellGate>
    </div>
  );
}
