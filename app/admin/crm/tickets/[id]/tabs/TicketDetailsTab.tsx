'use client';

import { Mail, Phone, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCrmTicketAssignees, useUpdateCrmTicket, type CrmTicketDetail } from '@/lib/hooks/useCrmTickets';

interface TicketDetailsTabProps {
  ticket: CrmTicketDetail;
}

const STATUS_OPTIONS = [
  { value: 'OPEN', label: 'باز' },
  { value: 'IN_PROGRESS', label: 'در حال بررسی' },
  { value: 'WAITING_ON_CUSTOMER', label: 'در انتظار مشتری' },
  { value: 'RESOLVED', label: 'حل شده' },
  { value: 'CLOSED', label: 'بسته شده' },
] as const;

const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'کم' },
  { value: 'NORMAL', label: 'عادی' },
  { value: 'HIGH', label: 'بالا' },
  { value: 'URGENT', label: 'فوری' },
] as const;

const UNASSIGNED_VALUE = '__unassigned__';

export default function TicketDetailsTab({ ticket }: TicketDetailsTabProps) {
  const updateTicket = useUpdateCrmTicket();
  const { data: assignees, isLoading: isAssigneesLoading } = useCrmTicketAssignees();

  const customerName = ticket.customer
    ? [ticket.customer.firstName, ticket.customer.lastName].filter(Boolean).join(' ')
    : '';

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="space-y-4 p-4">
        <h3 className="text-sm font-semibold text-foreground">وضعیت و اولویت</h3>

        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">وضعیت تیکت</label>
          <Select
            value={ticket.status}
            onValueChange={(value) => updateTicket.mutate({ id: ticket.id, data: { status: value } })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">اولویت تیکت</label>
          <Select
            value={ticket.priority}
            onValueChange={(value) => updateTicket.mutate({ id: ticket.id, data: { priority: value } })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRIORITY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">مسئول تیکت</label>
          <Select
            value={ticket.assignedToId ?? UNASSIGNED_VALUE}
            disabled={isAssigneesLoading}
            onValueChange={(value) =>
              updateTicket.mutate({
                id: ticket.id,
                data: { assignedToId: value === UNASSIGNED_VALUE ? null : value },
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="انتخاب مسئول" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={UNASSIGNED_VALUE}>تخصیص نیافته</SelectItem>
              {assignees?.map((admin) => (
                <SelectItem key={admin.id} value={admin.id}>
                  {admin.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {ticket.resolvedAt && (
          <p className="text-xs text-muted-foreground">
            تاریخ حل شدن: {new Date(ticket.resolvedAt).toLocaleDateString('fa-IR')}
          </p>
        )}
      </Card>

      <Card className="space-y-4 p-4">
        <h3 className="text-sm font-semibold text-foreground">اطلاعات مشتری</h3>

        {ticket.customer ? (
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-foreground">
              <User className="h-4 w-4 text-muted-foreground" />
              {customerName || 'بدون نام'}
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <Phone className="h-4 w-4 text-muted-foreground" />
              {ticket.customer.phone}
            </div>
            {ticket.customer.email && (
              <div className="flex items-center gap-2 text-foreground">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {ticket.customer.email}
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            این تیکت به مشتری ثبت‌شده‌ای در سیستم متصل نیست. اطلاعات تماس احتمالاً در متن توضیحات درج شده است.
          </p>
        )}

        <div className="border-t border-border pt-3 text-xs text-muted-foreground">
          <p>تاریخ ایجاد: {new Date(ticket.createdAt).toLocaleDateString('fa-IR')}</p>
          <p>آخرین به‌روزرسانی: {new Date(ticket.updatedAt).toLocaleDateString('fa-IR')}</p>
        </div>
      </Card>
    </div>
  );
}
