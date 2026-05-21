"use client";

import React, { useState, useEffect } from "react";
import { useLoading } from "@/lib/contexts/LoadingContext";

export const LoadingBar = () => {
  const { isLoading } = useLoading();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setProgress(10);
      const timer1 = setTimeout(() => setProgress(40), 100);
      const timer2 = setTimeout(() => setProgress(75), 500);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      setProgress(100);
      const timer = setTimeout(() => setProgress(0), 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <div
      className={`fixed top-0 left-0 h-1 bg-gradient-to-r from-mySecondary via-myPrimary to-mySecondary transition-all duration-500 z-[9999] ${
        progress === 0 ? "opacity-0" : "opacity-100"
      }`}
      style={{
        width: `${progress}%`,
      }}
    />
  );
};
