'use client';

import { useState } from 'react';
import { Phone, Mail, Users, RefreshCw, StickyNote, Cog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAddTicketActivity, type CrmTicketActivity, type CrmTicketDetail } from '@/lib/hooks/useCrmTickets';

interface TicketConversationTabProps {
  ticket: CrmTicketDetail;
}

const ACTIVITY_ICONS: Record<CrmTicketActivity['type'], typeof StickyNote> = {
  NOTE: StickyNote,
  CALL: Phone,
  EMAIL: Mail,
  MEETING: Users,
  STATUS_CHANGE: RefreshCw,
  SYSTEM: Cog,
};

const ACTIVITY_LABELS: Record<CrmTicketActivity['type'], string> = {
  NOTE: 'یادداشت',
  CALL: 'تماس',
  EMAIL: 'ایمیل',
  MEETING: 'جلسه',
  STATUS_CHANGE: 'تغییر وضعیت',
  SYSTEM: 'سیستمی',
};

/**
 * Internal note thread for a ticket. This is NOT a live customer-facing chat
 * — activities are admin-only records (notes/calls/status changes) rendered
 * chronologically, matching how Activity rows are used across the CRM.
 */
export default function TicketConversationTab({ ticket }: TicketConversationTabProps) {
  const [note, setNote] = useState('');
  const addActivity = useAddTicketActivity();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = note.trim();
    if (!trimmed) return;

    addActivity.mutate(
      { ticketId: ticket.id, content: trimmed, type: 'NOTE' },
      {
        onSuccess: () => setNote(''),
      }
    );
  };

  return (
    <div className="space-y-4">
      <Card className="space-y-4 p-4">
        <div className="space-y-1 border-b border-border pb-3">
          <p className="text-xs text-muted-foreground">توضیحات اولیه تیکت</p>
          <p className="whitespace-pre-line text-sm text-foreground">{ticket.description}</p>
        </div>

        {ticket.activities.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">هنوز یادداشتی ثبت نشده است.</p>
        ) : (
          <ul className="space-y-3">
            {ticket.activities.map((activity) => {
              const Icon = ACTIVITY_ICONS[activity.type];
              return (
                <li key={activity.id} className="flex gap-3 rounded-xl border border-border bg-muted/40 p-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-medium text-foreground">
                        {ACTIVITY_LABELS[activity.type]}
                        {activity.admin?.name ? ` · ${activity.admin.name}` : ''}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(activity.createdAt).toLocaleDateString('fa-IR')}
                      </span>
                    </div>
                    <p className="whitespace-pre-line text-sm text-foreground">{activity.content}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <Card className="p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="یک یادداشت داخلی برای این تیکت بنویسید..."
            rows={3}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={!note.trim() || addActivity.isPending}>
              {addActivity.isPending ? 'در حال ثبت...' : 'ثبت یادداشت'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
