'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type CursorKind =
  | 'default'
  | 'link'
  | 'button'
  | 'text'
  | 'cart'
  | 'chat'
  | 'premium'
  | 'view';

function resolveKind(target: EventTarget | null): CursorKind {
  if (!(target instanceof Element)) return 'default';

  const explicit = target.closest<HTMLElement>('[data-cursor]');
  if (explicit) {
    const value = (explicit.getAttribute('data-cursor') || '').trim();
    if (
      value === 'link' ||
      value === 'button' ||
      value === 'text' ||
      value === 'cart' ||
      value === 'chat' ||
      value === 'premium' ||
      value === 'view' ||
      value === 'default'
    ) {
      return value;
    }
  }

  if (
    target.closest(
      'input:not([type="button"]):not([type="submit"]):not([type="checkbox"]):not([type="radio"]),textarea,[contenteditable="true"]'
    )
  ) {
    return 'text';
  }

  const interactive = target.closest<HTMLElement>(
    'a[href],button,[role="button"],summary,label,[data-sound-role]'
  );
  if (!interactive) return 'default';

  const href = (interactive.getAttribute('href') || '').toLowerCase();
  const role = interactive.getAttribute('data-sound-role') || '';
  const label = (
    interactive.getAttribute('aria-label') ||
    interactive.textContent ||
    ''
  ).toLowerCase();

  if (role === 'cart' || href.includes('/checkout') || label.includes('سبد')) {
    return 'cart';
  }
  if (role === 'chat' || interactive.closest('[data-chat-fab]')) return 'chat';
  if (
    role === 'premium' ||
    href.includes('/investment-plans') ||
    label.includes('سرمایه‌گذاری')
  ) {
    return 'premium';
  }
  if (interactive.tagName === 'A') {
    if (label.includes('مشاهده') || label.includes('جزئیات')) return 'view';
    return 'link';
  }
  return 'button';
}

/**
 * نشانه‌گر مینیمال دسکتاپ با حالت‌های ویژه برای اکشن‌های خاص.
 * روی لمسی و prefers-reduced-motion خاموش است.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100, rx: -100, ry: -100 });
  const kindRef = useRef<CursorKind>('default');
  const rafRef = useRef(0);
  const [enabled, setEnabled] = useState(false);
  const [kind, setKind] = useState<CursorKind>('default');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine) and (hover: hover)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

    const sync = () => {
      const on = mq.matches && !reduce.matches;
      setEnabled(on);
      document.documentElement.classList.toggle('has-custom-cursor', on);
    };
    sync();
    mq.addEventListener('change', sync);
    reduce.addEventListener('change', sync);
    return () => {
      mq.removeEventListener('change', sync);
      reduce.removeEventListener('change', sync);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (event: PointerEvent) => {
      pos.current.x = event.clientX;
      pos.current.y = event.clientY;
      setVisible(true);
      const next = resolveKind(event.target);
      if (next !== kindRef.current) {
        kindRef.current = next;
        setKind(next);
      }
    };
    const onDown = () => document.documentElement.classList.add('cursor-pressed');
    const onUp = () => document.documentElement.classList.remove('cursor-pressed');
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const tick = () => {
      pos.current.rx += (pos.current.x - pos.current.rx) * 0.2;
      pos.current.ry += (pos.current.y - pos.current.ry) * 0.2;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${pos.current.rx}px, ${pos.current.ry}px, 0) translate(-50%, -50%)`;
      }
      rafRef.current = window.requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafRef.current);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.documentElement.classList.remove('cursor-pressed');
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className={cn('site-cursor', !visible && 'is-hidden')} aria-hidden>
      <div ref={ringRef} className={cn('site-cursor-ring', `is-${kind}`)} />
      <div ref={dotRef} className={cn('site-cursor-dot', `is-${kind}`)} />
    </div>
  );
}
