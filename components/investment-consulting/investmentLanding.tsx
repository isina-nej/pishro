"use client";

import Image from "next/image";
import Link from "next/link";
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
import { investmentConsultingData } from "@/public/data";
import { PhoneCall, Send } from "lucide-react";

const InvestmentLanding = () => {
  return (
    <div className="container flex flex-col lg:flex-row justify-between gap-8 py-1 mb-20">
      {/* Text & Actions */}
      <div className="flex-1 flex flex-col gap-y-10 text-center justify-center">
        <h3 className="text-4xl font-bold text-gray-900 leading-tight">
          {investmentConsultingData.title}
        </h3>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
          {investmentConsultingData.text}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          {/* In-Person Consultation */}
          <Drawer>
            <DrawerTrigger asChild>
              <button className="group relative px-7 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:brightness-110 text-white font-semibold shadow-lg transition-all flex items-center justify-center gap-2">
                <PhoneCall className="h-5 w-5 group-hover:scale-110 transition-transform" />
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
                <DrawerClose className="block mt-6 text-sm text-gray-500 underline text-center">
                  بستن
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          {/* Online Consultation */}
          <Drawer>
            <DrawerTrigger asChild>
              <button className="group relative px-7 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:brightness-110 text-white font-semibold shadow-lg transition-all flex items-center justify-center gap-2">
                <Send className="h-5 w-5 group-hover:scale-110 transition-transform" />
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
                <DrawerClose className="block mt-6 text-sm text-gray-500 underline text-center">
                  بستن
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      {/* Image Section */}
      <div className="flex-1 relative flex items-center justify-center mt-12 lg:mt-0">
        <div className="relative w-full h-[630px] overflow-hidden isolate rounded-xl">
          <div className="absolute inset-y-0 left-0 w-[120px] bg-[linear-gradient(to_right,_#fefefe_40%,_transparent_100%)] z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-[130px] bg-[linear-gradient(to_left,_#fefefe_40%,_transparent_100%)] z-10 pointer-events-none" />
          <Image
            className="object-contain"
            fill
            src={investmentConsultingData.image}
            alt="مشاوره سرمایه‌گذاری"
          />
        </div>
      </div>
    </div>
  );
};

export default InvestmentLanding;
