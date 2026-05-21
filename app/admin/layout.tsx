/**
 * Admin Panel Layout
 * Provides the layout wrapper for all admin pages
 * Handles navigation, header, and authentication state
 */

import type { ReactNode } from 'react';
import { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import ReactQueryProvider from '@/lib/providers/ReactQueryProvider';

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
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
          {children}
          <Toaster position="top-center" toastOptions={{ duration: 3000, style: { direction: 'rtl' } }} />
        </div>
      </ReactQueryProvider>
    </>
  );
}
