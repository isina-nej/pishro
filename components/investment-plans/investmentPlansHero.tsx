"use client";

import { motion } from "framer-motion";
import { Wallet, TrendingUp, Shield, BarChart3 } from "lucide-react";
import Image from "next/image";
import { InvestmentPlans, InvestmentPlan, InvestmentTag } from "@prisma/client";

interface InvestmentPlansHeroProps {
  investmentPlansData: InvestmentPlans & {
    plans: InvestmentPlan[];
    tags: InvestmentTag[];
  };
}

export const InvestmentPlansHero = ({
  investmentPlansData,
}: InvestmentPlansHeroProps) => {
  // Calculate stats from data
  const stats = {
    totalPlans: investmentPlansData.plans.length || 3,
    totalTags: investmentPlansData.tags.length || 8,
    minInvestment: investmentPlansData.minAmount || 10,
    maxReturn: 11, // درصد بازدهی حداکثر
  };

  return (
    <section className="relative overflow-hidden pb-32 pt-36 text-white">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={investmentPlansData.image || "/images/investment-plans.jpg"}
          alt="سبدهای سرمایه‌گذاری"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-900/90" />
      </div>

      {/* Floating Elements for depth */}
      <div className="absolute -left-10 top-24 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="container-xl relative z-10 flex flex-col gap-10">
        <div className="max-w-3xl space-y-6">
          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-medium text-slate-100">
            سبدهای سرمایه‌گذاری پیشرو
          </span>
          <h1 className="text-4xl font-extrabold !leading-tight md:text-5xl">
            {investmentPlansData.title}
          </h1>
          <p className="text-base text-slate-200 md:text-lg">
            {investmentPlansData.description}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "نوع سبد",
              value: stats.totalPlans,
              icon: <BarChart3 className="h-5 w-5" />,
            },
            {
              label: "حداقل سرمایه (میلیون)",
              value: stats.minInvestment,
              icon: <Wallet className="h-5 w-5" />,
            },
            {
              label: "حداکثر بازدهی",
              value: `${stats.maxReturn}٪`,
              icon: <TrendingUp className="h-5 w-5" />,
            },
            {
              label: "تضمین سرمایه",
              value: "100٪",
              icon: <Shield className="h-5 w-5" />,
            },
          ].map((item) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-5 py-4 backdrop-blur"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white">
                {item.icon}
              </span>
              <div className="flex flex-col">
                <span className="text-lg font-semibold">{item.value}</span>
                <span className="text-sm text-slate-200">{item.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
