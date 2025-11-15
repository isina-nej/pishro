"use client";

import Image from "next/image";
import Link from "next/link";
import { PhoneCall, Send, GraduationCap, XIcon } from "lucide-react"; // 🧠 اضافه شده
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { businessConsultingData } from "@/public/data";

const InvestmentLanding = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden isolate flex items-center justify-start text-center px-4 -mb-32">
      {/* 📷 Background Image */}
      <Image
        src={businessConsultingData.image}
        alt="مشاوره سرمایه‌گذاری"
        fill
        className="object-cover z-0"
        priority
      />

      {/* 🔲 Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-black/50 to-black/5 z-10 pointer-events-none" />

      {/* 📝 Main Content */}
      <div className="relative z-20 max-w-2xl text-white flex flex-col items-center rtl gap-y-8 px-8">
        <h3 className="text-4xl lg:text-5xl font-bold leading-tight">
          {businessConsultingData.title}
        </h3>
        <p className="text-white/90 text-lg max-w-xl mx-auto leading-relaxed">
          {businessConsultingData.text}
        </p>

        {/* 🎯 Call-to-Actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full">
          {/* 📍 مشاوره حضوری */}
          <Drawer>
            <DrawerTrigger asChild>
              <button className="group relative w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium backdrop-blur-sm shadow-lg transition-all flex items-center justify-center gap-2">
                <PhoneCall className="h-5 w-5 text-green-400 group-hover:scale-110 transition-transform" />
                رزرو مشاوره حضوری
              </button>
            </DrawerTrigger>
            <DrawerContent className="p-6 rounded-t-2xl border-t bg-white shadow-2xl">
              <DrawerHeader className="text-center">
                <div className="flex justify-center">
                  <PhoneCall className="text-green-600 h-10 w-10" />
                </div>
                <DrawerTitle className="text-2xl font-bold text-gray-900 mt-2">
                  مشاوره حضوری
                </DrawerTitle>
                <DrawerDescription className="text-center text-gray-600 mt-1">
                  برای رزرو مشاوره حضوری با ما تماس بگیرید:
                </DrawerDescription>
              </DrawerHeader>
              <div className="text-center mt-4 space-y-3">
                <p className="text-xl font-semibold text-green-700 tracking-tight">
                  0912-123-4567
                </p>
                <a
                  href="tel:09121234567"
                  className="inline-block px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition"
                >
                  تماس بگیرید
                </a>
              </div>
              <DrawerFooter>
                <DrawerClose className="block mt-6 text-sm text-gray-400 hover:text-gray-600 underline text-center">
                  <XIcon className="inline-block" />
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          {/* 💻 مشاوره آنلاین */}
          <Drawer>
            <DrawerTrigger asChild>
              <button className="group relative w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium backdrop-blur-sm shadow-lg transition-all flex items-center justify-center gap-2">
                <Send className="h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform" />
                رزرو مشاوره آنلاین
              </button>
            </DrawerTrigger>
            <DrawerContent className="p-6 rounded-t-2xl border-t bg-white shadow-2xl">
              <DrawerHeader className="text-center">
                <div className="flex justify-center">
                  <Send className="text-blue-600 h-10 w-10" />
                </div>
                <DrawerTitle className="text-2xl font-bold text-gray-900 mt-2">
                  مشاوره آنلاین
                </DrawerTitle>
                <DrawerDescription className="text-center text-gray-600 mt-1">
                  برای دریافت مشاوره آنلاین از طریق تلگرام پیام دهید:
                </DrawerDescription>
              </DrawerHeader>
              <div className="text-center mt-4 space-y-3">
                <p className="text-xl font-semibold text-blue-700 tracking-tight">
                  @InvestmentSupport
                </p>
                <Link
                  href="https://t.me/amirhossein_v2"
                  target="_blank"
                  className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition"
                >
                  پیام در تلگرام
                </Link>
              </div>
              <DrawerFooter>
                <DrawerClose className="block mt-6 text-sm text-gray-400 hover:text-gray-600 underline text-center">
                  <XIcon className="inline-block" />
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          {/* 🎓 دوره‌ها */}
          <Drawer>
            <DrawerTrigger asChild>
              <button className="group relative w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium backdrop-blur-sm shadow-lg transition-all flex items-center justify-center gap-2">
                <GraduationCap className="h-5 w-5 text-yellow-400 group-hover:scale-110 transition-transform" />
                دوره‌ها
              </button>
            </DrawerTrigger>
            <DrawerContent className="p-6 rounded-t-2xl border-t bg-white shadow-2xl">
              <DrawerHeader className="text-center">
                <div className="flex justify-center">
                  <GraduationCap className="text-yellow-600 h-10 w-10" />
                </div>
                <DrawerTitle className="text-2xl font-bold text-gray-900 mt-2">
                  دوره‌های آموزشی
                </DrawerTitle>
                <DrawerDescription className="text-center text-gray-600 mt-1">
                  برای مشاهده دوره‌های ما در تلگرام کلیک کنید:
                </DrawerDescription>
              </DrawerHeader>
              <div className="text-center mt-4 space-y-3">
                <p className="text-xl font-semibold text-yellow-700 tracking-tight">
                  @MyCoursesChannel
                </p>
                <Link
                  href="https://t.me/MyCoursesChannel"
                  target="_blank"
                  className="inline-block px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md font-medium transition"
                >
                  مشاهده دوره‌ها
                </Link>
              </div>
              <DrawerFooter>
                <DrawerClose className="block mt-6 text-sm text-gray-400 hover:text-gray-600 underline text-center">
                  <XIcon className="inline-block" />
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </div>
  );
};

export default InvestmentLanding;
