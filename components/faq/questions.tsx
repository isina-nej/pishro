"use client";

import { useState } from "react";
import { FaChevronUp } from "react-icons/fa6";
import { motion } from "framer-motion";

export type FaqItem = {
  id?: string;
  question: string;
  answer: string;
};

interface QuestionsProps {
  items: FaqItem[];
}

const Questions = ({ items }: QuestionsProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!items.length) {
    return (
      <div className="mt-16 mb-20 container-md text-center text-muted-foreground">
        هنوز سوال متداولی ثبت نشده است.
      </div>
    );
  }

  return (
    <div className="mt-16 mb-20 container-md">
      {items.map((item, idx) => (
        <div
          key={item.id || idx}
          className="border border-[#ebebeb] rounded-sm p-6 mb-4 cursor-pointer"
          onClick={() => toggleQuestion(idx)}
        >
          <div className="flex justify-between items-center gap-4">
            <h3 className="font-semibold text-base text-[#131b22] text-right flex-1">
              {item.question}
            </h3>
            <div className="rounded-sm border border-[#131b22] size-6 flex justify-center items-center shrink-0">
              <motion.div
                animate={{ rotate: openIndex === idx ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                {/* Closed: points down; open: points up */}
                <FaChevronUp className="text-[#131b22] size-4" />
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={false}
            animate={{
              height: openIndex === idx ? "auto" : 0,
              opacity: openIndex === idx ? 1 : 0,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-[#131b22] w-full max-w-[880px] mt-2 text-right">
              {item.answer}
            </p>
          </motion.div>
        </div>
      ))}
    </div>
  );
};

export default Questions;
