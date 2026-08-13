'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * نوار پیشرفت بالای صفحه هنگام جابه‌جایی کلاینتی —
 * تا کاربر حس هنگ/کرش نکند.
 */
export default function RouteProgressBar() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    setActive(true);
    setCycle((value) => value + 1);
    const finish = window.setTimeout(() => setActive(false), 520);
    return () => window.clearTimeout(finish);
  }, [pathname]);

  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          key={cycle}
          className="pointer-events-none fixed inset-x-0 top-0 z-[9999] h-[3px] origin-right overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          aria-hidden="true"
        >
          <motion.div
            className="h-full w-full bg-gradient-to-l from-primary via-[hsl(var(--premium))] to-primary shadow-[0_0_12px_hsl(var(--primary)/0.45)]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'right' }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
