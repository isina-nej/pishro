"use client";

import { cn } from "@/lib/utils";

const Logo = () => {
  return (
    <div
      className={cn(
        "h-8 w-[90px] flex items-center justify-center gap-1",
        "p-1 -mb-1 ltr",
        "text-gray-800 text-sm font-semibold tracking-tight",
        "hover:text-gray-900",
        "transition-all duration-200 ease-in-out"
      )}
    >
      <div className="uppercase font-bold">
        <span className="text-red-600">p</span>
        ishro
      </div>
      <div className="text-sm font-medium text-gray-600">
        <span className="text-red-600">Gp</span>
      </div>
    </div>
  );
};

export default Logo;
