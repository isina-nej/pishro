"use client";

import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/stores/cart-store";
import { useRouter } from "next/navigation";

const FloatingCartButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { items } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    router.push("/checkout");
  };

  // نمایش دکمه فقط زمانی که آیتم در سبد خرید وجود دارد
  const shouldShow = isVisible && items.length > 0;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.button
          onClick={handleClick}
          key="floating-cart"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-24 left-4 z-50 bg-[#173046] text-white rounded-full p-3 shadow-lg hover:bg-[#173046]/90 transition-colors"
          aria-label="رفتن به سبد خرید"
        >
          <div className="relative">
            <ShoppingCart className="size-10" />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full size-6 flex items-center justify-center">
                {items.length}
              </span>
            )}
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default FloatingCartButton;
