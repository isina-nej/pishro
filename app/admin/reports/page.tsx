'use client';

import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Clock3,
  Percent,
  TicketCheck,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';
import { AdminLoadingState, AdminPageShell } from '@/components/admin/AdminPageShell';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import {
  useCrmPipelineFunnel,
  useLeadConversionStats,
  useTicketStats,
} from '@/lib/hooks/useCrmAnalytics';
import type { CrmLeadConversionPeriod } from '@/lib/services/dashboard-service';

const numberFormatter = new Intl.NumberFormat('fa-IR');

function formatMoney(value: number) {
  return `${numberFormatter.format(value)} تومان`;
}

const LEAD_STATUS_ORDER = ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST'] as const;
const LEAD_STATUS_LABELS: Record<string, string> = {
  NEW: 'جدید',
  CONTACTED: 'تماس گرفته‌شده',
  QUALIFIED: 'واجد شرایط',
  CONVERTED: 'تبدیل شده',
  LOST: 'از دست رفته',
};

const TICKET_STATUS_ORDER = [
  'OPEN',
  'IN_PROGRESS',
  'WAITING_ON_CUSTOMER',
  'RESOLVED',
  'CLOSED',
] as const;
const TICKET_STATUS_LABELS: Record<string, string> = {
  OPEN: 'باز',
  IN_PROGRESS: 'در حال بررسی',
  WAITING_ON_CUSTOMER: 'در انتظار مشتری',
  RESOLVED: 'حل شده',
  CLOSED: 'بسته شده',
};

const leadStatusChartConfig: ChartConfig = LEAD_STATUS_ORDER.reduce((config, status, index) => {
  config[status] = {
    label: LEAD_STATUS_LABELS[status],
    color: `hsl(var(--chart-${index + 1}))`,
  };
  return config;
}, {} as ChartConfig);

const ticketStatusChartConfig: ChartConfig = TICKET_STATUS_ORDER.reduce((config, status, index) => {
  config[status] = {
    label: TICKET_STATUS_LABELS[status],
    color: `hsl(var(--chart-${index + 1}))`,
  };
  return config;
}, {} as ChartConfig);

const funnelChartConfig: ChartConfig = {
  dealCount: {
    label: 'تعداد معامله',
    color: 'hsl(var(--chart-1))',
  },
};

function StatTile({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: string;
  icon: typeof Percent;
  description?: string;
}) {
  return (
    <Card className="min-w-0 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="rounded-xl bg-muted p-2.5 text-primary">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <div className="min-w-0 space-y-1 text-right">
          <p className="text-xs text-muted-foreground sm:text-sm">{title}</p>
          <p className="truncate text-lg font-bold text-foreground sm:text-xl">{value}</p>
          {description && <p className="text-[11px] text-muted-foreground">{description}</p>}
        </div>
      </div>
    </Card>
  );
}

