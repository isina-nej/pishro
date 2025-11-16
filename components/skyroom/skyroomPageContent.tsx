"use client";

import { SkyRoomClass } from "@prisma/client";
import Image from "next/image";
import { motion } from "motion/react";
import {
  HiVideoCamera,
  HiClock,
  HiCalendar,
  HiUser,
  HiUserGroup,
  HiArrowRight
} from "react-icons/hi";
import { FiExternalLink } from "react-icons/fi";

interface SkyRoomPageContentProps {
  classes: SkyRoomClass[];
}

const SkyRoomPageContent: React.FC<SkyRoomPageContentProps> = ({ classes }) => {
  const formatDate = (date: Date | null) => {
    if (!date) return "نامشخص";
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section با عکس پس‌زمینه */}
      <div className="relative h-[60vh] min-h-[500px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/skyroom/landing.jpg"
            alt="SkyRoom Classes"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container-xl h-full flex flex-col justify-center items-center text-center text-white px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
              کلاس‌های آنلاین اسکای‌روم
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
              به کلاس‌های زنده و تعاملی ما بپیوندید و تجربه‌ای بی‌نظیر از آموزش آنلاین داشته باشید
            </p>
            <div className="flex items-center justify-center gap-3 text-lg">
              <HiVideoCamera className="text-3xl text-myPrimary" />
              <span>ورود آسان به عنوان مهمان</span>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-white">
            <span className="text-sm">برای مشاهده کلاس‌ها اسکرول کنید</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <HiArrowRight className="text-2xl rotate-90" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Classes Grid Section */}
      <div className="container-xl py-16 px-4">
        {classes.length === 0 ? (
          <div className="text-center py-20">
            <HiVideoCamera className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">
              در حال حاضر کلاسی برگزار نمی‌شود
            </h3>
            <p className="text-gray-500">
              به زودی کلاس‌های جدید اضافه خواهند شد
            </p>
          </div>
        ) : (
          <>
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">کلاس‌های در حال برگزاری</h2>
              <p className="text-gray-600 text-lg">
                با یک کلیک به کلاس مورد نظر بپیوندید
              </p>
            </motion.div>

            {/* Classes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {classes.map((classItem, index) => (
                <motion.div
                  key={classItem.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                    {/* Class Thumbnail */}
                    <div className="relative h-56 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
                      {classItem.thumbnail ? (
                        <Image
                          src={classItem.thumbnail}
                          alt={classItem.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <HiVideoCamera className="text-8xl text-white/30" />
                        </div>
                      )}
                      {/* Level Badge */}
                      {classItem.level && (
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                          {classItem.level}
                        </div>
                      )}
                    </div>

                    {/* Class Info */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-myPrimary transition-colors">
                        {classItem.title}
                      </h3>

                      {classItem.description && (
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {classItem.description}
                        </p>
                      )}

                      {/* Class Details */}
                      <div className="space-y-3 mb-6 flex-1">
                        {classItem.instructor && (
                          <div className="flex items-center gap-3 text-gray-700">
                            <HiUser className="text-xl text-myPrimary" />
                            <span className="text-sm">مدرس: {classItem.instructor}</span>
                          </div>
                        )}

                        {classItem.startDate && (
                          <div className="flex items-center gap-3 text-gray-700">
                            <HiCalendar className="text-xl text-myPrimary" />
                            <span className="text-sm">
                              شروع: {formatDate(classItem.startDate)}
                            </span>
                          </div>
                        )}

                        {classItem.duration && (
                          <div className="flex items-center gap-3 text-gray-700">
                            <HiClock className="text-xl text-myPrimary" />
                            <span className="text-sm">مدت زمان: {classItem.duration}</span>
                          </div>
                        )}

                        {classItem.capacity && (
                          <div className="flex items-center gap-3 text-gray-700">
                            <HiUserGroup className="text-xl text-myPrimary" />
                            <span className="text-sm">ظرفیت: {classItem.capacity} نفر</span>
                          </div>
                        )}
                      </div>

                      {/* Join Button */}
                      <a
                        href={classItem.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full"
                      >
                        <button className="w-full bg-gradient-to-r from-myPrimary to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group">
                          <span>ورود به عنوان مهمان</span>
                          <FiExternalLink className="text-xl group-hover:translate-x-1 transition-transform" />
                        </button>
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Info Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container-xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center p-6"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiVideoCamera className="text-3xl text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">کیفیت بالا</h3>
              <p className="text-gray-600">
                تجربه کلاس آنلاین با کیفیت تصویر و صدای عالی
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiUserGroup className="text-3xl text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">تعامل زنده</h3>
              <p className="text-gray-600">
                امکان پرسش و پاسخ و تعامل مستقیم با مدرس
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center p-6"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiClock className="text-3xl text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">دسترسی آسان</h3>
              <p className="text-gray-600">
                ورود سریع و آسان بدون نیاز به ثبت‌نام
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkyRoomPageContent;
