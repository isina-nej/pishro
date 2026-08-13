'use client';

import { Volume2, VolumeX } from 'lucide-react';
import { useSound } from '@/components/sound/SoundProvider';
import { cn } from '@/lib/utils';

type SoundMuteToggleProps = {
  className?: string;
};

export default function SoundMuteToggle({ className }: SoundMuteToggleProps) {
  const { muted, toggleMuted } = useSound();

  return (
    <button
      type="button"
      data-sound="toggle"
      onClick={toggleMuted}
      className={cn(
        'relative inline-flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300',
        'bg-gray-100 text-slate-700 hover:bg-gray-200',
        'dark:bg-cardBg dark:text-textSecondary dark:hover:bg-darkBgHidden',
        className
      )}
      aria-label={muted ? 'روشن کردن صدای رابط' : 'قطع صدای رابط'}
      title={muted ? 'روشن کردن صدا' : 'قطع صدا'}
      aria-pressed={!muted}
    >
      {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
    </button>
  );
}