export default function AdminReportsPage() {
  const { user, isLoading: isLoadingUser } = useAdminAuth();
  const [leadPeriod, setLeadPeriod] = useState<CrmLeadConversionPeriod>('monthly');

  const { data: funnel, isLoading: isFunnelLoading } = useCrmPipelineFunnel();
  const { data: leadStats, isLoading: isLeadLoading } = useLeadConversionStats(leadPeriod);
  const { data: ticketStats, isLoading: isTicketLoading } = useTicketStats();

  const funnelChartData = useMemo(
    () =>
      (funnel ?? []).map((stage) => ({
        name: stage.name,
        dealCount: stage.dealCount,
        totalAmount: stage.totalAmount,
      })),
    [funnel]
  );

  const totalPipelineValue = useMemo(
    () => (funnel ?? []).reduce((sum, stage) => sum + stage.totalAmount, 0),
    [funnel]
  );
  const totalPipelineDeals = useMemo(
    () => (funnel ?? []).reduce((sum, stage) => sum + stage.dealCount, 0),
    [funnel]
  );

  const leadPieData = useMemo(
    () =>
      LEAD_STATUS_ORDER.map((status) => ({
        status,
        label: LEAD_STATUS_LABELS[status],
        count: leadStats?.statusCounts.find((item) => item.status === status)?.count ?? 0,
        fill: `var(--color-${status})`,
      })),
    [leadStats]
  );

  const ticketBarData = useMemo(
    () =>
      TICKET_STATUS_ORDER.map((status) => ({
        status,
        label: TICKET_STATUS_LABELS[status],
        count: ticketStats?.statusCounts.find((item) => item.status === status)?.count ?? 0,
        fill: `var(--color-${status})`,
      })),
    [ticketStats]
  );

  if (isLoadingUser) {
    return <AdminLoadingState label="در حال آماده‌سازی گزارش‌ها..." />;
  }

  if (!user) {
    return null;
  }

  return (
    <AdminPageShell
      title="گزارش‌ها"
      description="نمای تحلیلی از قیف فروش، تبدیل سرنخ‌ها و وضعیت تیکت‌های پشتیبانی."
      actions={<Badge variant="secondary">{user.role}</Badge>}
    >
      {/* قیف فروش */}
      <Card className="p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <Badge variant="outline" className="border-border text-muted-foreground">
            {numberFormatter.format(totalPipelineDeals)} معامله
          </Badge>
          <div className="text-right">
            <h2 className="font-semibold text-foreground">قیف فروش</h2>
            <p className="text-xs text-muted-foreground">
              تعداد معاملات به تفکیک مرحله — ارزش کل: {formatMoney(totalPipelineValue)}
            </p>
          </div>
        </div>

        {isFunnelLoading ? (
          <AdminLoadingState label="در حال دریافت قیف فروش..." />
        ) : funnelChartData.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">داده‌ای برای نمایش وجود ندارد</p>
        ) : (
          <ChartContainer config={funnelChartConfig} className="mx-auto max-h-80 w-full">
            <BarChart data={funnelChartData} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid horizontal={false} />
              <XAxis type="number" allowDecimals={false} />
              <YAxis dataKey="name" type="category" width={110} tickLine={false} axisLine={false} />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value, _name, item) => (
                      <div className="flex w-full flex-col gap-0.5">
                        <span className="font-medium text-foreground">
                          {numberFormatter.format(Number(value))} معامله
                        </span>
                        <span className="text-muted-foreground">
                          {formatMoney(Number(item.payload.totalAmount))}
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Bar dataKey="dealCount" fill="var(--color-dealCount)" radius={4} />
            </BarChart>
          </ChartContainer>
        )}
      </Card>

      {/* توزیع وضعیت سرنخ‌ها */}
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.6fr)_minmax(220px,1fr)]">
        <Card className="p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <Tabs value={leadPeriod} onValueChange={(value) => setLeadPeriod(value as CrmLeadConversionPeriod)}>
              <TabsList>
                <TabsTrigger value="weekly">هفتگی</TabsTrigger>
                <TabsTrigger value="monthly">ماهانه</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="text-right">
              <h2 className="font-semibold text-foreground">توزیع وضعیت سرنخ‌ها</h2>
              <p className="text-xs text-muted-foreground">تعداد سرنخ‌ها به تفکیک وضعیت</p>
            </div>
          </div>

          {isLeadLoading ? (
            <AdminLoadingState label="در حال دریافت آمار سرنخ‌ها..." />
          ) : (
            <ChartContainer config={leadStatusChartConfig} className="mx-auto max-h-72 w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="status" hideLabel />} />
                <Pie data={leadPieData} dataKey="count" nameKey="status" innerRadius={50} strokeWidth={2}>
                  {leadPieData.map((entry) => (
                    <Cell key={entry.status} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
            {LEAD_STATUS_ORDER.map((status, index) => (
              <div key={status} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span
                  className="h-2.5 w-2.5 rounded-[2px]"
                  style={{ backgroundColor: `hsl(var(--chart-${index + 1}))` }}
                />
                {LEAD_STATUS_LABELS[status]}
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-3">
          <StatTile
            title="نرخ تبدیل"
            value={isLeadLoading ? '...' : `${numberFormatter.format(leadStats?.conversionRate ?? 0)}٪`}
            icon={Percent}
            description={
              isLeadLoading
                ? undefined
                : `${numberFormatter.format(leadStats?.convertedCount ?? 0)} از ${numberFormatter.format(leadStats?.total ?? 0)} سرنخ`
            }
          />
          <StatTile
            title="مجموع سرنخ‌ها"
            value={isLeadLoading ? '...' : numberFormatter.format(leadStats?.total ?? 0)}
            icon={Users}
          />
          <StatTile
            title="ارزش کل قیف فروش"
            value={isFunnelLoading ? '...' : formatMoney(totalPipelineValue)}
            icon={Wallet}
          />
        </div>
      </div>

      {/* وضعیت تیکت‌های پشتیبانی */}
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.6fr)_minmax(220px,1fr)]">
        <Card className="p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <Badge variant="outline" className="border-border text-muted-foreground">
              {numberFormatter.format(ticketStats?.total ?? 0)} تیکت
            </Badge>
            <div className="text-right">
              <h2 className="font-semibold text-foreground">وضعیت تیکت‌های پشتیبانی</h2>
              <p className="text-xs text-muted-foreground">تعداد تیکت‌ها به تفکیک وضعیت</p>
            </div>
          </div>

          {isTicketLoading ? (
            <AdminLoadingState label="در حال دریافت آمار تیکت‌ها..." />
          ) : (
            <ChartContainer config={ticketStatusChartConfig} className="mx-auto max-h-72 w-full">
              <BarChart data={ticketBarData} margin={{ top: 8 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="status"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => TICKET_STATUS_LABELS[value] ?? value}
                  interval={0}
                  fontSize={11}
                />
                <YAxis allowDecimals={false} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent nameKey="status" hideLabel />} />
                <Bar dataKey="count" radius={4}>
                  {ticketBarData.map((entry) => (
                    <Cell key={entry.status} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          )}
        </Card>

        <div className="grid gap-3">
          <StatTile
            title="میانگین زمان حل تیکت"
            value={isTicketLoading ? '...' : `${numberFormatter.format(ticketStats?.avgResolutionHours ?? 0)} ساعت`}
            icon={Clock3}
            description={
              isTicketLoading
                ? undefined
                : `از ${numberFormatter.format(ticketStats?.resolvedCount ?? 0)} تیکت حل‌شده`
            }
          />
          <StatTile
            title="مجموع تیکت‌ها"
            value={isTicketLoading ? '...' : numberFormatter.format(ticketStats?.total ?? 0)}
            icon={TicketCheck}
          />
          <StatTile
            title="رشد سرنخ به مشتری"
            value={isLeadLoading ? '...' : `${numberFormatter.format(leadStats?.conversionRate ?? 0)}٪`}
            icon={TrendingUp}
          />
        </div>
      </div>
    </AdminPageShell>
  );
}
