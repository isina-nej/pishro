'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Trash2 } from 'lucide-react';
import { AdminLoadingState, AdminPageShell } from '@/components/admin/AdminPageShell';
import SegmentRuleFields from '../SegmentRuleFields';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AdminEmptyState } from '@/components/admin/AdminPageShell';
import DataTablePagination from '@/components/admin/data-table/DataTablePagination';
import {
  CreateCustomerSegmentSchema,
  type CreateCustomerSegmentInput,
} from '@/lib/schemas/crm-segment-schema';
import {
  useCrmSegmentDetail,
  useDeleteCrmSegment,
  useUpdateCrmSegment,
} from '@/lib/hooks/useCrmSegments';

export const dynamic = 'force-dynamic';

export default function CrmSegmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const segmentId = params.id as string;
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, error } = useCrmSegmentDetail(segmentId, page, limit, Boolean(segmentId));
  const updateSegment = useUpdateCrmSegment(segmentId);
  const deleteSegment = useDeleteCrmSegment();

  const form = useForm<CreateCustomerSegmentInput>({
    resolver: zodResolver(CreateCustomerSegmentSchema),
    defaultValues: {
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
    },
  });

  useEffect(() => {
    if (data?.segment) {
      form.reset({
        name: data.segment.name,
        description: data.segment.description ?? '',
        rules: {
          minSpend: data.segment.rules.minSpend ?? null,
          tagIds: data.segment.rules.tagIds ?? [],
          phoneVerified: data.segment.rules.phoneVerified ?? null,
          role: data.segment.rules.role ?? null,
          joinedAfter: data.segment.rules.joinedAfter ?? null,
          joinedBefore: data.segment.rules.joinedBefore ?? null,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.segment]);

  const onSubmit = (values: CreateCustomerSegmentInput) => {
    updateSegment.mutate(values);
  };

  const handleDelete = () => {
    if (!confirm('آیا از حذف این سگمنت مطمئن هستید؟')) return;
    deleteSegment.mutate(segmentId, {
      onSuccess: () => router.push('/admin/crm/segments'),
    });
  };

  if (isLoading) {
    return <AdminLoadingState label="در حال دریافت اطلاعات سگمنت..." />;
  }

  if (error || !data) {
    return (
      <AdminPageShell
        title="سگمنت یافت نشد"
        description="سگمنت مورد نظر وجود ندارد یا حذف شده است."
        actions={
          <Button asChild variant="outline">
            <Link href="/admin/crm/segments">
              بازگشت به سگمنت‌ها
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        }
      >
        <Card className="p-6 text-center text-sm text-muted-foreground">
          اطلاعات سگمنت قابل دریافت نیست.
        </Card>
      </AdminPageShell>
    );
  }

  const { members } = data;

  return (
    <AdminPageShell
      title={data.segment.name}
      description={`اعضای این سگمنت به‌صورت لحظه‌ای بر اساس قوانین محاسبه می‌شوند (${members.pagination.total.toLocaleString('fa-IR')} مشتری)`}
      actions={
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">
            {members.pagination.total.toLocaleString('fa-IR')} عضو
          </Badge>
          <Button variant="destructive" onClick={handleDelete} disabled={deleteSegment.isPending}>
            <Trash2 className="h-4 w-4" />
            حذف سگمنت
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/crm/segments">
              بازگشت
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Card className="p-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <SegmentRuleFields form={form} />
              <div className="flex justify-end">
                <Button type="submit" disabled={updateSegment.isPending}>
                  {updateSegment.isPending ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                </Button>
              </div>
            </form>
          </Form>
        </Card>

        <Card className="space-y-3 p-5">
          <h3 className="text-right text-sm font-semibold text-foreground">اعضای سگمنت</h3>
          {members.items.length === 0 ? (
            <AdminEmptyState
              title="مشتری‌ای مطابق این سگمنت نیست"
              description="با تغییر قوانین بالا، اعضای این سگمنت را گسترش دهید."
            />
          ) : (
            <>
              <div className="overflow-x-auto rounded-2xl border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>نام</TableHead>
                      <TableHead>شماره تلفن</TableHead>
                      <TableHead>ایمیل</TableHead>
                      <TableHead>نقش</TableHead>
                      <TableHead>تاریخ عضویت</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.items.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <Link
                            href={`/admin/crm/customers/${member.id}`}
                            className="text-primary hover:underline"
                          >
                            {[member.firstName, member.lastName].filter(Boolean).join(' ') || 'بدون نام'}
                          </Link>
                        </TableCell>
                        <TableCell>{member.phone}</TableCell>
                        <TableCell>{member.email || '—'}</TableCell>
                        <TableCell>
                          <Badge variant={member.role === 'ADMIN' ? 'premium' : 'secondary'}>
                            {member.role === 'ADMIN' ? 'مدیر' : 'کاربر'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {member.createdAt ? new Date(member.createdAt).toLocaleDateString('fa-IR') : '—'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <DataTablePagination pagination={members.pagination} onPageChange={setPage} />
            </>
          )}
        </Card>
      </div>
    </AdminPageShell>
  );
}
