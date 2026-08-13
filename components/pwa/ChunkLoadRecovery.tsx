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

function shouldRecover(message: string, filename?: string) {
  const msg = message || '';
  const file = filename || '';
  if (file.includes('/_next/')) return true;
  return (
    msg.includes('Loading chunk') ||
    msg.includes('ChunkLoadError') ||
    msg.includes('Failed to fetch dynamically imported module') ||
    msg.includes('Importing a module script failed') ||
    msg.includes('error loading dynamically imported module') ||
    msg.includes('Unexpected token') ||
    msg.includes('Application error') ||
    // Next گاهی فقط "Uncaught" خالی می‌دهد
    msg.trim() === 'Uncaught' ||
    msg.trim() === 'Uncaught '
  );
}

/**
 * هر خطای کلاینت مرتبط با باندل Next → پاکسازی کش + hard reload.
 */
export default function ChunkLoadRecovery() {
  useEffect(() => {
    const reloadOnce = async () => {
      try {
        const last = Number(sessionStorage.getItem(RELOAD_KEY) || '0');
        // جلوگیری از لوپ؛ هر ۱۵ ثانیه حداکثر یک‌بار
        if (Date.now() - last < 15_000) return;
        sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
      } catch {
        // ignore
      }

      await clearClientCaches();
      const url = new URL(window.location.href);
      url.searchParams.set('_r', String(Date.now()));
      window.location.replace(url.toString());
    };

    const onError = (event: ErrorEvent) => {
      const target = event.target;
      if (target instanceof HTMLScriptElement && target.src.includes('/_next/')) {
        void reloadOnce();
        return;
      }
      if (shouldRecover(String(event.message || ''), event.filename || '')) {
        void reloadOnce();
      }
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const message =
        typeof reason === 'string'
          ? reason
          : String(reason?.message || reason?.name || reason || '');
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
