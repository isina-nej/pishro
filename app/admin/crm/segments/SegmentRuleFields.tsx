'use client';

import type { UseFormReturn } from 'react-hook-form';
import DateObject from 'react-date-object';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { JalaliDatePicker } from '@/components/ui/jalali-date-picker';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useCrmTags } from '@/lib/hooks/useCrmCustomer';
import type { CreateCustomerSegmentInput } from '@/lib/schemas/crm-segment-schema';

interface SegmentRuleFieldsProps {
  form: UseFormReturn<CreateCustomerSegmentInput>;
}

function isoToDateObject(iso?: string | null): DateObject | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return new DateObject({ date, calendar: persian, locale: persian_fa });
}

function dateObjectToIso(date: DateObject | null): string | null {
  if (!date) return null;
  return date.toDate().toISOString();
}

/**
 * Shared rule-builder fields for CustomerSegment.rules, reused by the
 * create dialog (segments list page) and the edit form (segment detail
 * page) so the two stay in sync with lib/schemas/crm-segment-schema.ts.
 */
export default function SegmentRuleFields({ form }: SegmentRuleFieldsProps) {
  const { data: tags, isLoading: isTagsLoading } = useCrmTags();
  const selectedTagIds = form.watch('rules.tagIds') ?? [];

  const toggleTag = (tagId: string, checked: boolean) => {
    const next = checked
      ? [...selectedTagIds, tagId]
      : selectedTagIds.filter((id) => id !== tagId);
    form.setValue('rules.tagIds', next, { shouldDirty: true });
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>نام سگمنت</FormLabel>
            <FormControl>
              <Input placeholder="مثلا مشتریان VIP" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>توضیحات</FormLabel>
            <FormControl>
              <Textarea rows={2} {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="rules.minSpend"
          render={({ field }) => (
            <FormItem>
              <FormLabel>حداقل مجموع خرید موفق (تومان)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  value={field.value ?? ''}
                  onChange={(e) =>
                    field.onChange(e.target.value === '' ? null : Number(e.target.value))
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rules.role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نقش کاربر</FormLabel>
              <Select
                value={field.value ?? 'any'}
                onValueChange={(value) => field.onChange(value === 'any' ? null : value)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="هر نقشی" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="any">هر نقشی</SelectItem>
                  <SelectItem value="USER">کاربر</SelectItem>
                  <SelectItem value="ADMIN">مدیر</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rules.phoneVerified"
          render={({ field }) => (
            <FormItem>
              <FormLabel>وضعیت تایید تلفن</FormLabel>
              <Select
                value={field.value === true ? 'true' : field.value === false ? 'false' : 'any'}
                onValueChange={(value) =>
                  field.onChange(value === 'any' ? null : value === 'true')
                }
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="هر وضعیتی" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="any">هر وضعیتی</SelectItem>
                  <SelectItem value="true">تایید شده</SelectItem>
                  <SelectItem value="false">تایید نشده</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div />

        <FormField
          control={form.control}
          name="rules.joinedAfter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>عضویت از تاریخ</FormLabel>
              <FormControl>
                <JalaliDatePicker
                  value={isoToDateObject(field.value)}
                  onChange={(date) => field.onChange(dateObjectToIso(date))}
                  placeholder="بدون محدودیت"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rules.joinedBefore"
          render={({ field }) => (
            <FormItem>
              <FormLabel>عضویت تا تاریخ</FormLabel>
              <FormControl>
                <JalaliDatePicker
                  value={isoToDateObject(field.value)}
                  onChange={(date) => field.onChange(dateObjectToIso(date))}
                  placeholder="بدون محدودیت"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-2">
        <p className="text-right text-sm font-medium text-foreground">برچسب‌های مورد نیاز</p>
        {isTagsLoading ? (
          <p className="text-right text-xs text-muted-foreground">در حال بارگذاری برچسب‌ها...</p>
        ) : !tags || tags.length === 0 ? (
          <p className="text-right text-xs text-muted-foreground">برچسبی ثبت نشده است.</p>
        ) : (
          <div className="flex flex-wrap justify-end gap-3">
            {tags.map((tag) => (
              <label key={tag.id} className="flex items-center gap-2 text-sm">
                {tag.name}
                <Checkbox
                  checked={selectedTagIds.includes(tag.id)}
                  onCheckedChange={(checked) => toggleTag(tag.id, checked === true)}
                />
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
