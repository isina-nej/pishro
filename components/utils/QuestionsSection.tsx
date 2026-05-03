"use client";

import { useState } from "react";
import { FaChevronUp } from "react-icons/fa6";
import { motion } from "framer-motion";
import { faqData } from "@/public/data";

const QuestionsSection = () => {
  // Store the index of the currently opened question
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Toggle function for opening and closing answers
  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mt-16 mb-20 w-full px-4">
      {faqData.map((item, idx) => (
        <div
          key={idx}
          className="border border-[#ebebeb] rounded-sm px-6 py-4 mb-4 cursor-pointer border-r-4 border-r-red-500"
          onClick={() => toggleQuestion(idx)}
        >
          {/* Question Header */}
          <div className="flex justify-between items-center">
            <p className="font-semibold text-base text-[#131b22]">
              {item.question}
            </p>
            <div className="rounded-sm border border-[#131b22] size-6 flex justify-center items-center">
              <motion.div
                animate={{ rotate: openIndex === idx ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <FaChevronUp className="text-[#131b22] size-4" />
              </motion.div>
            </div>
          </div>

          {/* Animated Answer */}
          <motion.div
            initial={false}
            animate={{
              height: openIndex === idx ? "auto" : 0,
              opacity: openIndex === idx ? 1 : 0,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-[#131b22] w-full max-w-[880px] mt-2">
              {item.answer}
            </p>
          </motion.div>
        </div>
      ))}
    </div>
  );
};

export default QuestionsSection;
