import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "secondary" | "destructive" | "success" | "premium";
}

const variantMap: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: "bg-primary text-white px-2 py-0.5 rounded-full text-xs font-medium",
  outline: "border border-input text-sm px-2 py-0.5 rounded-full",
  secondary: "bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full",
  destructive: "bg-destructive text-destructive-foreground px-2 py-0.5 rounded-full",
  success: "bg-success text-success-foreground px-2 py-0.5 rounded-full text-xs font-medium",
  premium: "bg-premium text-premium-foreground px-2 py-0.5 rounded-full text-xs font-medium",
};

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(variantMap[variant], className)}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge };
