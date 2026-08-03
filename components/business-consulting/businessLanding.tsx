"use client";

import Image from "next/image";
import Link from "next/link";
import { PhoneCall, Send, GraduationCap, XIcon } from "lucide-react";
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
import { BusinessConsulting } from "@prisma/client";
import { contactInfo } from "@/lib/constants/contact";

interface BusinessLandingProps {
  businessConsultingData: BusinessConsulting;
}

const BusinessLanding = ({ businessConsultingData }: BusinessLandingProps) => {
  return (
    <div className="relative w-full h-screen overflow-hidden isolate flex items-center justify-start text-center px-4 pt-20 md:pt-0 -mb-32">
      {/* 📷 Background Image */}
      <Image
        src={
          businessConsultingData.image ||
          "/images/investment-consulting/landing.jpg"
        }
        alt="مشاوره کسب و کار"
        fill
        className="object-cover z-0"
        priority
      />

      {/* 🔲 Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-black/50 to-black/5 z-10 pointer-events-none" />

      {/* 📝 Main Content */}
      <div className="rtl relative z-20 flex max-w-2xl flex-col items-center gap-y-8 rounded-[2.25rem] border border-border/15 bg-[#091a28]/50 px-6 py-8 text-primary-foreground shadow-2xl backdrop-blur-2xl sm:px-10 sm:py-10">
        <h3 className="text-4xl lg:text-5xl font-bold leading-tight">
          {businessConsultingData.title}
        </h3>
        <p className="text-primary-foreground/90 text-base lg:text-lg max-w-2xl mx-auto leading-loose text-justify lg:text-right">
          {businessConsultingData.description}
        </p>

        {/* 🎯 Call-to-Actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full">
          {/* 📍 مشاوره حضوری */}
          <Drawer>
            <DrawerTrigger asChild>
              <button className="group relative flex w-full items-center justify-center gap-2 rounded-full border border-border/60 bg-card/90 px-6 py-3 font-bold !text-[#112b3a] shadow-xl transition-all hover:-translate-y-0.5 hover:bg-primary sm:w-auto">
                <PhoneCall className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
                رزرو مشاوره حضوری
              </button>
            </DrawerTrigger>
            <DrawerContent className="p-6 rounded-t-2xl border-t bg-card dark:bg-cardBg shadow-2xl">
              <DrawerHeader className="text-center">
                <div className="flex justify-center">
                  <PhoneCall className="text-primary h-10 w-10" />
                </div>
                <DrawerTitle className="text-2xl font-bold text-foreground dark:text-textPrimary mt-2">
                  {businessConsultingData.inPersonTitle || "مشاوره حضوری"}
                </DrawerTitle>
                <DrawerDescription className="text-center text-muted-foreground dark:text-textSecondary mt-1">
                  {businessConsultingData.inPersonDescription ||
                    "برای رزرو مشاوره حضوری با ما تماس بگیرید:"}
                </DrawerDescription>
              </DrawerHeader>
              <div className="text-center mt-4 space-y-3">
                <p className="text-xl font-semibold text-primary tracking-tight">
                  {contactInfo.mobile}
                </p>
                <a
                  href={`tel:${contactInfo.mobileTel}`}
                  className="inline-block px-6 py-2 bg-primary hover:bg-primary text-primary-foreground rounded-md font-medium transition"
                >
                  تماس بگیرید
                </a>
              </div>
              <DrawerFooter>
                <DrawerClose className="block mt-6 text-sm text-muted-foreground dark:text-textSecondary hover:text-muted-foreground dark:hover:text-textSecondary underline text-center">
                  <XIcon className="inline-block" />
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          {/* 💻 مشاوره آنلاین */}
          <Drawer>
            <DrawerTrigger asChild>
              <button className="group relative flex w-full items-center justify-center gap-2 rounded-full border border-border/60 bg-card/90 px-6 py-3 font-bold !text-[#112b3a] shadow-xl transition-all hover:-translate-y-0.5 hover:bg-primary sm:w-auto">
                <Send className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
                رزرو مشاوره آنلاین
              </button>
            </DrawerTrigger>
            <DrawerContent className="p-6 rounded-t-2xl border-t bg-card dark:bg-cardBg shadow-2xl">
              <DrawerHeader className="text-center">
                <div className="flex justify-center">
                  <Send className="text-primary h-10 w-10" />
                </div>
                <DrawerTitle className="text-2xl font-bold text-foreground dark:text-textPrimary mt-2">
                  {businessConsultingData.onlineTitle || "مشاوره آنلاین"}
                </DrawerTitle>
                <DrawerDescription className="text-center text-muted-foreground dark:text-textSecondary mt-1">
                  {businessConsultingData.onlineDescription ||
                    "برای دریافت مشاوره آنلاین از طریق تلگرام پیام دهید:"}
                </DrawerDescription>
              </DrawerHeader>
              <div className="text-center mt-4 space-y-3">
                <p className="text-xl font-semibold text-primary tracking-tight">
                  {businessConsultingData.telegramId || "@BusinessSupport"}
                </p>
                <Link
                  href={
                    businessConsultingData.telegramLink ||
                    "https://t.me/BusinessSupport"
                  }
                  target="_blank"
                  className="inline-block px-6 py-2 bg-primary hover:bg-primary text-primary-foreground rounded-md font-medium transition"
                >
                  پیام در تلگرام
                </Link>
              </div>
              <DrawerFooter>
                <DrawerClose className="block mt-6 text-sm text-muted-foreground dark:text-textSecondary hover:text-muted-foreground dark:hover:text-textSecondary underline text-center">
                  <XIcon className="inline-block" />
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          {/* 🎓 دوره‌ها */}
          <Drawer>
            <DrawerTrigger asChild>
              <button className="group relative flex w-full items-center justify-center gap-2 rounded-full border border-border/60 bg-card/90 px-6 py-3 font-bold !text-[#112b3a] shadow-xl transition-all hover:-translate-y-0.5 hover:bg-premium sm:w-auto">
                <GraduationCap className="h-5 w-5 text-premium transition-transform group-hover:scale-110" />
                دوره‌ها
              </button>
            </DrawerTrigger>
            <DrawerContent className="p-6 rounded-t-2xl border-t bg-card dark:bg-cardBg shadow-2xl">
              <DrawerHeader className="text-center">
                <div className="flex justify-center">
                  <GraduationCap className="text-premium h-10 w-10" />
                </div>
                <DrawerTitle className="text-2xl font-bold text-foreground dark:text-textPrimary mt-2">
                  {businessConsultingData.coursesTitle || "دوره‌های آموزشی"}
                </DrawerTitle>
                <DrawerDescription className="text-center text-muted-foreground dark:text-textSecondary mt-1">
                  {businessConsultingData.coursesDescription ||
                    "برای مشاهده دوره‌های ما کلیک کنید:"}
                </DrawerDescription>
              </DrawerHeader>
              <div className="text-center mt-4 space-y-3">
                <Link
                  href={businessConsultingData.coursesLink || "/courses"}
                  className="inline-block px-6 py-2 bg-premium hover:bg-premium text-primary-foreground rounded-md font-medium transition"
                >
                  مشاهده دوره‌ها
                </Link>
              </div>
              <DrawerFooter>
                <DrawerClose className="block mt-6 text-sm text-muted-foreground dark:text-textSecondary hover:text-muted-foreground dark:hover:text-textSecondary underline text-center">
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

export default BusinessLanding;
