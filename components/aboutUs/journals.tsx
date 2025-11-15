"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { LuArrowLeft, LuNewspaper } from "react-icons/lu";
import type { NewsArticle } from "@/types/about-us";

interface JournalsProps {
  news: NewsArticle[];
}

const Journals = ({ news }: JournalsProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  if (news.length === 0) {
    return null;
  }

  return (
    <div ref={ref} className="container-md py-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 bg-myPrimary/10 text-myPrimary px-6 py-2 rounded-full mb-4">
          <LuNewspaper className="text-xl" />
          <span className="font-medium">اطلاعیه‌ها و مقالات</span>
        </div>
        <h2 className="text-4xl font-bold mb-4 text-gray-800">
          تازه‌ها و <span className="text-myPrimary">رویدادهای پیشرو</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          آخرین اخبار، رویدادها و مقالات آموزشی ما را دنبال کنید
        </p>
      </motion.div>

      {/* Journals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {news.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group border border-gray-100"
          >
            {/* Icon Badge */}
            <div className="inline-flex bg-gradient-to-br from-myPrimary to-mySecondary text-white p-4 rounded-xl mb-6 group-hover:scale-110 transition-transform">
              <LuNewspaper className="text-2xl" />
            </div>

            {/* Category Badge */}
            <div className="mb-3">
              <span className="inline-block bg-myPrimary/10 text-myPrimary px-3 py-1 rounded-full text-xs font-medium">
                {item.category}
              </span>
            </div>

            {/* Title */}
            <h5 className="font-bold text-xl mb-4 text-gray-800 group-hover:text-myPrimary transition-colors line-clamp-2">
              {item.title}
            </h5>

            {/* Text */}
            <p className="font-medium text-base leading-relaxed text-gray-600 mb-6 line-clamp-4">
              {item.excerpt}
            </p>

            {/* Link */}
            <Link
              href={`/news/${item.slug}`}
              className="inline-flex items-center gap-2 text-myPrimary font-bold group-hover:gap-4 transition-all"
            >
              <span>مطالعه بیشتر</span>
              <LuArrowLeft className="text-xl" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Journals;
