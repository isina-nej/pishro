"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { curatedCollections } from "./data";
import { ArrowLeft } from "lucide-react";

export const CollectionsRow = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 15, delay: index * 0.1 },
    }),
  };

  return (
    <motion.div
      className="mt-12 grid gap-5 lg:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {curatedCollections.map((collection) => (
        <motion.div
          key={collection.id}
          variants={itemVariants}
          whileHover={{ y: -4 }}
          className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          {/* Animated Gradient Background */}
          <div
            className={cn(
              "absolute inset-0 opacity-60 blur-3xl transition-all duration-500 group-hover:opacity-80",
              `bg-gradient-to-br ${collection.accent}`
            )}
          />

          {/* Overlay Grid Pattern */}
          <div className="absolute inset-0 opacity-5 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.05)_25%,rgba(255,255,255,.05)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.05)_75%,rgba(255,255,255,.05))] bg-[size:20px_20px]" />

          {/* Content */}
          <div className="relative z-10 space-y-4 p-6 h-full flex flex-col">
            <motion.span
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white/90 border border-white/20 w-fit"
              whileHover={{ scale: 1.05 }}
            >
              <span className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
              مجموعه منتخب
            </motion.span>

            <div className="space-y-2 flex-grow">
              <h4 className="text-xl font-bold leading-7 text-white">
                {collection.title}
              </h4>
              <p className="text-sm text-slate-300/90 leading-relaxed">
                {collection.description}
              </p>
            </div>

            {/* Footer CTA */}
            <motion.div
              className="flex items-center gap-2 text-sm font-semibold text-white/80 group-hover:text-white transition-colors duration-300 pt-3 border-t border-white/10"
              whileHover={{ x: 4 }}
            >
              <span>مشاهده کتاب‌ها</span>
              <ArrowLeft className="h-4 w-4" />
            </motion.div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

