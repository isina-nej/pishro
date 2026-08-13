'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useSound } from '@/components/sound/SoundProvider';
import { isSoundId, type SoundId } from '@/lib/sound/types';

function resolveClickSound(target: EventTarget | null): SoundId | null {
  if (!(target instanceof Element)) return null;

  const explicit = target.closest<HTMLElement>('[data-sound]');
  if (explicit) {
    const value = explicit.getAttribute('data-sound')?.trim() || '';
    if (value === 'off' || value === 'none') return null;
    if (isSoundId(value)) return value;
  }

  const interactive = target.closest<HTMLElement>(
    'a[href],button,[role="button"],summary,input[type="submit"],input[type="button"],input[type="checkbox"],input[type="radio"]'
  );
  if (!interactive) return null;
  if (interactive.closest('[data-sound="off"],[data-sound="none"]')) return null;
  if (
    interactive instanceof HTMLButtonElement ||
    interactive instanceof HTMLInputElement
  ) {
    if (interactive.disabled) return null;
  }

  const href = (interactive.getAttribute('href') || '').toLowerCase();
  const label = (
    interactive.getAttribute('aria-label') ||
    interactive.textContent ||
    ''
  ).toLowerCase();

  if (
    href.includes('/checkout') ||
    href.includes('cart') ||
    label.includes('سبد') ||
    interactive.closest('[data-sound-role="cart"]')
  ) {
    return 'cart';
  }

  if (
    href.includes('/investment-plans') ||
    label.includes('سرمایه‌گذاری') ||
    interactive.closest('[data-sound-role="premium"]')
  ) {
    return 'premium';
  }

  if (
    href.includes('/login') ||
    href.includes('/profile') ||
    href.includes('/register') ||
    label.includes('ورود') ||
    label.includes('ثبت‌نام') ||
    interactive.closest('[data-sound-role="auth"]')
  ) {
    return 'auth';
  }

  if (href.includes('/crypto-prices') || interactive.closest('[data-sound-role="market"]')) {
    return 'market';
  }

  if (interactive.closest('[data-sound-role="chat"],[data-chat-fab]')) {
    return 'chat';
  }

  if (
    interactive.getAttribute('role') === 'switch' ||
    interactive.getAttribute('aria-pressed') != null ||
    interactive.closest('[data-sound-role="toggle"]')
  ) {
    return 'toggle';
  }

  if (interactive.tagName === 'A') return 'click';
  return 'ui';
}

/**
 * صدای کلیک سراسری + صدای جابه‌جایی مسیر.
 */
export default function InteractionSounds() {
  const pathname = usePathname();
  const { play } = useSound();
  const lastSpecialAt = useRef(0);
  const firstPath = useRef(true);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      const sound = resolveClickSound(event.target);
      if (!sound) return;
      if (sound !== 'click' && sound !== 'ui') {
        lastSpecialAt.current = Date.now();
      }
      play(sound);
    };

    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, [play]);

  useEffect(() => {
    if (firstPath.current) {
      firstPath.current = false;
      return;
    }
    // اگر همین الان صدای خاص (سبد/پرمیوم/…) پخش شده، navigate را دوبل نکن
    if (Date.now() - lastSpecialAt.current < 280) return;
    play('navigate');
  }, [pathname, play]);

  return null;
}
