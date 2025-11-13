"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { aboutPishro, pishroBranding } from "@/public/data";
import { LuLinkedin, LuMail, LuGraduationCap } from "react-icons/lu";

const teamMembers = [
  {
    id: 1,
    name: "دکتر طاهره جهانی",
    role: "مدیرعامل و بنیانگذار",
    image: "/images/about/about.jpg",
    education: "دکترای اقتصاد (گرایش اقتصادسنجی)",
    description: pishroBranding.description.substring(0, 200) + "...",
    specialties: ["تحلیل تکنیکال", "بازارهای مالی", "آموزش دانشگاهی"],
  },
  {
    id: 2,
    name: "دکتر سید عنایت‌الله مومنی",
    role: "مدیرعامل و بنیانگذار",
    image: "/images/about/about3.jpg",
    education: "دکترای مدیریت آموزشی",
    description: aboutPishro.description.substring(0, 200) + "...",
    specialties: ["مدیریت مالی", "بانکداری", "مشاوره کسب‌وکار"],
  },
];

const TeamSection = () => {
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
          تیم <span className="text-myPrimary">پیشرو</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          بنیانگذاران و رهبران آکادمی مالی پیشرو سرمایه
        </p>
      </motion.div>

      {/* Team Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {teamMembers.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group"
          >
            {/* Image Section */}
            <div className="relative h-80 overflow-hidden">
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

              {/* Name on Image */}
              <div className="absolute bottom-6 right-6 text-white">
                <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                <p className="text-white/90 font-medium">{member.role}</p>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8">
              {/* Education */}
              <div className="flex items-start gap-3 mb-6 bg-myPrimary/5 rounded-xl p-4">
                <LuGraduationCap className="text-2xl text-myPrimary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">{member.education}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed mb-6">
                {member.description}
              </p>

              {/* Specialties */}
              <div className="mb-6">
                <h4 className="font-bold text-gray-800 mb-3 text-sm">
                  تخصص‌های کلیدی:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {member.specialties.map((specialty, idx) => (
                    <span
                      key={idx}
                      className="bg-mySecondary/10 text-mySecondary px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-3 pt-6 border-t">
                <button className="flex-1 bg-myPrimary/10 hover:bg-myPrimary text-myPrimary hover:text-white py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium">
                  <LuLinkedin />
                  <span>لینکدین</span>
                </button>
                <button className="flex-1 bg-mySecondary/10 hover:bg-mySecondary text-mySecondary hover:text-white py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium">
                  <LuMail />
                  <span>ایمیل</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TeamSection;
