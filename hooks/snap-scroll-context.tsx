"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type SnapContextType = {
  activeId: string | null;
  isAnimating: boolean;
  setActiveId: (id: string | null) => void;
  setIsAnimating: (value: boolean) => void;
};

const SnapContext = createContext<SnapContextType | null>(null);

export const SnapScrollProvider = ({ children }: { children: ReactNode }) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <SnapContext.Provider
      value={{ activeId, setActiveId, isAnimating, setIsAnimating }}
    >
      {children}
    </SnapContext.Provider>
  );
};

export const useSnapScroll = () => {
  const ctx = useContext(SnapContext);
  if (!ctx)
    throw new Error("useSnapScroll must be used within SnapScrollProvider");
  return ctx;
};
