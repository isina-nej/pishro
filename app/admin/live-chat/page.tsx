'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  MessageCircle,
  Phone,
  Search,
  Send,
  UserRound,
  Clock3,
} from 'lucide-react';
import { AdminLoadingState, AdminPageShell } from '@/components/admin/AdminPageShell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import {
  useLiveChatDetail,
  useLiveChatList,
  useReplyLiveChat,
  useUpdateLiveChatStatus,
  type GuestChatConversation,
  type GuestChatStatus,
} from '@/lib/hooks/useLiveChat';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const STATUS_LABEL: Record<GuestChatStatus, string> = {
  OPEN: 'جدید',
  ACTIVE: 'فعال',
  CLOSED: 'بسته',
};

function fullName(item: GuestChatConversation) {
  return `${item.firstName} ${item.lastName}`.trim();
}

function formatTime(value?: string | null) {
  if (!value) return '—';
  return new Date(value).toLocaleString('fa-IR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminLiveChatPage() {
  const { user, isLoading } = useAdminAuth();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 300);
    return () => window.clearTimeout(t);
  }, [searchInput]);

  const { data, isLoading: listLoading } = useLiveChatList(page, 30, {
    search: search || undefined,
    status: status || undefined,
  });

  const items = data?.items ?? [];
  const pagination = data?.pagination;

  useEffect(() => {
    if (!selectedId && items[0]?.id) {
      setSelectedId(items[0].id);
    }
  }, [items, selectedId]);

  const { data: detail, isLoading: detailLoading } = useLiveChatDetail(selectedId);
  const replyMutation = useReplyLiveChat(selectedId || '');
  const statusMutation = useUpdateLiveChatStatus(selectedId || '');

  useEffect(() => {
    if (!threadRef.current) return;
    threadRef.current.scrollTop = threadRef.current.scrollHeight;
  }, [detail?.messages?.length, selectedId]);

  const selectedPreview = useMemo(
    () => items.find((item) => item.id === selectedId) || detail || null,
    [items, selectedId, detail]
  );

  if (isLoading) {
    return (
      <AdminPageShell title="چت پشتیبانی" description="گفتگوهای ویجت سایت">
        <AdminLoadingState />
      </AdminPageShell>
    );
  }
  if (!user) return null;

  const sendReply = async () => {
    if (!selectedId || !draft.trim()) return;
    await replyMutation.mutateAsync(draft.trim());
    setDraft('');
  };

  return (
    <AdminPageShell
      title="چت پشتیبانی زنده"
      description="گفتگوهای ویجت سایت — مشخصات تماس و پاسخ‌گویی در یک صفحه"
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="جستجو نام، نام خانوادگی یا شماره..."
            className="pr-9"
          />
        </div>
        <div className="flex gap-2">
          {(['', 'OPEN', 'ACTIVE', 'CLOSED'] as const).map((value) => (
            <Button
              key={value || 'all'}
              type="button"
              size="sm"
              variant={status === value ? 'default' : 'outline'}
              onClick={() => {
                setStatus(value);
                setPage(1);
              }}
            >
              {value ? STATUS_LABEL[value] : 'همه'}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid min-h-[70vh] overflow-hidden rounded-2xl border border-border bg-card lg:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="border-b border-border lg:border-b-0 lg:border-l">
          <div className="border-b border-border px-4 py-3 text-sm font-semibold">
            گفتگوها ({pagination?.total ?? items.length})
          </div>
          <div className="max-h-[34vh] overflow-y-auto lg:max-h-[calc(70vh-52px)]">
            {listLoading ? (
              <p className="p-4 text-sm text-muted-foreground">در حال بارگذاری...</p>
            ) : items.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">گفتگویی نیست.</p>
            ) : (
              items.map((item) => {
                const active = item.id === selectedId;
                const last = item.messages?.[0];
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={cn(
                      'w-full border-b border-border/60 px-4 py-3 text-right transition hover:bg-muted/50',
                      active && 'bg-primary/10'
                    )}
                  >
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold">{fullName(item)}</p>
                      <Badge variant={item.status === 'CLOSED' ? 'secondary' : 'default'}>
                        {STATUS_LABEL[item.status]}
                      </Badge>
                    </div>
                    <p className="truncate text-xs text-muted-foreground" dir="ltr">
                      {item.phone}
                    </p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {last?.body || item.topic || 'بدون پیام'}
                    </p>
                  </button>
                );
              })
            )}
          </div>
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border px-3 py-2">
              <Button
                size="sm"
                variant="ghost"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                قبلی
              </Button>
              <span className="text-xs text-muted-foreground">
                {page} / {pagination.totalPages}
              </span>
              <Button
                size="sm"
                variant="ghost"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                بعدی
              </Button>
            </div>
          )}
        </aside>

        <section className="flex min-h-[420px] flex-col">
          {!selectedId ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 text-muted-foreground">
              <MessageCircle className="size-8 opacity-50" />
              <p className="text-sm">یک گفتگو را انتخاب کنید</p>
            </div>
          ) : detailLoading && !detail ? (
            <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
              در حال بارگذاری گفتگو...
            </div>
          ) : detail ? (
            <>
              <div className="border-b border-border px-4 py-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold">{fullName(detail)}</h2>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Phone className="size-3.5" />
                        <span dir="ltr">{detail.phone}</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <UserRound className="size-3.5" />
                        {detail.topic || 'بدون موضوع'}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock3 className="size-3.5" />
                        {formatTime(detail.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {detail.status !== 'CLOSED' ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => statusMutation.mutate('CLOSED')}
                        disabled={statusMutation.isPending}
                      >
                        بستن گفتگو
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => statusMutation.mutate('ACTIVE')}
                        disabled={statusMutation.isPending}
                      >
                        بازگشایی
                      </Button>
                    )}
                  </div>
                </div>

                <div className="mt-3 grid gap-2 rounded-xl border border-border/70 bg-muted/30 p-3 text-xs sm:grid-cols-3">
                  <div>
                    <p className="text-muted-foreground">نام</p>
                    <p className="font-semibold">{detail.firstName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">نام خانوادگی</p>
                    <p className="font-semibold">{detail.lastName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">شماره تماس</p>
                    <p className="font-semibold" dir="ltr">
                      {detail.phone}
                    </p>
                  </div>
                </div>
              </div>

              <div ref={threadRef} className="flex-1 space-y-3 overflow-y-auto bg-background/40 px-4 py-4">
                {(detail.messages || []).map((message) => {
                  const mine = message.sender === 'ADMIN';
                  return (
                    <div
                      key={message.id}
                      className={cn('flex', mine ? 'justify-start' : 'justify-end')}
                    >
                      <div
                        className={cn(
                          'max-w-[75%] rounded-2xl px-3 py-2 text-sm leading-6',
                          mine
                            ? 'bg-primary text-primary-foreground'
                            : 'border border-border bg-card text-foreground'
                        )}
                      >
                        <p className="mb-1 text-[10px] opacity-70">
                          {mine ? message.adminName || 'پشتیبانی' : fullName(detail)}
                          {' · '}
                          {formatTime(message.createdAt)}
                        </p>
                        <p>{message.body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-border p-3">
                <div className="flex items-end gap-2">
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    rows={2}
                    disabled={detail.status === 'CLOSED'}
                    placeholder={
                      detail.status === 'CLOSED'
                        ? 'گفتگو بسته است'
                        : 'پاسخ خود را بنویسید...'
                    }
                    className="min-h-[44px] flex-1 resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        void sendReply();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => void sendReply()}
                    disabled={
                      detail.status === 'CLOSED' ||
                      replyMutation.isPending ||
                      !draft.trim()
                    }
                  >
                    <Send className="size-4" />
                    ارسال
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
              گفتگو یافت نشد
            </div>
          )}
          {selectedPreview && !detail && null}
        </section>
      </div>
    </AdminPageShell>
  );
}
