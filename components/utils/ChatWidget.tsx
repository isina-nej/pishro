"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { IoChatbubblesOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const topics = [
  "دوره های آموزشی",
  "سبد های سرمایه گذاری",
  "کریپتو",
  "بورس",
  "متاورس",
  "NFT",
  "ایردراپ",
  "مشاوره کسب و کار",
];

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  const handleBack = () => {
    setSelectedTopic(null);
  };

  // بستن کارت با کلیک بیرونش
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        chatRef.current &&
        !chatRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatRef}
            key="chat-panel"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-[16px] left-4 w-80 h-[90%] bg-white shadow-lg rounded-lg flex flex-col z-50"
          >
            {/* هدر */}
            <div className="flex items-center justify-between bg-[#173046] text-white p-4 py-2 rounded-t-lg">
              <span className="font-bold">پشتیبانی آنلاین</span>
              <Button
                variant="outline"
                className="bg-transparent hover:bg-transparent hover:scale-105 hover:text-white group"
                onClick={toggleChat}
              >
                <X className="size-5 group-hover:rotate-180 transition-all" />
              </Button>
            </div>

            {/* محتوا */}
            <div className="flex-1 p-4 overflow-y-auto">
              {selectedTopic ? (
                <div className="h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b pb-2">
                    <p className="text-gray-600 text-sm">
                      موضوع انتخابی:{" "}
                      <span className="text-gray-900">{selectedTopic}</span>
                    </p>
                    <Button
                      variant="link"
                      className="text-red-600"
                      size="sm"
                      onClick={handleBack}
                    >
                      برگشت
                    </Button>
                  </div>
                  <div>
                    <Input
                      placeholder={`پیام خود را درباره ${selectedTopic} بنویسید...`}
                    />
                    <Button className="mt-2 w-full bg-[#173046]">ارسال</Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <p className="text-gray-600 mb-4">سوال شما در چه موردیه؟</p>
                  {topics.map((topic, index) => (
                    <button
                      key={index}
                      className="rtl text-white bg-[#173046] hover:bg-[#173046]/95 py-1.5 px-4 text-sm font-normal rounded-md"
                      onClick={() => setSelectedTopic(topic)}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* دکمه باز کردن چت */}
      <Button
        onClick={toggleChat}
        className="fixed bottom-4 left-4 bg-[#173046] text-white rounded-full size-16 p-4 shadow-lg hover:bg-[#173046]/95 z-40 flex justify-center items-center"
      >
        <IoChatbubblesOutline style={{ width: "40px", height: "40px" }} />
      </Button>
    </>
  );
};

export default ChatWidget;
