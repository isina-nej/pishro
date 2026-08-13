'use client';

import { useEffect } from 'react';

/**
 * ناوبری کلاینتی Next بعد از دیپلوی (و گاهی وسط سشن) Application error می‌دهد.
 * همه لینک‌های داخلی را full-page می‌کند تا چانک قدیمی/خرابی soft-nav نماند.
 */
export default function HardNavigationGuard() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest('a[href]');
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.hasAttribute('download')) return;
      if (anchor.target && anchor.target !== '_self') return;
      if (anchor.dataset.softNav === 'true') return;

      const hrefAttr = anchor.getAttribute('href');
      if (!hrefAttr || hrefAttr.startsWith('#')) return;
      if (
        hrefAttr.startsWith('mailto:') ||
        hrefAttr.startsWith('tel:') ||
        hrefAttr.startsWith('javascript:')
      ) {
        return;
      }

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) return;
      if (url.pathname.startsWith('/admin')) return;

      // همان مسیر + همان کوئری → نادیده
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      window.location.assign(url.href);
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}
