"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { businessConsultingData } from "@/public/data";

const BusinessConsulting = () => {
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
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            whileHover={{ scale: 1.1 }}
            className="text-white text-xl px-12 py-4 rounded-full bg-[#344052] font-bold overflow-hidden shadow-lg hover:shadow-xl"
          >
            شروع کنیم
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
};

export default BusinessConsulting;
