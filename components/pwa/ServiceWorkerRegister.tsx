'use client';

import { useEffect } from 'react';

/**
 * Service Worker را برای همیشه خاموش می‌کند.
 * قبلاً کش چانک باعث Application error بعد از دیپلوی می‌شد.
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    const cleanup = async () => {
      try {
        // یک‌بار SW kill-switch را بگیر تا نسخه‌های قدیمی آپدیت شوند، بعد unregister
        const reg = await navigator.serviceWorker
          .register('/sw.js')
          .catch(() => null);

        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.unregister()));

        if (reg) {
          await reg.unregister().catch(() => null);
        }

        if ('caches' in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map((key) => caches.delete(key)));
        }
      } catch {
        // ignore
      }
    };

    if (document.readyState === 'complete') {
      void cleanup();
    } else {
      window.addEventListener('load', () => void cleanup(), { once: true });
    }
  }, []);

  return null;
}
