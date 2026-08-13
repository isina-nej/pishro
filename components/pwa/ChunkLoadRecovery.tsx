'use client';

import { useEffect } from 'react';

/**
 * بعد از دیپلوی، اگر چانک قدیمی از کش لود شود Next خطای client می‌دهد.
 * یک‌بار رفرش اجباری مشکل را برطرف می‌کند.
 */
export default function ChunkLoadRecovery() {
  useEffect(() => {
    const reloadOnce = () => {
      try {
        const key = 'pishro-chunk-reload';
        if (sessionStorage.getItem(key) === '1') return;
        sessionStorage.setItem(key, '1');
        window.location.reload();
      } catch {
        window.location.reload();
      }
    };

    const onError = (event: ErrorEvent) => {
      const message = String(event.message || '');
      if (
        message.includes('Loading chunk') ||
        message.includes('ChunkLoadError') ||
        message.includes('Failed to fetch dynamically imported module')
      ) {
        reloadOnce();
      }
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const message =
        typeof reason === 'string'
          ? reason
          : String(reason?.message || reason?.name || '');
      if (
        message.includes('Loading chunk') ||
        message.includes('ChunkLoadError') ||
        message.includes('Failed to fetch dynamically imported module')
      ) {
        reloadOnce();
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
