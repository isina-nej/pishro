"use client";

import { useEffect } from "react";
import { useScrollStore } from "@/stores/scroll-store";

const ScrollStatus = () => {
  const { activeSection, targetSection, isScrolling } = useScrollStore();

  // 🧠 لاگ تغییرات در کنسول
  useEffect(() => {
    console.log("📍 Active section changed:", activeSection);
  }, [activeSection]);

  useEffect(() => {
    console.log("🎯 Target section changed:", targetSection);
  }, [targetSection]);

  useEffect(() => {
    console.log("🌀 Scrolling state:", isScrolling ? "Started" : "Stopped");
  }, [isScrolling]);

  return (
    <div className="fixed bottom-20 left-20 bg-black/75 text-white text-3xl p-6 rounded-md z-50 flex flex-col gap-8 ltr">
      <p>
        📍 <span className="text-gray-400 dark:text-textSecondary">Active: </span>
        {activeSection ?? "None"}
      </p>
      <p>
        🎯 <span className="text-gray-400 dark:text-textSecondary">Target: </span>
        {targetSection ?? "None"}
      </p>
      <p>
        🌀 <span className="text-gray-400 dark:text-textSecondary">Scrolling: </span>
        {isScrolling ? "Yes" : "No"}
      </p>
    </div>
  );
};

export default ScrollStatus;
