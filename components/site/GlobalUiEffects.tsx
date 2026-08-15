'use client';

import InteractionSounds from '@/components/sound/InteractionSounds';
import RouteProgressBar from '@/components/navigation/RouteProgressBar';

/**
 * جلوه‌های سراسری UI — روی همهٔ مسیرها (عمومی، پروفایل، ادمین).
 * نشانگر موس سیستمی است؛ فقط نوار پیشرفت نازک و صداهای کلیک.
 */
export default function GlobalUiEffects() {
  return (
    <>
      <RouteProgressBar />
      <InteractionSounds />
    </>
  );
}
