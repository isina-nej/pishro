'use client';

import { useEffect } from 'react';

/**
 * ثبت Service Worker برای کش دارایی‌های استاتیک و بارگذاری سریع‌تر.
 * فقط در production تا کشِ توسعه مزاحم نباشد.
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (!('serviceWorker' in navigator)) return;

    const register = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // نادیده — عدم پشتیبانی/خطای شبکه نباید UI را بشکند
      });
    };

    if (document.readyState === 'complete') {
      register();
    } else {
      window.addEventListener('load', register, { once: true });
    }
  }, []);

  return null;
}
