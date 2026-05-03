"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

interface Step {
  id: number;
  title: string;
  description: string;
}

interface StepListTabletProps {
  steps: Step[];
  sectionTitle: string;
  sectionSubtitle: string;
}

const StepListTablet = ({
  steps,
  sectionTitle,
  sectionSubtitle,
}: StepListTabletProps) => {
  return (
    <section className="hidden md:flex lg:hidden flex-col items-center px-10 py-20 bg-white">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
        {sectionTitle}
      </h2>
      <p className="text-gray-600 text-center mb-12 max-w-xl leading-7">
        {sectionSubtitle}
      </p>

      <div className="flex flex-col gap-16 w-full max-w-4xl">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className={clsx(
              "relative bg-gray-50 rounded-2xl p-8 shadow-sm w-[80%] sm:w-[70%]",
              {
                "self-start": index === 0,
                "self-center": index === 1,
                "self-end": index === 2,
              }
            )}
          >
            {/* دایره و چراغ چشمک‌زن */}
            <div className="absolute -top-6 right-6 bg-gray-100 rounded-full size-14 flex items-center justify-center z-20">
              <div className="relative flex items-center justify-center">
                <div className="size-6 rounded-full bg-yellow-300 z-10" />
                <motion.div
                  className="absolute size-6 rounded-full bg-yellow-300"
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </div>

            {/* محتوا */}
            <div className="relative z-20 pt-6">
              {" "}
              {/* 👈 اینجا z-20 اضافه شد */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-7">{step.description}</p>
            </div>

            {/* عدد بزرگ در پس‌زمینه */}
            <p className="absolute text-[100px] font-black text-gray-200 left-2 -bottom-8 select-none z-10">
              {step.id}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default StepListTablet;
