"use client";

import { motion } from "framer-motion";
import { Newspaper, Star, Eye, TrendingUp } from "lucide-react";
import Image from "next/image";

interface NewsHeroProps {
  stats: {
    totalNews: number;
    featured: number;
    thisMonth: number;
    avgViews: number;
  };
}

const statsData = [
  {
    label: "خبر منتشر شده",
    value: "totalNews",
    icon: <Newspaper className="h-6 w-6" />,
    color: "from-primary/20 to-primary/20",
    iconColor: "text-primary",
  },
  {
    label: "اخبار ویژه",
    value: "featured",
    icon: <Star className="h-6 w-6" />,
    color: "from-accent/20 to-destructive/20",
    iconColor: "text-accent-foreground",
  },
  {
    label: "انتشار این ماه",
    value: "thisMonth",
    icon: <TrendingUp className="h-6 w-6" />,
    color: "from-primary/20 to-primary/20",
    iconColor: "text-primary",
  },
  {
    label: "میانگین بازدید",
    value: "avgViews",
    icon: <Eye className="h-6 w-6" />,
    color: "from-premium/20 to-destructive/20",
    iconColor: "text-premium",
  },
];

export const NewsHero = ({ stats }: NewsHeroProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const getStatValue = (key: string) => {
    const statKey = key as keyof typeof stats;
    const value = stats[statKey];
    return Number.isFinite(value) ? value : 0;
  };

  return (
    <section className="relative overflow-hidden pb-40 pt-32 text-foreground lg:pb-48">
      {/* Background with enhanced gradient */}
      <div className="absolute inset-0">
        <Image
          src="/images/news/header.jpg"
          alt="news-background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/15 to-black/55" />
      </div>

      {/* Animated floating elements */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-20 top-10 h-80 w-80 rounded-full bg-gradient-to-r from-primary to-primary blur-3xl opacity-10"
      />
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -right-20 bottom-20 h-96 w-96 rounded-full bg-gradient-to-r from-accent to-destructive blur-3xl opacity-10"
      />

      <div className="container-xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 max-w-4xl space-y-6 rounded-[2rem] border border-white/20 bg-black/40 p-7 shadow-2xl shadow-black/30 sm:p-9 lg:mb-16 text-white"
        >
          {/* Badge */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              اخبار و رویدادهای پیشرو
            </span>
          </motion.div>

          {/* Main heading with gradient */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl font-black !leading-tight md:text-6xl lg:text-7xl"
            >
              <span className="bg-gradient-to-r from-white via-emerald-200 to-amber-200 bg-clip-text text-transparent">
                به‌روزترین اخبار
              </span>
              <br />
              <span className="text-white">دنیای سرمایه‌گذاری</span>
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl"
          >
            تازه‌ترین اخبار، تحلیل‌ها و بینش‌های بازار سرمایه که توسط تیم تحریریه پیشرو با دقت انتخاب شده‌اند تا شما همیشه یک قدم جلوتر باشید.
          </motion.p>
        </motion.div>

        {/* Statistics Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {statsData.map((item) => (
            <motion.div
              key={item.label}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden rounded-3xl border border-white/20 bg-black/40 px-6 py-5 text-white shadow-xl shadow-black/25 transition-all duration-300 hover:-translate-y-1 hover:bg-black/50"
            >
              {/* Background gradient effect */}
              <div className={`absolute -inset-1 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 blur transition-opacity duration-300 -z-10`} />

              <div className="relative flex items-start justify-between">
                <div className="flex flex-col gap-2">
                  <span className={`text-2xl md:text-3xl font-bold ${item.iconColor}`}>
                    {getStatValue(item.value).toLocaleString("fa-IR")}
                  </span>
                  <span className="text-xs md:text-sm font-medium text-white/75">{item.label}</span>
                </div>
                <div className={`${item.iconColor} rounded-xl bg-white/10 p-2 transition-colors group-hover:bg-white/15`}>
                  {item.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
