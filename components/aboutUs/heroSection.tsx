"use client";

import { motion } from "framer-motion";
import { HiSparkles } from "react-icons/hi2";
import { LuTarget, LuAward, LuUsers } from "react-icons/lu";

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-br from-myPrimary via-mySecondary to-myPrimary overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container-md py-24 relative z-10">
        <div className="text-center text-white">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-8"
          >
            <HiSparkles className="text-yellow-300 text-xl" />
            <span className="text-sm font-medium">پیشرو در آموزش و سرمایه‌گذاری</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight px-4"
          >
            آکادمی مالی
            <br />
            <span className="text-yellow-300">پیشرو سرمایه</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-12 text-white/90 px-4"
          >
            با تجربه‌ای بیش از ۵ سال در زمینه آموزش و مشاوره بازارهای مالی،
            همراه شما در مسیر موفقیت و ثروت‌آفرینی هستیم
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto px-4"
          >
            {/* Stat 1 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-yellow-300/20 p-4 rounded-full group-hover:scale-110 transition-transform">
                  <LuUsers className="text-3xl md:text-4xl text-yellow-300" />
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-2">+۳۰۰۰</div>
              <div className="text-white/80 text-sm md:text-base">دانشجوی موفق</div>
            </div>

            {/* Stat 2 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-yellow-300/20 p-4 rounded-full group-hover:scale-110 transition-transform">
                  <LuAward className="text-3xl md:text-4xl text-yellow-300" />
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-2">+۱۰۰</div>
              <div className="text-white/80 text-sm md:text-base">دوره تخصصی</div>
            </div>

            {/* Stat 3 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group sm:col-span-2 md:col-span-1">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-yellow-300/20 p-4 rounded-full group-hover:scale-110 transition-transform">
                  <LuTarget className="text-3xl md:text-4xl text-yellow-300" />
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-2">%۹۵</div>
              <div className="text-white/80 text-sm md:text-base">رضایت کاربران</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="w-full"
        >
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,106.7C1248,96,1344,96,1392,96L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;
