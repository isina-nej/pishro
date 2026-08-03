'use client';

import { useState } from 'react';
import { Archive, RotateCcw, Trash2, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { BulkAction, EntityKey } from '@/lib/admin/bulk-registry';

interface BulkActionBarProps {
  entity: EntityKey;
  /** نام فارسی موجودیت برای متن‌ها، مثل «خبر» */
  entityLabel: string;
  selectedIds: string[];
  onClear: () => void;
  /** بعد از عملیات موفق صدا زده می‌شود تا صفحه داده را دوباره بگیرد */
  onDone: () => void;
  /** حذف را پنهان می‌کند — برای موجودیت‌هایی که فقط آرشیو می‌شوند */
  allowDelete?: boolean;
}

type Pending = { action: BulkAction; label: string } | null;

const ACTION_TEXT: Record<BulkAction, { verb: string; done: string }> = {
  archive: { verb: 'آرشیو', done: 'آرشیو شد' },
  activate: { verb: 'فعال‌سازی', done: 'فعال شد' },
  delete: { verb: 'حذف', done: 'حذف شد' },
};

/**
 * نوار شناور عملیات گروهی.
 *
 * فقط وقتی چیزی انتخاب شده ظاهر می‌شود. حذف — و تنها حذف — تأیید می‌گیرد،
 * چون برخلاف آرشیو برگشت‌پذیر نیست.
 */
export function BulkActionBar({
  entity,
  entityLabel,
  selectedIds,
  onClear,
  onDone,
  allowDelete = true,
}: BulkActionBarProps) {
  const [pending, setPending] = useState<Pending>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState('');

  const count = selectedIds.length;
  if (count === 0) return null;

  const run = async (action: BulkAction) => {
    setIsRunning(true);
    setError('');

    try {
      const token = localStorage.getItem('admin_access_token');
      const res = await fetch('/api/admin/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ entity, action, ids: selectedIds }),
      });

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(body?.message || 'عملیات ناموفق بود');
      }

      setPending(null);
      onClear();
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای ناشناخته');
    } finally {
      setIsRunning(false);
    }
  };

  const request = (action: BulkAction) => {
    // آرشیو و فعال‌سازی برگشت‌پذیرند، پس بی‌درنگ اجرا می‌شوند.
    if (action === 'delete') {
      setPending({ action, label: ACTION_TEXT[action].verb });
      return;
    }
    void run(action);
  };

  return (
    <>
      <div className="sticky bottom-4 z-30 mx-auto flex w-fit max-w-full flex-wrap items-center gap-2 rounded-2xl border border-border bg-background/95 px-4 py-3 shadow-lg backdrop-blur">
        <span className="text-sm font-semibold">
          {count.toLocaleString('fa-IR')} {entityLabel} انتخاب شده
        </span>

        <span className="mx-1 h-5 w-px bg-border" aria-hidden />

        <Button
          size="sm"
          variant="outline"
          onClick={() => request('activate')}
          disabled={isRunning}
        >
          <RotateCcw className="ml-1 h-4 w-4" />
          فعال‌سازی
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => request('archive')}
          disabled={isRunning}
        >
          <Archive className="ml-1 h-4 w-4" />
          آرشیو
        </Button>

        {allowDelete && (
          <Button
            size="sm"
            variant="destructive"
            onClick={() => request('delete')}
            disabled={isRunning}
          >
            <Trash2 className="ml-1 h-4 w-4" />
            حذف
          </Button>
        )}

        <Button size="sm" variant="ghost" onClick={onClear} disabled={isRunning}>
          <X className="ml-1 h-4 w-4" />
          لغو انتخاب
        </Button>

        {isRunning && <Loader2 className="h-4 w-4 animate-spin" />}

        {error && (
          <p className="w-full text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>

      <Dialog open={pending !== null} onOpenChange={(open) => !open && setPending(null)}>
        <DialogContent className="text-right" dir="rtl">
          <DialogHeader>
            <DialogTitle>تأیید حذف</DialogTitle>
            <DialogDescription>
              {count.toLocaleString('fa-IR')} {entityLabel} برای همیشه حذف می‌شود و
              قابل بازگردانی نیست. اگر مطمئن نیستید، به‌جایش آرشیو کنید.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <DialogFooter className="gap-2 sm:justify-start">
            <Button
              variant="destructive"
              onClick={() => pending && run(pending.action)}
              disabled={isRunning}
            >
              {isRunning && <Loader2 className="ml-1 h-4 w-4 animate-spin" />}
              بله، حذف کن
            </Button>
            <Button
              variant="outline"
              onClick={() => setPending(null)}
              disabled={isRunning}
            >
              انصراف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default BulkActionBar;
