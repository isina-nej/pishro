'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Lightweight top progress cue on client navigations. Intentionally does not
 * wait for data fetches — leaving a page mid-load must stay instant.
 */
export default function RouteProgressBar() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    setActive(true);
    setCycle((value) => value + 1);
    const finish = window.setTimeout(() => setActive(false), 420);
    return () => window.clearTimeout(finish);
  }, [pathname]);

  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          key={cycle}
          className="pointer-events-none fixed inset-x-0 top-0 z-[9999] h-[3px] origin-right bg-gradient-to-l from-primary via-accent to-primary"
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
        />
      ) : null}
    </AnimatePresence>
  );
}
