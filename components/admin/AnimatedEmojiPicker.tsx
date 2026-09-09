'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Search, Smile } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  BUILTIN_EMOJI_PACKS,
  loadCustomPacks,
  searchAllEmoji,
  type AnimatedEmojiItem,
  type AnimatedEmojiPack,
} from '@/lib/admin/animated-emoji-packs';

interface AnimatedEmojiPickerProps {
  /** چه چیزی در نقطه کرزر درج شود: ایموجی متحرک (img) یا کاراکتر ساده */
  onPick: (item: AnimatedEmojiItem, mode: 'animated' | 'char') => void;
  disabled?: boolean;
  align?: 'start' | 'center' | 'end';
}

/** دکمه 😍 + پاپ‌اور پک‌ها با جستجو؛ درج ایموجی متحرک یا کاراکتر ساده. */
export default function AnimatedEmojiPicker({ onPick, disabled, align = 'end' }: AnimatedEmojiPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('search');
  const [packs, setPacks] = useState<AnimatedEmojiPack[]>(BUILTIN_EMOJI_PACKS);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    loadCustomPacks().then((custom) => {
      if (!cancelled && custom.length > 0) setPacks([...BUILTIN_EMOJI_PACKS, ...custom]);
    });
    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setActiveTab('search');
    }
  }, [open ]);

  const results = useMemo(() => searchAllEmoji(query, packs), [query, packs]);
  const trimmed = query.trim();
  const showSearchTab = trimmed !== '';

  const grid = (items: AnimatedEmojiItem[]) =>
    items.length === 0 ? (
      <p className="py-8 text-center text-xs text-muted-foreground">
        چیزی پیدا نشد — عبارت دیگری امتحان کنید.
      </p>
    ) : (
      <div className="grid max-h-64 grid-cols-6 gap-1 overflow-y-auto p-2" dir="rtl">
        {items.map((it) => (
          <div key={it.id} className="group relative flex flex-col items-center">
            <button
              type="button"
              title={`${it.char} ${it.fa} — کلیک: متحرک`}
              onClick={() => {
                onPick(it, 'animated');
                setOpen(false);
              }}
              className="flex size-11 items-center justify-center rounded-lg transition hover:scale-110 hover:bg-muted"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.src} alt={it.fa} width={30} height={30} loading="lazy" className="size-[30px] object-contain" />
            </button>
            <button
              type="button"
              title={`درج «${it.char}» به‌صورت متن ساده`}
              onClick={() => {
                onPick(it, 'char');
                setOpen(false);
              }}
              className="mt-0.5 rounded px-1 text-[10px] leading-4 text-muted-foreground opacity-0 transition group-hover:opacity-100 hover:bg-muted hover:text-foreground"
            >
              {it.char || 'متن'}
            </button>
          </div>
        ))}
      </div>
    );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          title="ایموجی متحرک"
          className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50"
        >
          <Smile className="size-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent align={align} className="w-80 p-0" dir="rtl">
        <div className="border-b p-2">
          <div className="relative">
            <Search className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجو: قلب، پول، جشن، money…"
              className="h-8 pr-8 text-xs"
            />
          </div>
          <p className="mt-1.5 px-1 text-[10px] leading-4 text-muted-foreground">
            کلیک روی تصویر = ایموجی متحرک · متن زیرش = کاراکتر ساده
          </p>
        </div>
        <Tabs value={showSearchTab ? 'search' : activeTab} onValueChange={setActiveTab}>
          <div className="border-b px-2 pt-1">
            <TabsList className={cn('grid w-full grid-cols-5')}>
              {showSearchTab ? (
                <TabsTrigger value="search" className="text-[11px]">
                  نتیجه ({results.length.toLocaleString('fa-IR')})
                </TabsTrigger>
              ) : (
                <>
                  <TabsTrigger value="search" className="text-[11px]">
                    همه
                  </TabsTrigger>
                  {packs.slice(0, 4).map((p) => (
                    <TabsTrigger key={p.id} value={p.id} className="truncate text-[11px]">
                      {p.title}
                    </TabsTrigger>
                  ))}
                </>
              )}
            </TabsList>
          </div>
          {showSearchTab ? (
            <TabsContent value="search" className="m-0">
              {grid(results)}
            </TabsContent>
          ) : (
            <>
              <TabsContent value="search" className="m-0">
                {grid(results)}
              </TabsContent>
              {packs.map((p) => (
                <TabsContent key={p.id} value={p.id} className="m-0">
                  {grid(p.items)}
                </TabsContent>
              ))}
            </>
          )}
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
