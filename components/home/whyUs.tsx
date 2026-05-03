"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { whyUsData } from "@/public/data";

const textVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 0 },
};

const animationVariants = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 0 },
};

const WhyUs = () => {
  const [index, setIndex] = useState(0);

  return (
    <div className="my-48 container-xl">
      <h2 className="text-4xl text-center">چرا پیشرو</h2>

      {/* لیست لیبل‌ها */}
      <div className="my-16 flex gap-28 justify-center text-xl text-[#717a86]">
        {whyUsData.map((item, idx) => (
          <h4
            key={idx}
            className={cn(
              "cursor-pointer relative pb-6 font-iransans font-bold",
              idx === index ? "text-[#172b3d]" : ""
            )}
            onClick={() => setIndex(idx)}
          >
            {item.label}
            {idx === index && (
              <motion.div
                layoutId="underline"
                className="absolute -bottom-1 left-0 right-0 h-1 bg-red-500 rounded"
              />
            )}
          </h4>
        ))}
      </div>

      {/* متن و انیمیشن در کنار هم */}
      <div className="flex flex-col md:flex-row items-center gap-16 justify-between">
        {/* متن */}
        <div className="max-w-[730px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              variants={textVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <h4 className="text-4xl leading-[56px] font-bold font-iransans text-[#172b3d] mb-4">
                {whyUsData[index].title}
              </h4>
              <p className="text-xl text-[#707177] leading-9 whitespace-pre-line text-justify">
                {whyUsData[index].text}
              </p>
              <button className="rounded-full text-[#344052] hover:text-white hover:bg-[#344052] transition-all duration-300 font-bold px-4 py-2.5 border-2 border-[#344052] flex items-center justify-center w-fit mt-4">
                <Link
                  href={whyUsData[index].btnHref}
                  className="flex items-center gap-2"
                >
                  {whyUsData[index].btnLabel}
                </Link>
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
        {/* انیمیشن */}
        <div className="size-[400px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              className="absolute inset-0"
              variants={animationVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <Image
                fill
                className="object-cover"
                src={whyUsData[index].imagePath}
                alt="img"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default WhyUs;
