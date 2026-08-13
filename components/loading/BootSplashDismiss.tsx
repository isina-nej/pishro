'use client';

import { useEffect } from 'react';

/**
 * پنهان‌کردن اسپلش HTML اولیه بعد از هیدراته‌شدن React.
 */
export default function BootSplashDismiss() {
  useEffect(() => {
    const splash = document.getElementById('site-boot-splash');
    if (!splash) return;

    splash.classList.add('is-done');
    const removeTimer = window.setTimeout(() => {
      splash.remove();
    }, 480);

    return () => window.clearTimeout(removeTimer);
  }, []);

  return null;
}
