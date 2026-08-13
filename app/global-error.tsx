'use client';

import { useEffect } from 'react';

/**
 * خطای ریشه — hard reload اجباری.
 */
export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    window.location.reload();
  }, [error]);

  return (
    <html lang="fa" dir="rtl">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          fontFamily: 'Tahoma, sans-serif',
          background: '#0b1220',
          color: '#f4f6f8',
        }}
      >
        <p>در حال بازیابی…</p>
      </body>
    </html>
  );
}
