'use client';

import { useEffect } from 'react';

/**
 * Service Worker قبلاً چانک‌های قدیمی را نگه می‌داشت و بعد از دیپلوی
 * خطای client-side (Application error) می‌داد.
 * این کامپوننت SW را خاموش و کش‌ها را پاک می‌کند.
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    const cleanup = async () => {
      try {
        // یک‌بار kill-switch را فعال کن تا SWهای قدیمی آپدیت شوند
        await navigator.serviceWorker.register('/sw.js').catch(() => null);

        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((reg) => reg.unregister()));

        if ('caches' in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map((key) => caches.delete(key)));
        }
      } catch {
        // پاکسازی نباید UI را بشکند
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
