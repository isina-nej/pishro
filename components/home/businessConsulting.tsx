"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { businessConsultingData } from "@/public/data";

const BusinessConsulting = () => {
  const buttonVariants = {
    idle: {
      scale: 1,
      boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
    },
    pulse: {
      scale: [1, 1.05, 1],
      boxShadow: [
        "0 0 0 rgba(0,0,0,0)",
        "0 0 12px rgba(255,255,255,0.4)",
        "0 0 0 rgba(0,0,0,0)",
      ],
      transition: {
        scale: {
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        },
        boxShadow: {
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        },
      },
    },
    hover: {
      scale: 1.1,
      backgroundColor: "#4a5669",
      boxShadow: "0 0 16px rgba(255,255,255,0.6)",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="container-md flex justify-between gap-20 my-20">
      <motion.div
        initial={{ x: "-100%", opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
        className="flex-1 flex flex-col justify-start items-center"
      >
        <h3 className="text-4xl leading-[3.5rem] font-extrabold mb-4">
          {businessConsultingData.title}
        </h3>
        <p className="text-xl leading-9 text-[#707177] text-center">
          {businessConsultingData.text}
        </p>

        {/* ✅ دکمه انیمیشنی اصلی */}
        <Link href="/business-consulting" className="mt-8">
          <motion.button
            variants={buttonVariants}
            initial="idle"
            animate="pulse"
            whileHover="hover"
            className="text-white text-xl px-12 py-4 rounded-full bg-[#344052] font-bold overflow-hidden"
          >
            شروع کنیم
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
};

export default BusinessConsulting;
