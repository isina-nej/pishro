'use client';

import Image from 'next/image';
import { Menu, Search } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';
import SoundMuteToggle from '@/components/sound/SoundMuteToggle';

interface AdminTopbarProps {
  onOpenMobileNav: () => void;
  onOpenCommandPalette: () => void;
}

export default function AdminTopbar({ onOpenMobileNav, onOpenCommandPalette }: AdminTopbarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 shadow-sm">
      <button
        onClick={onOpenMobileNav}
        className="rounded-lg p-2 hover:bg-accent md:hidden"
        aria-label="Open sidebar"
      >
        <Menu size={22} />
      </button>
      <div className="flex items-center gap-2 md:hidden">
        <h1 className="text-lg font-bold">پیشرو</h1>
        <Image
          src="/logo/logo-square.png"
          alt="پیشرو"
          width={28}
          height={28}
          className="shrink-0 rounded-md object-cover"
        />
      </div>

      <button
        onClick={onOpenCommandPalette}
        className="hidden items-center gap-2 rounded-lg border border-input bg-background px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-accent md:flex"
      >
        <Search className="h-4 w-4" />
        جستجو یا رفتن به بخش...
        <kbd className="mr-2 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px]">
          Ctrl+K
        </kbd>
      </button>

      <div className="flex items-center gap-2">
        <button
          onClick={onOpenCommandPalette}
          className="rounded-lg p-2 hover:bg-accent md:hidden"
          aria-label="جستجو"
        >
          <Search size={20} />
        </button>
        <SoundMuteToggle />
        <ThemeToggle />
      </div>
    </header>
  );
}
