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
          className="fixed bottom-5 left-4 z-50 rounded-full bg-primary/80 text-primary-foreground p-3 shadow-lg shadow-primary/20 hover:bg-primary transition-colors sm:left-6"
        >
          <ArrowUp className="size-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTopButton;
