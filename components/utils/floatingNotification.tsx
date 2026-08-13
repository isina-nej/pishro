"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";

interface FloatingNotificationProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

/**
 * حباب راهنما کنار دکمهٔ چت زنده (راست فیزیکی صفحه).
 */
const FloatingNotification = ({
  message,
  isVisible,
  onClose,
}: FloatingNotificationProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.94 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          className="fixed bottom-[5.75rem] right-4 z-[55] w-[min(calc(100vw-5.5rem),18.5rem)] sm:bottom-[7.25rem] sm:right-6"
          role="status"
          aria-live="polite"
        >
          <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/95 p-3.5 shadow-2xl shadow-primary/15 backdrop-blur-2xl dark:border-white/10 dark:bg-[#121A16]/95">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(var(--home-glow-rgb,42,138,92),0.16),transparent_55%)]"
            />

            <div className="relative flex items-start gap-3">
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <MessageCircle className="size-4" strokeWidth={2} />
              </span>

              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-[11px] font-semibold text-primary">پشتیبانی پیشرو</p>
                <p className="mt-1 text-sm leading-relaxed text-foreground">
                  {message}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="بستن پیام"
              >
                <X className="size-3.5" />
              </button>
            </div>
          </div>

          {/* دم حباب به‌سمت دکمهٔ چت */}
          <div
            aria-hidden
            className="absolute -bottom-1.5 right-6 size-3 rotate-45 border-b border-e border-border/60 bg-card/95 dark:border-white/10 dark:bg-[#121A16]/95 sm:right-7"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingNotification;
