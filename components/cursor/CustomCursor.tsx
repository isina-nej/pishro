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
      'input:not([type="button"]):not([type="submit"]):not([type="checkbox"]):not([type="radio"]),textarea,select,[contenteditable="true"]'
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
 * نشانه‌گر دسکتاپ با کنتراست بالا.
 * روی لمسی خاموش است؛ با reduced-motion فقط نرم‌دنبال‌کردن حذف می‌شود.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0, rx: 0, ry: 0 });
  const kindRef = useRef<CursorKind>('default');
  const rafRef = useRef(0);
  const reduceMotionRef = useRef(false);
  const armedRef = useRef(false);
  const [enabled, setEnabled] = useState(false);
  const [kind, setKind] = useState<CursorKind>('default');
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine) and (hover: hover)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

    const sync = () => {
      const on = mq.matches;
      reduceMotionRef.current = reduce.matches;
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
      document.documentElement.classList.remove('cursor-pressed');
      document.documentElement.classList.remove('cursor-ready');
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const arm = (x: number, y: number) => {
      if (armedRef.current) return;
      armedRef.current = true;
      pos.current.rx = x;
      pos.current.ry = y;
      setArmed(true);
      document.documentElement.classList.add('cursor-ready');
    };

    const disarm = () => {
      if (!armedRef.current) return;
      armedRef.current = false;
      setArmed(false);
      document.documentElement.classList.remove('cursor-ready');
      document.documentElement.classList.remove('cursor-pressed');
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== 'mouse') return;
      pos.current.x = event.clientX;
      pos.current.y = event.clientY;
      arm(event.clientX, event.clientY);
      const next = resolveKind(event.target);
      if (next !== kindRef.current) {
        kindRef.current = next;
        setKind(next);
      }
    };

    const onDown = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== 'mouse') return;
      document.documentElement.classList.add('cursor-pressed');
    };
    const onUp = () => document.documentElement.classList.remove('cursor-pressed');

    const onLeaveWindow = (event: MouseEvent) => {
      // فقط خروج واقعی از سند
      if (event.relatedTarget === null) disarm();
    };

    const onVis = () => {
      if (document.visibilityState === 'hidden') disarm();
    };

    const tick = () => {
      const ease = reduceMotionRef.current ? 1 : 0.4;
      pos.current.rx += (pos.current.x - pos.current.rx) * ease;
      pos.current.ry += (pos.current.y - pos.current.ry) * ease;
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
    window.addEventListener('pointercancel', onUp, { passive: true });
    document.addEventListener('mouseleave', onLeaveWindow);
    document.addEventListener('visibilitychange', onVis);
    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafRef.current);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      document.removeEventListener('mouseleave', onLeaveWindow);
      document.removeEventListener('visibilitychange', onVis);
      document.documentElement.classList.remove('cursor-pressed');
      document.documentElement.classList.remove('cursor-ready');
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className={cn('site-cursor', armed && 'is-active')} aria-hidden>
      <div ref={ringRef} className={cn('site-cursor-ring', `is-${kind}`)} />
      <div ref={dotRef} className={cn('site-cursor-dot', `is-${kind}`)} />
    </div>
  );
}
