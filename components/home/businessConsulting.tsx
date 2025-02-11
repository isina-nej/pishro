"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { businessConsultingData } from "@/public/data";

const BusinessConsulting = () => {
  return (
    <div className="container flex justify-between gap-20 my-20">
      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }} // این باعث می‌شود انیمیشن فقط یک بار اجرا شود
        className="w-full max-w-[530px] min-h-[330px] relative flex-1"
      >
        <Image
          src={"/images/home/consulting.svg"}
          alt="consulting"
          fill
          className="object-contain"
        />
      </motion.div>
      <motion.div
        initial={{ x: "-100%", opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
        className="flex-1"
      >
        <h3 className="text-4xl leading-[3.5rem] font-extrabold mb-4">
          {businessConsultingData.title}
        </h3>
        <p className="text-xl leading-9 text-[#707177]">
          {businessConsultingData.text}
        </p>
        <Link
          className="mt-8 font-bold text-white text-lg w-max bg-[#344052] rounded-full py-3 px-4 block"
          href={"/business-consulting"}
        >
          شروع کنیم
        </Link>
      </motion.div>
    </div>
  );
};

export default BusinessConsulting;
