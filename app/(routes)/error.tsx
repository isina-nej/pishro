'use client';

import { useEffect } from 'react';

/**
 * بازیابی خطای روت — hard reload تا Application error گیر نکند.
 */
export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    try {
      const key = 'pishro-error-reload';
      const last = Number(sessionStorage.getItem(key) || '0');
      if (Date.now() - last < 15_000) return;
      sessionStorage.setItem(key, String(Date.now()));
    } catch {
      // ignore
    }
    window.location.reload();
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-6 text-center">
      <p className="text-sm text-muted-foreground">در حال بازیابی صفحه…</p>
      <button
        type="button"
        className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
        onClick={() => window.location.reload()}
      >
        تلاش مجدد
      </button>
    </div>
  );
}
