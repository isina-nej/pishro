/**
 * Admin Panel Layout
 * Provides the layout wrapper for all admin pages
 * Handles navigation, header, and authentication state
 */

import type { ReactNode } from 'react';
import { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import ReactQueryProvider from '@/lib/providers/ReactQueryProvider';
import AdminShellGate from '@/components/admin/shell/AdminShellGate';

export const metadata: Metadata = {
  title: 'Pishro Sarmaye - Admin Panel',
  description: 'Admin panel for Pishro Sarmaye',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ReactQueryProvider>
        <div className="royal-theme min-h-screen bg-background text-foreground">
          <AdminShellGate>{children}</AdminShellGate>
          <Toaster position="top-center" toastOptions={{ duration: 3000, style: { direction: 'rtl' } }} />
        </div>
      </ReactQueryProvider>
    </>
  );
}
