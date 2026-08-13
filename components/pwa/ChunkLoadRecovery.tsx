'use client';

import { useEffect } from 'react';

const RELOAD_KEY = 'pishro-chunk-reload';

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

function isChunkFailure(message: string) {
  return (
    message.includes('Loading chunk') ||
    message.includes('ChunkLoadError') ||
    message.includes('Failed to fetch dynamically imported module') ||
    message.includes('Importing a module script failed') ||
    message.includes('error loading dynamically imported module')
  );
}

/**
 * بعد از دیپلوی، اگر چانک قدیمی از کش لود شود Next خطای client می‌دهد.
 * کش/SW را پاک و یک‌بار رفرش اجباری می‌کند.
 */
export default function ChunkLoadRecovery() {
  useEffect(() => {
    const reloadOnce = async () => {
      try {
        if (sessionStorage.getItem(RELOAD_KEY) === '1') return;
        sessionStorage.setItem(RELOAD_KEY, '1');
      } catch {
        // sessionStorage ممکن است در حالت private محدود باشد
      }

      await clearClientCaches();
      const url = new URL(window.location.href);
      url.searchParams.set('_r', String(Date.now()));
      window.location.replace(url.toString());
    };

    const onError = (event: ErrorEvent) => {
      const message = String(event.message || '');
      if (isChunkFailure(message)) {
        void reloadOnce();
      }
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const message =
        typeof reason === 'string'
          ? reason
          : String(reason?.message || reason?.name || '');
      if (isChunkFailure(message)) {
        void reloadOnce();
      }
    };

    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);

  return null;
}
