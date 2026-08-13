'use client';

import InteractionSounds from '@/components/sound/InteractionSounds';
import CustomCursor from '@/components/cursor/CustomCursor';
import RouteProgressBar from '@/components/navigation/RouteProgressBar';

/**
 * جلوه‌های سراسری UI — روی همهٔ مسیرها (عمومی، پروفایل، ادمین).
 * فقط یک نوار پیشرفت نازک برای ناوبری؛ بدون لودینگ تمام‌صفحهٔ تو در تو.
 */
export default function GlobalUiEffects() {
  return (
    <>
      <RouteProgressBar />
      <InteractionSounds />
      <CustomCursor />
    </>
  );
}
