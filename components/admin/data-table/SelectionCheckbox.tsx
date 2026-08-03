'use client';

import { Checkbox } from '@/components/ui/checkbox';

interface SelectionCheckboxProps {
  id: string;
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  label?: string;
  className?: string;
}

/**
 * انتخاب یک رکورد، برای صفحه‌هایی که به‌جای جدول از گرید کارت استفاده می‌کنند.
 *
 * DataTable ستون انتخاب خودش را دارد، ولی نیمی از صفحه‌های ادمین عمداً کارت
 * نشان می‌دهند (اخبار، صندوق‌ها، بخش‌بندی مشتریان). تبدیلشان به جدول فقط برای
 * داشتن چک‌باکس، طراحی را خراب می‌کرد — این کامپوننت همان وضعیت انتخاب را
 * بدون تغییر ظاهر فراهم می‌کند و خروجی‌اش مستقیم به BulkActionBar می‌رود.
 */
export function SelectionCheckbox({
  id,
  selectedIds,
  onChange,
  label = 'انتخاب',
  className,
}: SelectionCheckboxProps) {
  const checked = selectedIds.includes(id);

  return (
    <Checkbox
      checked={checked}
      onCheckedChange={(value) =>
        onChange(
          value ? [...selectedIds, id] : selectedIds.filter((s) => s !== id)
        )
      }
      aria-label={label}
      className={className}
      // بعضی کارت‌ها داخل <Link> هستند؛ بدون preventDefault، تیک‌زدن باعث
      // ناوبری به صفحه‌ی جزئیات می‌شود و انتخاب از دست می‌رود.
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    />
  );
}

interface SelectAllProps {
  ids: string[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

/** «انتخاب همه» برای گریدها — همه‌ی شناسه‌های صفحه‌ی جاری */
export function SelectAllCheckbox({ ids, selectedIds, onChange }: SelectAllProps) {
  const allSelected = ids.length > 0 && ids.every((id) => selectedIds.includes(id));
  const someSelected = !allSelected && ids.some((id) => selectedIds.includes(id));

  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
      <Checkbox
        checked={allSelected || (someSelected && 'indeterminate')}
        onCheckedChange={(value) => onChange(value ? ids : [])}
        aria-label="انتخاب همه"
      />
      انتخاب همه
    </label>
  );
}

export default SelectionCheckbox;
