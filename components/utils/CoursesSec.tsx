"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown, Folder } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CourseCard from "@/components/utils/courseCard";
import { useCourses } from "@/lib/hooks/useCourses";

const categories = [
  { label: "همه", href: "/" },
  { label: "کریپتو", href: "/cryptocurrency" },
  { label: "بورس", href: "/stock-market" },
  { label: "متاورس", href: "/metaverse" },
  { label: "ایردراپ", href: "/airdrop" },
  { label: "NFT", href: "/nft" },
];

const CoursesSec = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  // استفاده از React Query hook
  const { data: courses = [], isLoading: loading } = useCourses();

  const filteredCourses =
    selectedCategory.label === "همه"
      ? courses
      : courses.filter((c) => c.subject.includes(selectedCategory.label));

  if (loading)
    return (
      <section className="flex justify-center items-center h-64">
        <p className="text-gray-500">در حال بارگذاری...</p>
      </section>
    );

  return (
    <section
      className="relative flex flex-col justify-center container-xl mt-8 sm:mt-12 md:mt-16 lg:mt-28"
      aria-label="دوره‌های آموزشی"
    >
      {/* Header */}
      <div className="w-full flex justify-center items-center text-center gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-0">
        <div className="w-[260px]"></div>
        <div className="flex-1 flex flex-col items-center">
          <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl flex items-center justify-center gap-2 sm:gap-2.5 md:gap-3">
            <span>دوره‌ها</span>
            <div className="relative w-12 h-6 sm:w-14 sm:h-7 md:w-16 md:h-8">
              <Image
                src={"/icons/smile.svg"}
                alt="ایموجی خوشحالی"
                fill
                className="object-fill"
              />
            </div>
          </h2>
          <p className="text-[#8A8A8A] mt-1 sm:mt-1.5 md:mt-2 font-bold text-xs sm:text-sm md:text-base max-w-xl">
            این دوره‌ها منتخب بهترین دوره‌های مجموعه ماست
          </p>
        </div>

        {/* Buttons Section */}
        <div className="relative flex items-center justify-end gap-3 mt-2 w-[260px]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 bg-white border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm hover:shadow-md transition text-sm font-bold">
                <ChevronDown size={16} />
                <span>{selectedCategory.label}</span>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-40 bg-white border border-gray-200 rounded-lg shadow-lg"
            >
              {categories.map((cat) => (
                <DropdownMenuItem
                  key={cat.href}
                  onClick={() => setSelectedCategory(cat)}
                  className={`cursor-pointer rtl text-right text-sm px-4 py-2 hover:bg-gray-100 ${
                    cat.label === selectedCategory.label
                      ? "font-bold text-mySecondary"
                      : ""
                  }`}
                >
                  {cat.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href={selectedCategory.href}
            className="flex items-center gap-1 bg-mySecondary text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:opacity-90 transition"
          >
            <Folder size={16} />
            <span>صفحه {selectedCategory.label}</span>
          </Link>
        </div>
      </div>

      {/* Course grid */}
      <div className="mt-6 sm:mt-8 md:mt-12 lg:mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-7 md:gap-8 place-items-center pb-8 sm:pb-10 md:pb-12 lg:pb-16 w-full">
        {filteredCourses.map((data, idx) => {
          // Build dynamic link - use /courses as fallback
          const courseLink = data.slug ? `/courses/${data.slug}` : "/courses";

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
              className="w-full"
            >
              <CourseCard data={data} link={courseLink} />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default CoursesSec;
