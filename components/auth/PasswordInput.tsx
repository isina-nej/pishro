"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Lock, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export const PasswordInput = ({
  id,
  label,
  placeholder,
  error,
  ...props
}: React.ComponentProps<typeof Input> & { label: string; error?: string }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="mt-5">
      <label htmlFor={id} className="block text-xs font-bold mb-4">
        {label}
      </label>
      <div className="relative">
        <Input
          id={id}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          className={cn(
            "mt-1 pr-10 pl-8 block w-full rounded-none border-0 border-b border-black focus-visible:ring-0 focus-visible:bg-gray-100",
            error && "border-red-500"
          )}
          {...props}
        />
        <Lock
          className={cn(
            "absolute bottom-2 right-2 size-5",
            error && "text-red-500"
          )}
        />
        {show ? (
          <Eye
            onClick={() => setShow(false)}
            className="absolute bottom-2 left-2 size-5 cursor-pointer"
          />
        ) : (
          <EyeOff
            onClick={() => setShow(true)}
            className="absolute bottom-2 left-2 size-5 cursor-pointer"
          />
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};
