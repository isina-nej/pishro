"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { normalizeHex } from "@/lib/theme/custom-palette";
import { cn } from "@/lib/utils";

type ColorFieldProps = {
  label: string;
  hint?: string;
  value: string;
  onChange: (hex: string) => void;
};

/**
 * Hex text input + native graphical color picker (mouse / touch).
 */
export default function ColorField({
  label,
  hint,
  value,
  onChange,
}: ColorFieldProps) {
  const normalized = normalizeHex(value) ?? "#000000";
  const [text, setText] = useState(normalized);

  useEffect(() => {
    setText(normalized);
  }, [normalized]);

  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold">{label}</Label>
      {hint && (
        <p className="text-[11px] leading-5 text-muted-foreground">{hint}</p>
      )}
      <div className="flex items-center gap-2">
        <label
          className={cn(
            "relative h-10 w-12 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-border shadow-sm",
            "ring-offset-background focus-within:ring-2 focus-within:ring-ring"
          )}
          title="انتخاب گرافیکی رنگ"
        >
          <span
            className="absolute inset-0"
            style={{ backgroundColor: normalized }}
          />
          <input
            type="color"
            value={normalized}
            onChange={(e) => {
              const next = normalizeHex(e.target.value) ?? normalized;
              setText(next);
              onChange(next);
            }}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            aria-label={`انتخاب رنگ ${label}`}
          />
        </label>
        <Input
          value={text}
          onChange={(e) => {
            const raw = e.target.value;
            setText(raw);
            const next = normalizeHex(raw);
            if (next) onChange(next);
          }}
          onBlur={() => {
            const next = normalizeHex(text);
            if (next) {
              setText(next);
              onChange(next);
            } else {
              setText(normalized);
            }
          }}
          spellCheck={false}
          dir="ltr"
          className="font-mono text-sm uppercase"
          placeholder="#0C3F32"
        />
      </div>
    </div>
  );
}
