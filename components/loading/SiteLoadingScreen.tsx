'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { DEFAULT_LOGO_URL, DEFAULT_SITE_NAME } from '@/lib/site/branding';

type SiteLoadingScreenProps = {
  /** متن زیرین لوگو */
  label?: string;
  /** اگر true باشد تمام‌صفحه و fixed می‌شود (اسپلش/لودینگ روت) */
  fullscreen?: boolean;
  className?: string;
  logoUrl?: string;
  siteName?: string;
};

/**
 * لودینگ برنددار پیشرو — برای loading.tsx و حالت‌های انتظار.
 */
export default function SiteLoadingScreen({
  label = 'در حال آماده‌سازی…',
  fullscreen = false,
  className,
  logoUrl = DEFAULT_LOGO_URL,
  siteName = DEFAULT_SITE_NAME,
}: SiteLoadingScreenProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        'site-loading-screen flex flex-col items-center justify-center gap-6 px-6',
        fullscreen
          ? 'fixed inset-0 z-[10000] bg-background'
          : 'min-h-[70vh] w-full py-20',
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -right-24 -top-24 size-72 rounded-full bg-primary/15 blur-3xl site-loading-blob" />
        <div className="absolute -bottom-28 -left-20 size-80 rounded-full bg-[hsl(var(--premium)/0.12)] blur-3xl site-loading-blob-delayed" />
      </div>

      <div className="relative">
        <span
          className="absolute -inset-4 rounded-full border border-primary/25 site-loading-ring"
          aria-hidden
        />
        <span
          className="absolute -inset-8 rounded-full border border-primary/10 site-loading-ring-slow"
          aria-hidden
        />
        <div className="relative flex size-20 items-center justify-center overflow-hidden rounded-3xl border border-border/60 bg-card/90 shadow-2xl shadow-primary/15 backdrop-blur-xl sm:size-24">
          <Image
            src={logoUrl}
            alt={siteName}
            width={88}
            height={88}
            priority
            className="h-12 w-auto object-contain sm:h-14"
            unoptimized={logoUrl.startsWith('/api/') || logoUrl.startsWith('http')}
          />
        </div>
      </div>

      <div className="relative z-10 text-center">
        <p className="text-lg font-black tracking-tight text-foreground sm:text-xl">
          {siteName}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">{label}</p>
      </div>

      <div
        className="relative z-10 h-1 w-40 overflow-hidden rounded-full bg-muted sm:w-52"
        aria-hidden
      >
        <span className="site-loading-bar absolute inset-y-0 start-0 w-1/2 rounded-full bg-gradient-to-l from-primary via-[hsl(var(--premium))] to-primary" />
      </div>
    </div>
  );
}
