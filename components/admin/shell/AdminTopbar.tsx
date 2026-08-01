'use client';

import { Menu } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';

interface AdminTopbarProps {
  onOpenMobileNav: () => void;
}

export default function AdminTopbar({ onOpenMobileNav }: AdminTopbarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 shadow-sm">
      <button
        onClick={onOpenMobileNav}
        className="rounded-lg p-2 hover:bg-accent md:hidden"
        aria-label="Open sidebar"
      >
        <Menu size={22} />
      </button>
      <h1 className="text-lg font-bold md:hidden">پیشرو</h1>
      <div className="hidden md:block" />

      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
