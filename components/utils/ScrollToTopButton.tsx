"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollStore } from "@/stores/scroll-store";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { setSnapEnabled } = useScrollStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    setSnapEnabled(false);

    window.scrollTo({ top: 0, behavior: "smooth" });

    setTimeout(() => setSnapEnabled(true), 1200);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          key="scroll-to-top"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 right-4 z-50 bg-[#173046] text-white rounded-full p-3 shadow-lg hover:bg-[#173046]/90 transition-colors"
        >
          <ArrowUp className="size-10" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTopButton;
