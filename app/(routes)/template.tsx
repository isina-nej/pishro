'use client';

import { motion } from 'framer-motion';

/**
 * Enter animation for public route changes. No exit/wait mode — unfinished
 * fetches on the previous page must not block navigation.
 */
export default function RoutesTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
