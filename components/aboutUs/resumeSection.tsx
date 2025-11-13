"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { LuClock, LuTarget, LuEye, LuHeart } from "react-icons/lu";

const resumeData = [
  {
    id: 1,
    icon: <LuClock className="text-4xl" />,
    title: "تاریخچه ما",
    description:
      "آکادمی مالی پیشرو سرمایه از سال ۱۴۰۰ فعالیت خود را با هدف ارتقاء سواد مالی جامعه آغاز کرد. با تیمی متشکل از اساتید مجرب دانشگاهی و کارشناسان حرفه‌ای بازارهای مالی، توانستیم در این مدت کوتاه به یکی از مراجع معتبر آموزش و مشاوره در حوزه بازارهای سرمایه تبدیل شویم.",
    color: "from-blue-500 to-purple-500",
    bgColor: "bg-blue-50",
  },
  {
    id: 2,
    icon: <LuTarget className="text-4xl" />,
    title: "ماموریت ما",
    description:
      "ماموریت ما ارائه آموزش‌های جامع، علمی و کاربردی در زمینه بازارهای مالی از جمله بورس، ارزهای دیجیتال، NFT، متاورس و ایردراپ است. ما معتقدیم که با افزایش دانش مالی افراد، می‌توانیم به رشد اقتصادی جامعه کمک کنیم و آینده‌ای مطمئن‌تر برای سرمایه‌گذاران بسازیم.",
    color: "from-green-500 to-teal-500",
    bgColor: "bg-green-50",
  },
  {
    id: 3,
    icon: <LuEye className="text-4xl" />,
    title: "چشم‌انداز ما",
    description:
      "چشم‌انداز ما تبدیل شدن به بزرگ‌ترین و معتبرترین مرجع آموزش و مشاوره بازارهای مالی در کشور است. ما در تلاشیم تا با ارائه خدمات نوآورانه و استفاده از جدیدترین متدهای آموزشی، بستری امن و حرفه‌ای برای رشد و موفقیت سرمایه‌گذاران فراهم کنیم.",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50",
  },
  {
    id: 4,
    icon: <LuHeart className="text-4xl" />,
    title: "ارزش‌های ما",
    description:
      "اعتماد، شفافیت، تخصص و مسئولیت‌پذیری از ارزش‌های بنیادین ما هستند. ما معتقدیم که موفقیت شما، موفقیت ماست. به همین دلیل، همواره سعی داریم با ارائه بهترین کیفیت آموزش، پشتیبانی مستمر و مشاوره صادقانه، در کنار شما باشیم.",
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-50",
  },
];

const ResumeSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="container-md py-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold mb-4 text-gray-800">
          داستان <span className="text-myPrimary">پیشرو</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          از آغاز تا امروز، با هدف واحد: ساختن آینده‌ای روشن‌تر برای سرمایه‌گذاران
        </p>
      </motion.div>

      {/* Resume Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {resumeData.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`${item.bgColor} rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden`}
          >
            {/* Gradient Background */}
            <div
              className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.color} rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity`}
            ></div>

            {/* Icon */}
            <div
              className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${item.color} text-white mb-6 group-hover:scale-110 transition-transform relative z-10`}
            >
              {item.icon}
            </div>

            {/* Content */}
            <h3 className="text-2xl font-bold mb-4 text-gray-800 relative z-10">
              {item.title}
            </h3>
            <p className="text-gray-600 leading-relaxed relative z-10">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ResumeSection;
