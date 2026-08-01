'use client';

import DatePicker from 'react-multi-date-picker';
import DateObject from 'react-date-object';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import 'react-multi-date-picker/styles/colors/teal.css';
import { cn } from '@/lib/utils';

interface JalaliDatePickerProps {
  value: DateObject | null;
  onChange: (date: DateObject | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Thin wrapper around the project's existing react-multi-date-picker +
 * persian calendar/locale setup (see components/profile/personalInfoForm.tsx
 * for the original pattern) so new CRM forms reuse one Jalali date input
 * instead of a second Gregorian date-picker dependency.
 */
export function JalaliDatePicker({
  value,
  onChange,
  placeholder = 'انتخاب تاریخ',
  disabled,
  className,
}: JalaliDatePickerProps) {
  return (
    <DatePicker
      value={value}
      onChange={(date) => onChange(date as DateObject | null)}
      calendar={persian}
      locale={persian_fa}
      calendarPosition="bottom-right"
      placeholder={placeholder}
      inputClass={cn(
        'block w-full rounded-md border border-input bg-card p-2 text-sm text-foreground',
        className
      )}
      containerClassName="w-full"
      disabled={disabled}
    />
  );
}
