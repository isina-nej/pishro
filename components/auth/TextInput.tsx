"use client";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const TextInput = ({
  id,
  label,
  placeholder,
  error,
  icon,
  ...props
}: React.ComponentProps<typeof Input> & {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}) => (
  <div className="mt-5">
    <label htmlFor={id} className="block text-xs font-bold mb-4">
      {label}
    </label>
    <div className="relative">
      <Input
        id={id}
        placeholder={placeholder}
        className={cn(
          "mt-1 pr-10 block w-full rounded-none border-0 border-b border-black focus-visible:ring-0 focus-visible:bg-gray-100",
          error && "border-red-500"
        )}
        {...props}
      />
      {icon && <div className="absolute bottom-2 right-2">{icon}</div>}
    </div>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);
