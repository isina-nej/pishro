"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  startLoading: () => void;
  stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsLoading(true);

    // Listen to router events
    window.addEventListener("popstate", handleStart);

    // Use a MutationObserver to detect route changes
    let currentPath = window.location.pathname;
    const observer = new MutationObserver(() => {
      if (window.location.pathname !== currentPath) {
        currentPath = window.location.pathname;
        setIsLoading(true);
        // Auto-hide after 2 seconds if not already hidden
        const timer = setTimeout(() => setIsLoading(false), 2000);
        return () => clearTimeout(timer);
      }
    });

    return () => {
      window.removeEventListener("popstate", handleStart);
      observer.disconnect();
    };
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading, startLoading: () => setIsLoading(true), stopLoading: () => setIsLoading(false) }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return context;
};
