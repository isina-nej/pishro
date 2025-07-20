"use client";

import { cn } from "@/lib/utils";

const Logo = () => {
  return (
    <div
      className={cn(
        "w-[90px] flex flex-col items-start justify-center ",
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
      <div className="text-sm font-medium text-gray-500">
        <span className="text-red-600">F</span>inancial{" "}
        <span className="text-red-600">Gp</span>
      </div>
    </div>
  );
};

export default Logo;
