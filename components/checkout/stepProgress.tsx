"use client";

import { motion } from "framer-motion";
import { ShoppingCart, CreditCard, CheckCircle2 } from "lucide-react";

interface StepProgressProps {
  currentStep: "shoppingCart" | "pay" | "result";
}

const steps = [
  { id: "shoppingCart", label: "سبد خرید", icon: ShoppingCart },
  { id: "pay", label: "پرداخت", icon: CreditCard },
  { id: "result", label: "تکمیل خرید", icon: CheckCircle2 },
];

const StepProgress = ({ currentStep }: StepProgressProps) => {
  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className="w-full bg-white rounded-xl shadow-md p-6 mb-8">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-6 right-0 left-0 h-1 bg-gray-200 -z-10">
          <motion.div
            className="h-full bg-gradient-to-l from-myPrimary to-myGolden"
            initial={{ width: "0%" }}
            animate={{
              width: currentIndex === 0 ? "0%" : currentIndex === 1 ? "50%" : "100%",
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;

          return (
            <div
              key={step.id}
              className="flex flex-col items-center relative z-10"
            >
              {/* Step Circle */}
              <motion.div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-br from-myPrimary to-myGolden shadow-lg"
                    : isCompleted
                    ? "bg-gradient-to-br from-mySecondary to-myBlue"
                    : "bg-gray-200"
                }`}
                initial={{ scale: 0.8 }}
                animate={{ scale: isActive ? 1.1 : 1 }}
                transition={{ duration: 0.3 }}
              >
                <Icon
                  className={`w-6 h-6 ${
                    isActive || isCompleted ? "text-white" : "text-gray-400"
                  }`}
                />
              </motion.div>

              {/* Step Label */}
              <motion.p
                className={`text-sm font-medium transition-colors duration-300 ${
                  isActive
                    ? "text-myPrimary font-bold"
                    : isCompleted
                    ? "text-mySecondary"
                    : "text-gray-400"
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {step.label}
              </motion.p>

              {/* Active Step Number */}
              {isActive && (
                <motion.span
                  className="mt-1 text-xs text-myGolden font-bold"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  مرحله {index + 1}
                </motion.span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepProgress;
