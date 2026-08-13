'use client';

import InteractionSounds from '@/components/sound/InteractionSounds';
import CustomCursor from '@/components/cursor/CustomCursor';

/**
 * جلوه‌های سراسری UI — روی همهٔ مسیرها (عمومی، پروفایل، ادمین).
 */
export default function GlobalUiEffects() {
  return (
    <>
      <InteractionSounds />
      <CustomCursor />
    </>
  );
}
