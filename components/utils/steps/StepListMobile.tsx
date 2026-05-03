"use client";

import { motion } from "framer-motion";

interface Step {
  id: number;
  title: string;
  description: string;
}

interface StepListMobileProps {
  steps: Step[];
  sectionTitle: string;
  sectionSubtitle: string;
}

const StepListMobile = ({
  steps,
  sectionTitle,
  sectionSubtitle,
}: StepListMobileProps) => {
  return (
    <section className="block md:hidden px-6 py-12 bg-white">
      <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-4">
        {sectionTitle}
      </h2>
      <p className="text-gray-600 text-center mb-10 leading-7">
        {sectionSubtitle}
      </p>

      <div className="flex flex-col gap-8">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-gray-50 rounded-xl p-6 shadow-sm relative"
          >
            <div className="absolute -top-5 left-5 bg-yellow-300 text-white font-bold rounded-full size-10 flex items-center justify-center text-lg shadow-md">
              {step.id}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {step.title}
            </h3>
            <p className="text-gray-600 leading-7">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default StepListMobile;
