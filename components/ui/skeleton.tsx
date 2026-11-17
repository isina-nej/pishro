import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn("rounded-xl bg-muted/70 motion-safe:animate-pulse", className)}
      {...props}
    />
  );
}

export { Skeleton };
