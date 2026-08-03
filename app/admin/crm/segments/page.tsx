'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Users } from 'lucide-react';
import { AdminEmptyState, AdminLoadingState, AdminPageShell } from '@/components/admin/AdminPageShell';
import SegmentRuleFields from './SegmentRuleFields';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import {
  CreateCustomerSegmentSchema,
  type CreateCustomerSegmentInput,
} from '@/lib/schemas/crm-segment-schema';
import { useCreateCrmSegment, useCrmSegments, crmSegmentKeys } from '@/lib/hooks/useCrmSegments';
import { BulkActionBar } from '@/components/admin/data-table/BulkActionBar';
import { SelectionCheckbox } from '@/components/admin/data-table/SelectionCheckbox';
import { useBulkSelection } from '@/lib/hooks/useBulkSelection';

export const dynamic = 'force-dynamic';

const DEFAULT_VALUES: CreateCustomerSegmentInput = {
  name: '',
  description: '',
  rules: {
    minSpend: null,
    tagIds: [],
    phoneVerified: null,
    role: null,
    joinedAfter: null,
    joinedBefore: null,
  },
};

function ruleSummary(rules: CreateCustomerSegmentInput['rules']): string[] {
  const parts: string[] = [];
  if (rules.minSpend) parts.push(`حداقل خرید ${rules.minSpend.toLocaleString('fa-IR')} تومان`);
  if (rules.role) parts.push(rules.role === 'ADMIN' ? 'نقش: مدیر' : 'نقش: کاربر');
  if (rules.phoneVerified === true) parts.push('تلفن تایید شده');
  if (rules.phoneVerified === false) parts.push('تلفن تایید نشده');
  if (rules.tagIds && rules.tagIds.length > 0) parts.push(`${rules.tagIds.length.toLocaleString('fa-IR')} برچسب`);
  if (rules.joinedAfter) parts.push('محدودیت تاریخ عضویت');
  return parts;
}

export default function CrmSegmentsPage() {
  const { data: segments, isLoading } = useCrmSegments();
  const { selectedIds, setSelectedIds, clear, onDone } = useBulkSelection(crmSegmentKeys.all);
  const createSegment = useCreateCrmSegment();
  const [open, setOpen] = useState(false);

  const form = useForm<CreateCustomerSegmentInput>({
    resolver: zodResolver(CreateCustomerSegmentSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const onSubmit = (values: CreateCustomerSegmentInput) => {
    createSegment.mutate(values, {
      onSuccess: () => {
        setOpen(false);
        form.reset(DEFAULT_VALUES);
      },
    });
  };

  return (
    <AdminPageShell
      title="سگمنت‌های مشتریان"
      description="مشتریان را بر اساس قوانین (خرید، برچسب، تاریخ عضویت و ...) دسته‌بندی کنید. عضویت هر سگمنت به‌صورت لحظه‌ای محاسبه می‌شود."
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" />
              سگمنت جدید
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto" dir="rtl">
            <DialogHeader>
              <DialogTitle>ایجاد سگمنت جدید</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <SegmentRuleFields form={form} />
                <DialogFooter>
                  <Button type="submit" disabled={createSegment.isPending}>
                    {createSegment.isPending ? 'در حال ذخیره...' : 'ایجاد سگمنت'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      }
    >
      {isLoading ? (
        <AdminLoadingState label="در حال دریافت سگمنت‌ها..." />
      ) : !segments || segments.length === 0 ? (
        <AdminEmptyState
          title="سگمنتی ثبت نشده"
          description="با ایجاد اولین سگمنت، مشتریان را بر اساس قوانین دلخواه دسته‌بندی کنید."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {segments.map((segment) => (
            <Link key={segment.id} href={`/admin/crm/segments/${segment.id}`}>
              <Card className="h-full space-y-3 p-5 transition-colors hover:border-primary">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SelectionCheckbox
                      id={segment.id}
                      selectedIds={selectedIds}
                      onChange={setSelectedIds}
                      label={`انتخاب ${segment.name}`}
                    />
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <h3 className="text-right text-sm font-semibold text-foreground">
                    {segment.name}
                  </h3>
                </div>
                {segment.description && (
                  <p className="text-right text-xs text-muted-foreground">{segment.description}</p>
                )}
                <div className="flex flex-wrap justify-end gap-1.5">
                  {ruleSummary(segment.rules).length === 0 ? (
                    <Badge variant="outline">بدون قانون</Badge>
                  ) : (
                    ruleSummary(segment.rules).map((part) => (
                      <Badge key={part} variant="secondary">
                        {part}
                      </Badge>
                    ))
                  )}
                </div>
                <p className="text-right text-xs text-muted-foreground">
                  ساخته‌شده توسط {segment.createdBy?.name ?? 'نامشخص'}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <BulkActionBar
        entity="segment"
        entityLabel="سگمنت"
        selectedIds={selectedIds}
        onClear={clear}
        onDone={onDone}
      />
    </AdminPageShell>
  );
}
