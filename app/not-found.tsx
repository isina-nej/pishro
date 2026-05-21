"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-cardBg text-gray-800 dark:text-textPrimary">
      {/* Animated 404 Text */}
      <motion.h1
        className="text-7xl font-bold text-brand mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        404
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="text-lg text-gray-700 dark:text-textPrimary mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        صفحه‌ای که دنبالش هستید پیدا نشد!
      </motion.p>

      {/* Return Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <button
          className="px-6 py-3 text-white bg-brand hover:opacity-80 rounded-lg shadow-md transition-all dark:shadow-lg"
          onClick={() => router.back()}
        >
          بازگشت به صفحه قبل
        </button>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
