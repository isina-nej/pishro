'use client';

import React, { forwardRef, useRef } from 'react';
import { Input } from '@/components/ui/input';
import AnimatedEmojiPicker from './AnimatedEmojiPicker';
import type { AnimatedEmojiItem } from '@/lib/admin/animated-emoji-packs';
import { cn } from '@/lib/utils';

interface EmojiTextInputProps extends React.ComponentProps<'input'> {
  onEmojiChange?: (nextValue: string) => void;
}

/**
 * ورودی تک‌خطی با دکمه ایموجی متحرک.
 * ایموجی متحرک به‌صورت :تصویر: URL در متن ذخیره می‌شود (سازگار با دیتابیس و جستجو).
 */
export function shortcodeForEmoji(it: AnimatedEmojiItem): string {
  return `:animated-emoji:${it.src}:`;
}

const EmojiTextInput = forwardRef<HTMLInputElement, EmojiTextInputProps>(function EmojiTextInput(
  { onChange, onEmojiChange, className, disabled, ...props },
  ref,
) {
  const innerRef = useRef<HTMLInputElement>(null);

  const insertAtCursor = (snippet: string) => {
    const el = (innerRef.current ?? null) as HTMLInputElement | null;
    const current = el?.value ?? String(props.value ?? '');
    const start = el?.selectionStart ?? current.length;
    const end = el?.selectionEnd ?? current.length;
    const next = current.slice(0, start) + snippet + current.slice(end);
    if (el) {
      const nativeSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
      nativeSetter?.call(el, next);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      requestAnimationFrame(() => {
        el.focus();
        const pos = start + snippet.length;
        el.setSelectionRange(pos, pos);
      });
    }
    onEmojiChange?.(next);
  };

  return (
    <div className="relative">
      <Input
        ref={(node) => {
          innerRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
        }}
        onChange={onChange}
        disabled={disabled}
        className={cn('pl-10', className)}
        {...props}
      />
      <div className="absolute left-1 top-1/2 -translate-y-1/2">
        <AnimatedEmojiPicker
          disabled={disabled}
          align="start"
          onPick={(it, mode) => insertAtCursor(mode === 'char' && it.char ? it.char : shortcodeForEmoji(it))}
        />
      </div>
    </div>
  );
});

export default EmojiTextInput;
