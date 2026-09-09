'use client';

import React from 'react';

const SHORTCODE_RE = /:animated-emoji:(https:\/\/[^:\s]+|\/[^:\s]+):/g;

function isSafeEmojiSrc(src: string): boolean {
  return (
    src.startsWith('https://saeedtahmtan.github.io/telemoji/') ||
    src.startsWith('/animated-emoji/')
  );
}

/**
 * رندر متن حاوی شورت‌کد ایموجی متحرک به‌صورت تصویر inline.
 * ورودی نامعتبر/ناشناس به‌صورت متن ساده باقی می‌ماند (امن در برابر XSS).
 */
export function renderWithAnimatedEmoji(
  text: string | null | undefined,
  imgClassName = 'inline-block h-[1.25em] w-[1.25em] object-contain align-[-0.25em]',
): React.ReactNode {
  if (!text) return text ?? null;
  const parts: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  SHORTCODE_RE.lastIndex = 0;
  let key = 0;
  while ((m = SHORTCODE_RE.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const src = m[1];
    if (isSafeEmojiSrc(src)) {
      // eslint-disable-next-line @next/next/no-img-element
      parts.push(<img key={`ae-${key++}`} src={src} alt="" aria-hidden className={imgClassName} loading="lazy" />);
    } else {
      parts.push(m[0]);
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

/** نسخه متنی (برای alt، جستجو، شمارش کاراکتر): شورت‌کدها حذف می‌شوند. */
export function stripAnimatedEmojiShortcodes(text: string | null | undefined): string {
  if (!text) return '';
  return text.replace(SHORTCODE_RE, '').trim();
}
