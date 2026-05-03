import * as React from "react";
import { cn } from "@/lib/utils";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface AlertDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="alert"
      className={cn("rounded-md border px-4 py-3 bg-muted text-muted-foreground", className)}
      {...props}
    />
  );
});
Alert.displayName = "Alert";

const AlertDescription = React.forwardRef<HTMLDivElement, AlertDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
    );
  }
);
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertDescription };
