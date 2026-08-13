'use client';

import { useEffect } from 'react';

const CLEANUP_KEY = 'pishro-sw-cleaned-v2';

/**
 * فقط یک‌بار SW قدیمی را unregister می‌کند.
 * دیگر در هر رفرش کل Cache Storage را خالی نمی‌کند تا عکس‌ها دوباره دانلود نشوند.
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    try {
      if (localStorage.getItem(CLEANUP_KEY) === '1') return;
    } catch {
      // ignore
    }

    const cleanup = async () => {
      try {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((reg) => reg.unregister()));
        if ('caches' in window) {
          const keys = await caches.keys();
          await Promise.all(
            keys
              .filter((key) => /workbox|next-pwa|pishro|sw/i.test(key))
              .map((key) => caches.delete(key))
          );
        }
        try {
          localStorage.setItem(CLEANUP_KEY, '1');
        } catch {
          // ignore
        }
      } catch {
        // ignore
      }
    };

    void cleanup();
  }, []);

  return null;
}
