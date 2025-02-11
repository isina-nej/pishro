"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react"; // آیکون بستن از lucide-react
import { IoChatbubblesOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button"; // مسیر مناسب کامپوننت Button shadcn
import { Input } from "@/components/ui/input"; // مسیر مناسب کامپوننت Input shadcn

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      {/* پنل چت با انیمیشن */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 right-4 w-80 h-96 bg-white shadow-lg rounded-lg flex flex-col z-50"
          >
            {/* سرآیند پنل */}
            <div className="flex items-center justify-between bg-blue-600 text-white p-4 rounded-t-lg">
              <span className="font-bold">پشتیبانی آنلاین</span>
              <Button variant="ghost" onClick={toggleChat}>
                <X size={20} />
              </Button>
            </div>
            {/* بدنه چت */}
            <div className="flex-1 p-4 overflow-y-auto">
              {/* پیام‌های نمونه – در اینجا می‌توانید لیست پیام‌ها را رندر کنید */}
              <p className="text-gray-600">
                سلام! چگونه می‌توانم به شما کمک کنم؟
              </p>
            </div>
            {/* فوتر پنل برای ارسال پیام */}
            <div className="p-4 border-t">
              <Input placeholder="پیام خود را بنویسید..." className="w-full" />
              <Button
                className="mt-2 w-full"
                onClick={() => {
                  /* منطق ارسال پیام */
                }}
              >
                ارسال
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* دکمه چت آنلاین ثابت در گوشه پایین صفحه */}
      <Button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 z-50"
      >
        چت آنلاین
        <IoChatbubblesOutline style={{ width: "20px", height: "20px" }} />
      </Button>
    </>
  );
};

export default ChatWidget;
