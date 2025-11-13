"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import { HiXMark } from "react-icons/hi2";
import { LuAward } from "react-icons/lu";

// دیتای نمونه برای گالری - بعداً می‌تونید با دیتای واقعی جایگزین کنید
const certificatesData = [
  {
    id: 1,
    image: "/images/about/about.jpg",
    title: "تقدیرنامه برتر سال ۱۴۰۱",
    description: "دریافت تندیس برترین آموزشگاه بازارهای مالی",
  },
  {
    id: 2,
    image: "/images/about/about2.jpg",
    title: "گواهینامه تخصصی",
    description: "مجوز فعالیت آموزشی از سازمان بورس",
  },
  {
    id: 3,
    image: "/images/about/about3.jpg",
    title: "افتخار ملی",
    description: "دریافت نشان ملی کارآفرینی",
  },
  {
    id: 4,
    image: "/images/about/about.jpg",
    title: "گواهی استاندارد",
    description: "گواهی استاندارد ISO از مرکز ملی استاندارد",
  },
  {
    id: 5,
    image: "/images/about/about2.jpg",
    title: "تقدیرنامه نوآوری",
    description: "برترین مرکز آموزشی نوآور",
  },
  {
    id: 6,
    image: "/images/about/about3.jpg",
    title: "جایزه ملی",
    description: "دریافت جایزه ملی کیفیت",
  },
];

const CertificatesGallery = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <>
      <div ref={ref} className="bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="container-md">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-6 py-2 rounded-full mb-4">
              <LuAward className="text-xl" />
              <span className="font-medium">افتخارات و دستاوردها</span>
            </div>
            <h2 className="text-4xl font-bold mb-4 text-gray-800">
              گالری <span className="text-myPrimary">تقدیرنامه‌ها</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              مجموعه‌ای از افتخارات و دستاوردهای ما در مسیر خدمت‌رسانی به جامعه
            </p>
          </motion.div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certificatesData.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setSelectedImage(index)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300">
                  {/* Image */}
                  <Image
                    src={cert.image}
                    alt={cert.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <LuAward className="text-yellow-400" />
                        <h3 className="font-bold text-lg">{cert.title}</h3>
                      </div>
                      <p className="text-sm text-gray-200">{cert.description}</p>
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    {index + 1}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-12"
          >
            <p className="text-gray-600 mb-4">
              و بیش از ۵۰ مورد افتخار دیگر در طول این سال‌ها...
            </p>
          </motion.div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 left-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-sm transition-all z-10"
          >
            <HiXMark className="text-2xl" />
          </button>

          {/* Image */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="relative w-full max-w-4xl aspect-[4/3] rounded-2xl overflow-hidden"
          >
            <Image
              src={certificatesData[selectedImage].image}
              alt={certificatesData[selectedImage].title}
              fill
              className="object-contain"
            />
          </motion.div>

          {/* Info */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-2xl max-w-2xl text-center">
            <h3 className="font-bold text-xl mb-2">
              {certificatesData[selectedImage].title}
            </h3>
            <p className="text-gray-200">
              {certificatesData[selectedImage].description}
            </p>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default CertificatesGallery;
