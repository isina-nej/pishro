"use client";

import { motion } from "framer-motion";
import { ShoppingCart, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const EmptyCart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full min-h-[500px] flex items-center justify-center"
    >
      <div className="max-w-md mx-auto text-center space-y-8">
        {/* Animated Icon */}
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative mx-auto w-32 h-32"
        >
          {/* Gradient Background Circle */}
          <div className="absolute inset-0 bg-gradient-to-br from-myPrimary/20 to-myGolden/20 rounded-full blur-2xl" />

          {/* Main Icon Container */}
          <div className="relative w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
            <ShoppingCart className="w-16 h-16 text-gray-400" strokeWidth={1.5} />

            {/* Sparkle Decoration */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0.5,
              }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles className="w-6 h-6 text-myGolden" />
            </motion.div>
          </div>
        </motion.div>

        {/* Text Content */}
        <div className="space-y-3">
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-black text-gray-800"
          >
            سبد خرید شما خالی است
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 leading-relaxed"
          >
            هنوز دوره‌ای به سبد خرید خود اضافه نکرده‌اید.
            <br />
            دوره‌های متنوع ما را کشف کنید و یادگیری خود را آغاز کنید!
          </motion.p>
        </div>

        {/* Call to Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/courses" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-l from-myPrimary to-red-600 hover:from-red-600 hover:to-myPrimary shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <span className="font-bold">مشاهده دوره‌ها</span>
              <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>

          <Link href="/" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-2 hover:bg-gray-50"
            >
              <span className="font-bold">بازگشت به صفحه اصلی</span>
            </Button>
          </Link>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="pt-8 border-t border-gray-200"
        >
          <p className="text-sm text-gray-500">
            💡 نکته: با افزودن دوره‌ها به سبد خرید، می‌توانید همه را یکجا خریداری کنید
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EmptyCart;
