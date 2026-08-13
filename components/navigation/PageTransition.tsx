'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * انیمیشن ورود صفحه هنگام جابه‌جایی کلاینتی (via template.tsx).
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={
        reduceMotion
          ? { opacity: 0 }
          : { opacity: 0, y: 14, filter: 'blur(4px)' }
      }
      animate={
        reduceMotion
          ? { opacity: 1 }
          : { opacity: 1, y: 0, filter: 'blur(0px)' }
      }
      transition={{ duration: reduceMotion ? 0.15 : 0.34, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
