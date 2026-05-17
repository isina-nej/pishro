/**
 * Admin Panel Layout
 * Provides the layout wrapper for all admin pages
 * Handles navigation, header, and authentication state
 */

import type { ReactNode } from 'react';
import { Metadata } from 'next';

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
    <html lang="fa" dir="rtl">
      <body className="bg-gray-50 dark:bg-gray-900">
        {children}
      </body>
    </html>
  );
}
