"use client";

import { motion, useAnimation, Variants } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface ScrollFadeWrapperProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  threshold?: number; // portion of element visible before trigger
  once?: boolean; // trigger only once or multiple times
  delay?: number;
  duration?: number;
  className?: string;
}

export default function ScrollFadeWrapper({
  children,
  direction = "up",
  threshold = 0.2,
  once = true,
  delay = 0,
  duration = 0.6,
  className = "",
}: ScrollFadeWrapperProps) {
  const controls = useAnimation();
  const { ref, inView } = useInView({ threshold, triggerOnce: once });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else if (!once) {
      controls.start("hidden");
    }
  }, [controls, inView, once]);

  // direction-based initial position
  const getOffset = () => {
    switch (direction) {
      case "up":
        return { y: 40, x: 0 };
      case "down":
        return { y: -40, x: 0 };
      case "left":
        return { x: 40, y: 0 };
      case "right":
        return { x: -40, y: 0 };
      default:
        return { y: 40, x: 0 };
    }
  };

  const variants: Variants = {
    hidden: { opacity: 0, ...getOffset() },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration, delay, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variants}
      initial="hidden"
      animate={controls}
    >
      {children}
    </motion.div>
  );
}
