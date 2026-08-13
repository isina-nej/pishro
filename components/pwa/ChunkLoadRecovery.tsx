'use client';

import { useEffect } from 'react';

const RELOAD_KEY = 'pishro-nav-reload-at';

async function clearClientCaches() {
  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((reg) => reg.unregister()));
    }
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
    }
  } catch {
    // ignore
  }
}

function shouldRecover(message: string) {
  const msg = message || '';
  return (
    msg.includes('Loading chunk') ||
    msg.includes('ChunkLoadError') ||
    msg.includes('Failed to fetch dynamically imported module') ||
    msg.includes('Importing a module script failed') ||
    msg.includes('error loading dynamically imported module')
  );
}

/**
 * فقط خطای لود چانک بعد از دیپلوی → hard reload.
 * خطای معمولی رندر را به full reload تبدیل نمی‌کند.
 */
export default function ChunkLoadRecovery() {
  useEffect(() => {
    const reloadOnce = async () => {
      try {
        const last = Number(sessionStorage.getItem(RELOAD_KEY) || '0');
        if (Date.now() - last < 15_000) return;
        sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
      } catch {
        // ignore
      }

      await clearClientCaches();
      window.location.reload();
    };

    const onError = (event: ErrorEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLScriptElement &&
        typeof target.src === 'string' &&
        target.src.includes('/_next/static/')
      ) {
        void reloadOnce();
        return;
      }
      if (shouldRecover(String(event.message || ''))) {
        void reloadOnce();
      }
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const message =
        typeof reason === 'string'
          ? reason
          : String(reason?.message || reason?.name || '');
      if (shouldRecover(message)) {
        void reloadOnce();
      }
    };

    window.addEventListener('error', onError, true);
    window.addEventListener('unhandledrejection', onRejection);
    return () => {
      window.removeEventListener('error', onError, true);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);

  return null;
}
