"use client";

import { motion } from "framer-motion";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import {
  Wallet,
  TrendingUp,
  Shield,
  BarChart3,
  ArrowDown,
  Sparkles,
} from "lucide-react";
import { InvestmentPlans, InvestmentPlan, InvestmentTag } from "@prisma/client";
import { Button } from "@/components/ui/button";

interface InvestmentPlansHeroProps {
  investmentPlansData: InvestmentPlans & {
    plans: InvestmentPlan[];
    tags: InvestmentTag[];
  };
}

export const InvestmentPlansHero = ({
  investmentPlansData,
}: InvestmentPlansHeroProps) => {
  // Detect mobile for performance optimization
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Calculate stats from data
  const stats = {
    totalPlans: investmentPlansData.plans.length || 3,
    totalTags: investmentPlansData.tags.length || 8,
    minInvestment: investmentPlansData.minAmount || 10,
    maxReturn: 11, // درصد بازدهی حداکثر
  };

  const scrollToModels = () => {
    const element = document.getElementById("investment-models");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToPlans = () => {
    const element = document.getElementById("plans-section");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const floatAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <section className="relative overflow-hidden pb-20 pt-28 text-white min-h-[90vh] flex items-center">
      {/* Background Video with Parallax Effect */}
      <div className="absolute inset-0">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full w-full"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          >
            <source src="/videos/investment-plans/landing.mp4" type="video/mp4" />
          </video>
        </motion.div>
        {/* Enhanced Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/85 to-slate-950/95" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
      </div>

      {/* Animated Floating Elements - Disabled on mobile for performance */}
      {!isMobile && (
        <>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-gradient-to-br from-emerald-500/30 to-teal-500/30 blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-blue-500/25 to-cyan-500/25 blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.15, 0.3, 0.15],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-r from-violet-500/20 to-purple-500/20 blur-3xl"
          />
        </>
      )}

      {/* Static background for mobile */}
      {isMobile && (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10" />
      )}

      <div className="container-xl relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-12"
        >
          {/* Header Section */}
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div variants={itemVariants} className="flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-6 py-2.5 text-sm font-medium text-emerald-300 shadow-lg shadow-emerald-500/10 backdrop-blur-sm">
                <Sparkles className="h-4 w-4" />
                سبدهای سرمایه‌ گذاری پیشرو
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl font-black !leading-tight md:text-7xl bg-gradient-to-b from-white via-white to-white/70 bg-clip-text text-transparent"
            >
              {investmentPlansData.title}
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg text-slate-300 md:text-xl max-w-2xl mx-auto leading-relaxed"
            >
              {investmentPlansData.description}
            </motion.p>

            <motion.div variants={itemVariants}>
              <Button
                onClick={scrollToModels}
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-xl shadow-emerald-500/25 hover:shadow-2xl hover:shadow-emerald-500/40 transition-all duration-300 px-8 py-6 text-lg font-semibold rounded-2xl group"
              >
                شروع سرمایه‌ گذاری
                <ArrowDown className="mr-2 h-5 w-5 group-hover:translate-y-1 transition-transform" />
              </Button>
            </motion.div>
          </div>

          {/* Stats Cards */}
          <motion.div
            variants={containerVariants}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto w-full"
          >
            {[
              {
                label: "نوع سبد",
                value: stats.totalPlans,
                icon: <BarChart3 className="h-6 w-6" />,
                gradient: "from-violet-500/20 to-purple-500/20",
                iconBg: "bg-violet-500/20",
                border: "border-violet-400/30",
              },
              {
                label: "حداقل سرمایه (میلیون)",
                value: stats.minInvestment,
                icon: <Wallet className="h-6 w-6" />,
                gradient: "from-blue-500/20 to-cyan-500/20",
                iconBg: "bg-blue-500/20",
                border: "border-blue-400/30",
              },
              {
                label: "حداکثر بازدهی",
                value: `${stats.maxReturn}٪`,
                icon: <TrendingUp className="h-6 w-6" />,
                gradient: "from-emerald-500/20 to-teal-500/20",
                iconBg: "bg-emerald-500/20",
                border: "border-emerald-400/30",
              },
              {
                label: "تضمین سرمایه",
                value: "100٪",
                icon: <Shield className="h-6 w-6" />,
                gradient: "from-amber-500/20 to-orange-500/20",
                iconBg: "bg-amber-500/20",
                border: "border-amber-400/30",
              },
            ].map((item) => (
              <motion.div
                key={item.label}
                variants={itemVariants}
                whileHover={
                  !isMobile
                    ? {
                        scale: 1.05,
                        y: -8,
                        transition: { duration: 0.3 },
                      }
                    : undefined
                }
                className={`group relative overflow-hidden rounded-3xl border ${item.border} bg-gradient-to-br ${item.gradient} p-6 ${
                  isMobile ? "backdrop-blur-sm" : "backdrop-blur-xl"
                } shadow-xl hover:shadow-2xl transition-all duration-300`}
              >
                {/* Shine effect on hover - disabled on mobile */}
                {!isMobile && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                )}

                <div className="relative flex flex-col items-center text-center gap-4">
                  <span
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.iconBg} text-white shadow-lg backdrop-blur-sm`}
                  >
                    {item.icon}
                  </span>
                  <div className="flex flex-col gap-1">
                    <span className="text-3xl font-bold text-white">
                      {item.value}
                    </span>
                    <span className="text-sm text-slate-300 font-medium">
                      {item.label}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator - Simplified on mobile */}
      {!isMobile ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={floatAnimation}
            className="flex flex-col items-center gap-2 cursor-pointer"
            onClick={scrollToPlans}
          >
            <span className="text-xs text-slate-400 font-medium">
              مشاهده سبدها
            </span>
            <motion.div
              animate={{
                y: [0, 8, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="h-10 w-6 rounded-full border-2 border-white/30 flex items-start justify-center p-1"
            >
              <motion.div
                animate={{
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="h-2 w-2 rounded-full bg-white"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      ) : (
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 cursor-pointer"
          onClick={scrollToPlans}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">
              مشاهده سبدها
            </span>
            <ArrowDown className="h-5 w-5 text-white/60" />
          </div>
        </div>
      )}
    </section>
  );
};
