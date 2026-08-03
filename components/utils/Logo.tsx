"use client";

import { cn } from "@/lib/utils";

const Logo = () => {
  return (
    <div
      className={cn(
        "w-[90px] flex flex-col items-start justify-center",
        "p-1 -mb-1 ltr",
        "text-foreground dark:text-textPrimary text-sm font-semibold tracking-tight",
        "hover:text-foreground dark:text-textPrimary",
        "transition-all duration-200 ease-in-out"
      )}
    >
      <div className="uppercase font-bold">
        <span className="text-destructive">p</span>
        ishro
      </div>
      <div className="text-sm font-medium text-muted-foreground dark:text-textSecondary">
        <span className="text-destructive">F</span>inancial{""}
        <span className="text-destructive">Gp</span>
      </div>
    </div>
  );
};

export default Logo;
