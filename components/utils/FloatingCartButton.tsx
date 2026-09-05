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
          data-sound="cart"
          data-sound-role="cart"
          data-cursor="cart"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-[5.5rem] right-4 z-50 rounded-full bg-primary text-primary-foreground p-3 shadow-lg shadow-primary/25 hover:bg-primary/90 transition-colors sm:bottom-[6.5rem] sm:right-6"
          aria-label="رفتن به سبد خرید"
        >
          <div className="relative">
            <ShoppingCart className="size-6" />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-destructive text-primary-foreground text-xs font-bold rounded-full size-6 flex items-center justify-center">
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
