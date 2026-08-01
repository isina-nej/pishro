'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AdminEmptyState } from '@/components/admin/AdminPageShell';
import type { CrmCustomerDetail } from '@/lib/hooks/useCrmCustomer';

interface CustomerOrdersTabProps {
  orders: CrmCustomerDetail['orders'];
  transactions: CrmCustomerDetail['transactions'];
  investmentPortfolios: CrmCustomerDetail['investmentPortfolios'];
}

function formatToman(amount: number) {
  return `${amount.toLocaleString('fa-IR')} تومان`;
}

const ORDER_STATUS_LABEL: Record<string, { label: string; variant: 'success' | 'outline' | 'destructive' }> = {
  PENDING: { label: 'در انتظار', variant: 'outline' },
  PAID: { label: 'پرداخت‌شده', variant: 'success' },
  FAILED: { label: 'ناموفق', variant: 'destructive' },
};

const TRANSACTION_STATUS_LABEL: Record<string, { label: string; variant: 'success' | 'outline' | 'destructive' }> = {
  PENDING: { label: 'در انتظار', variant: 'outline' },
  SUCCESS: { label: 'موفق', variant: 'success' },
  FAILED: { label: 'ناموفق', variant: 'destructive' },
};

const TRANSACTION_TYPE_LABEL: Record<string, string> = {
  PAYMENT: 'پرداخت',
  REFUND: 'بازگشت وجه',
  WITHDRAWAL: 'برداشت',
};

const PORTFOLIO_STATUS_LABEL: Record<string, { label: string; variant: 'success' | 'outline' | 'destructive' | 'secondary' }> = {
  ACTIVE: { label: 'فعال', variant: 'success' },
  COMPLETED: { label: 'تکمیل‌شده', variant: 'secondary' },
  CANCELLED: { label: 'لغوشده', variant: 'destructive' },
  EXPIRED: { label: 'منقضی‌شده', variant: 'outline' },
};

export default function CustomerOrdersTab({
  orders,
  transactions,
  investmentPortfolios,
}: CustomerOrdersTabProps) {
  return (
    <div className="space-y-4">
      <Card className="space-y-3 p-5">
        <h3 className="text-right text-sm font-semibold text-foreground">سفارش‌ها</h3>
        {orders.length === 0 ? (
          <AdminEmptyState title="سفارشی ثبت نشده" description="این مشتری تاکنون سفارشی ثبت نکرده است." />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>شناسه سفارش</TableHead>
                  <TableHead>مبلغ</TableHead>
                  <TableHead>وضعیت</TableHead>
                  <TableHead>تاریخ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => {
                  const status = ORDER_STATUS_LABEL[order.status] ?? { label: order.status, variant: 'outline' as const };
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">{order.id}</TableCell>
                      <TableCell>{formatToman(order.total)}</TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString('fa-IR')}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <Card className="space-y-3 p-5">
        <h3 className="text-right text-sm font-semibold text-foreground">تراکنش‌ها</h3>
        {transactions.length === 0 ? (
          <AdminEmptyState title="تراکنشی ثبت نشده" description="این مشتری تاکنون تراکنشی نداشته است." />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>شناسه تراکنش</TableHead>
                  <TableHead>نوع</TableHead>
                  <TableHead>مبلغ</TableHead>
                  <TableHead>وضعیت</TableHead>
                  <TableHead>تاریخ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => {
                  const status = TRANSACTION_STATUS_LABEL[tx.status] ?? { label: tx.status, variant: 'outline' as const };
                  return (
                    <TableRow key={tx.id}>
                      <TableCell className="font-mono text-xs">{tx.id}</TableCell>
                      <TableCell>{TRANSACTION_TYPE_LABEL[tx.type] ?? tx.type}</TableCell>
                      <TableCell>{formatToman(tx.amount)}</TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                      <TableCell>{new Date(tx.createdAt).toLocaleDateString('fa-IR')}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <Card className="space-y-3 p-5">
        <h3 className="text-right text-sm font-semibold text-foreground">سبدهای سرمایه‌گذاری</h3>
        {investmentPortfolios.length === 0 ? (
          <AdminEmptyState
            title="سبدی ثبت نشده"
            description="این مشتری سبد سرمایه‌گذاری ندارد یا تاریخچه آن حذف شده است."
          />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>نوع سبد</TableHead>
                  <TableHead>مبلغ سرمایه‌گذاری</TableHead>
                  <TableHead>سود مورد انتظار</TableHead>
                  <TableHead>وضعیت</TableHead>
                  <TableHead>تاریخ شروع</TableHead>
                  <TableHead>تاریخ پایان</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {investmentPortfolios.map((p) => {
                  const status = PORTFOLIO_STATUS_LABEL[p.status] ?? { label: p.status, variant: 'outline' as const };
                  return (
                    <TableRow key={p.id}>
                      <TableCell>{p.portfolioType}</TableCell>
                      <TableCell>{formatToman(p.portfolioAmount)}</TableCell>
                      <TableCell>{p.expectedReturn.toLocaleString('fa-IR')}٪</TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                      <TableCell>{new Date(p.startDate).toLocaleDateString('fa-IR')}</TableCell>
                      <TableCell>{p.endDate ? new Date(p.endDate).toLocaleDateString('fa-IR') : '—'}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}
