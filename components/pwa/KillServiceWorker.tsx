'use client';

import { useEffect } from 'react';

/**
 * Service Worker را برای همیشه خاموش و کش‌ها را پاک می‌کند.
 * دیگر چیزی ثبت نمی‌شود — فقط unregister.
 */
export default function KillServiceWorker() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const run = async () => {
      try {
        if ('serviceWorker' in navigator) {
          const regs = await navigator.serviceWorker.getRegistrations();
          await Promise.all(regs.map((r) => r.unregister()));
        }
        if ('caches' in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map((k) => caches.delete(k)));
        }
      } catch {
        // ignore
      }
    };

    void run();
  }, []);

  return null;
}
