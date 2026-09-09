'use client';

import React, { forwardRef, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import AnimatedEmojiPicker from './AnimatedEmojiPicker';
import { shortcodeForEmoji } from './EmojiTextInput';
import { cn } from '@/lib/utils';

interface EmojiTextareaProps extends React.ComponentProps<'textarea'> {
  onEmojiChange?: (nextValue: string) => void;
}

/** تکست‌ارئا با دکمه ایموجی متحرک (درج در نقطه کرزر). */
const EmojiTextarea = forwardRef<HTMLTextAreaElement, EmojiTextareaProps>(function EmojiTextarea(
  { onChange, onEmojiChange, className, disabled, ...props },
  ref,
) {
  const innerRef = useRef<HTMLTextAreaElement>(null);

  const insertAtCursor = (snippet: string) => {
    const el = innerRef.current;
    const current = el?.value ?? String(props.value ?? '');
    const start = el?.selectionStart ?? current.length;
    const end = el?.selectionEnd ?? current.length;
    const next = current.slice(0, start) + snippet + current.slice(end);
    if (el) {
      const nativeSetter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set;
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
      <Textarea
        ref={(node) => {
          innerRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
        }}
        onChange={onChange}
        disabled={disabled}
        className={cn('pb-10', className)}
        {...props}
      />
      <div className="absolute bottom-2 left-2">
        <AnimatedEmojiPicker
          disabled={disabled}
          align="start"
          onPick={(it, mode) => insertAtCursor(mode === 'char' && it.char ? it.char : shortcodeForEmoji(it))}
        />
      </div>
    </div>
  );
});

export default EmojiTextarea;
