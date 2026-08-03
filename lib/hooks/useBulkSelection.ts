/**
 * وضعیت انتخاب گروهی برای صفحه‌های لیست ادمین.
 *
 * هر صفحه فقط این هوک را صدا می‌زند و خروجی‌اش را به DataTable و BulkActionBar
 * می‌دهد — منطق پاک‌کردن انتخاب و تازه‌سازی داده بعد از عملیات یک‌جا می‌ماند
 * به‌جای آنکه در ده صفحه کپی شود.
 */

import { useCallback, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export function useBulkSelection(invalidateKey: readonly unknown[]) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const queryClient = useQueryClient();

  // آرایه‌ی کلید معمولاً inline ساخته می‌شود و هر رندر هویت جدیدی دارد؛
  // سریالایز کردنش جلوی ساخته‌شدن دوباره‌ی callback در هر رندر را می‌گیرد.
  const keySignature = JSON.stringify(invalidateKey);

  const stableKey = useMemo(
    () => JSON.parse(keySignature) as unknown[],
    [keySignature]
  );

  const clear = useCallback(() => setSelectedIds([]), []);

  const onDone = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: stableKey });
  }, [queryClient, stableKey]);

  return { selectedIds, setSelectedIds, clear, onDone };
}
