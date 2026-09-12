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
        'border border-border/70 bg-card/70 text-muted-foreground hover:border-primary/35 hover:text-foreground',
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
