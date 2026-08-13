'use client';

import { useEffect } from 'react';

const SPLASH_ID = 'site-boot-splash';

function dismissSplash() {
  const splash = document.getElementById(SPLASH_ID);
  if (!splash || splash.classList.contains('is-done')) return;
  splash.classList.add('is-done');
  window.setTimeout(() => {
    splash.remove();
  }, 320);
}

/**
 * اسپلش HTML اولیه را بلافاصله بعد از هیدراته حذف می‌کند.
 * تایم‌اوت کوتاه برای حالتی که هیدراته دیر شود.
 */
export default function BootSplashDismiss() {
  useEffect(() => {
    dismissSplash();

    // اگر هنوز مانده بود (مثلاً فریم بعدی)
    const raf = window.requestAnimationFrame(dismissSplash);
    const safety = window.setTimeout(dismissSplash, 1800);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(safety);
    };
  }, []);

  return null;
}
