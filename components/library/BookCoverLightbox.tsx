"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";

interface BookCoverLightboxProps {
  src: string;
  alt: string;
  title?: string;
}

export const BookCoverLightbox = ({
  src,
  alt,
  title = "کاور کتاب",
}: BookCoverLightboxProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Thumbnail with Zoom Button */}
      <motion.div
        className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl group cursor-pointer"
        whileHover={{ scale: 0.98 }}
        onClick={() => setIsOpen(true)}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          priority
          quality={85}
        />

        {/* Overlay Zoom Button */}
        <motion.div
          className="absolute inset-0 bg-background/0 group-hover:bg-background/30 transition-colors duration-300 flex items-center justify-center"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          <motion.div
            className="bg-card dark:bg-cardBg rounded-full p-3 backdrop-blur-sm"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ZoomIn className="w-6 h-6 text-foreground" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-background/80 z-50 flex items-center justify-center backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="relative w-[90vw] h-[90vh] max-w-4xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Container */}
              <div className="relative w-full h-full bg-card dark:bg-cardBg rounded-2xl shadow-2xl overflow-hidden">
                <Image
                  src={src}
                  alt={alt}
                  fill
                  className="object-contain"
                  quality={95}
                  sizes="90vw"
                />
              </div>

              {/* Close Button */}
              <motion.button
                className="absolute -top-12 right-0 text-primary-foreground hover:bg-card dark:bg-cardBg rounded-full p-2 backdrop-blur-sm border border-border/20"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(false)}
              >
                <X className="w-6 h-6" />
              </motion.button>

              {/* Title */}
              {title && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/80 to-transparent p-6 text-primary-foreground"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <p className="text-lg font-semibold">{title}</p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
