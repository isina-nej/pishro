'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * تنها نشانگر ناوبری کلاینتی: نوار نازک بالای صفحه.
 * لودینگ تمام‌صفحه جداگانه نداریم تا لایه‌ها روی هم ننشینند.
 */
export default function RouteProgressBar() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }

    setActive(true);
    const finish = window.setTimeout(() => setActive(false), 420);
    return () => window.clearTimeout(finish);
  }, [pathname]);

  if (!active) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[9999] h-[2px] overflow-hidden"
      aria-hidden
    >
      <div className="route-progress-bar h-full w-full origin-right bg-gradient-to-l from-primary via-[hsl(var(--premium))] to-primary" />
    </div>
  );
}
