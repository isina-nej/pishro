"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface FloatingNotificationProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const FloatingNotification = ({
  message,
  isVisible,
  onClose,
}: FloatingNotificationProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -20, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -20, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 left-24 z-40 bg-white dark:bg-cardBg rounded-lg shadow-xl border border-gray-200 dark:border-borderColor p-4 max-w-xs"
        >
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="text-sm text-gray-800 dark:text-textPrimary leading-relaxed">{message}</p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 text-gray-400 dark:text-textSecondary hover:text-gray-600 dark:hover:text-textSecondary transition-colors"
              aria-label="بستن پیام"
            >
              <X className="size-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingNotification;
