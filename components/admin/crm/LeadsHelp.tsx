'use client';

import Link from 'next/link';
import { CircleHelp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const LEADS_HELP_SHORT =
  'مشتری بالقوه‌ای که هنوز خرید نکرده — شماره‌اش را نگه دار، پیگیری کن، خوب‌ها را به فرصت فروش تبدیل کن.';

const LEADS_HELP_LONG = [
  'سرنخ = نخ شروع فروش. هر کس که تماسش را داری ولی هنوز پول نداده: ثبتش کن، منبعش را بنویس (سایت، اینستاگرام، تماس...)، یک مسئول برای پیگیری بگذار.',
  'مسیر استاندارد: جدید ← در تماس ← واجد شرایط ← تبدیل‌شده (می‌شود فرصت فروش) یا از دست‌رفته.',
  'هر تماس و جلسه را در تب «فعالیت‌ها» بنویس تا تاریخچه نپرد. منبع دقیق = گزارش تبلیغات درست.',
];

/** دکمه ؟ — هاور تولتیپ کوتاه می‌دهد، کلیک پاپ‌اور کامل باز می‌کند. */
export function LeadsHelpPopover() {
  return (
    <TooltipProvider>
      <Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="راهنمای سرنخ‌های فروش"
                className="h-9 w-9 shrink-0 rounded-full"
              >
                <CircleHelp className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-60 text-right">
            {LEADS_HELP_SHORT}
          </TooltipContent>
        </Tooltip>
        <PopoverContent align="start" className="w-80 space-y-2 text-right" dir="rtl">
          <p className="text-sm font-semibold text-foreground">این تب برای چیست؟</p>
          {LEADS_HELP_LONG.map((line) => (
            <p key={line.slice(0, 12)} className="text-xs leading-6 text-muted-foreground">
              {line}
            </p>
          ))}
          <Button asChild variant="link" size="sm" className="h-auto p-0 text-xs">
            <Link href="/admin/guide">آموزش کامل در راهنمای پنل</Link>
          </Button>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
}

/** باکس راهنمای ثابت بالای لیست — همیشه جلوی چشم، بدون نیاز به کلیک. */
export function LeadsGuideBox() {
  return (
    <Card className="flex gap-3 border-dashed p-4 text-right" dir="rtl">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <CircleHelp className="h-4 w-4" />
      </span>
      <div className="min-w-0 space-y-1">
        <p className="text-sm font-semibold text-foreground">
          سرنخ فروش = مشتری بالقوه‌ای که هنوز خرید نکرده
        </p>
        <p className="text-xs leading-6 text-muted-foreground">
          شماره تماس را ذخیره کن، منبع را مشخص کن، مسئول پیگیری بگذار و هر تماس را در
          «فعالیت‌ها» ثبت کن. سرنخ خوب ← «تبدیل به فرصت فروش»؛ سرنخ بد ← «از دست‌رفته».
          حذف واقعی فقط برای رکورد اشتباه یا تکراری است.
        </p>
      </div>
    </Card>
  );
}
