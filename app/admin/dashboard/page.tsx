'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock3,
  Eye,
  FileText,
  GraduationCap,
  ListChecks,
  Percent,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import { AdminLoadingState, AdminPageShell } from '@/components/admin/AdminPageShell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api-client';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import { useCrmPipelineFunnel, useLeadConversionStats } from '@/lib/hooks/useCrmAnalytics';
import type { DashboardStats, StatWithGrowth } from '@/types/dashboard';

const numberFormatter = new Intl.NumberFormat('fa-IR');

function formatMoney(value: number) {
  return `${numberFormatter.format(value)} تومان`;
}

function formatGrowth(growthRate: number) {
  const percent = Math.abs(Math.round(growthRate * 100));
  if (percent === 0) return 'بدون تغییر';
  return `${growthRate > 0 ? '+' : '-'}${numberFormatter.format(percent)}٪`;
}

function StatCard({
  title,
  value,
  stat,
  icon: Icon,
}: {
  title: string;
  value: string;
  stat: StatWithGrowth;
  icon: typeof Eye;
}) {
  const positive = stat.growthRate >= 0;

  return (
    <Card className="min-w-0 p-4">
      <div className="flex h-full items-start justify-between gap-3">
        <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <div className="min-w-0 space-y-2 text-right">
          <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">{title}</p>
          <p className="truncate text-lg font-bold text-slate-950 dark:text-white sm:text-xl xl:text-2xl">{value}</p>
          <Badge
            variant="outline"
            className={`text-[11px] ${positive ? 'border-green-200 text-green-700 dark:border-green-900 dark:text-green-300' : 'border-red-200 text-red-700 dark:border-red-900 dark:text-red-300'}`}
          >
            {formatGrowth(stat.growthRate)}
          </Badge>
        </div>
      </div>
    </Card>
  );
}

const managementLinks = [
  { title: 'مدیریت اخبار', description: 'ایجاد، ویرایش و انتشار خبرها', href: '/admin/block-news', icon: FileText },
  { title: 'مدیریت دوره‌ها', description: 'تعریف دوره و محتوای آموزشی', href: '/admin/courses', icon: GraduationCap },
  { title: 'کتابخانه دیجیتال', description: 'کنترل کتاب‌ها و وضعیت انتشار', href: '/admin/library', icon: BookOpen },
];

const adminTasks = [
  'بررسی خبرهای پیش‌نویس و زمان‌بندی انتشار',
  'تکمیل اطلاعات دوره‌های ناقص',
  'کنترل وضعیت کتاب‌های آرشیوشده',
  'مرور سفارش‌ها و پرداخت‌های اخیر',
];

export default function AdminDashboardPage() {
  const { user, isLoading } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);
  const { data: pipelineFunnel, isLoading: isPipelineLoading } = useCrmPipelineFunnel();
  const { data: leadConversion, isLoading: isLeadConversionLoading } = useLeadConversionStats('monthly');

  useEffect(() => {
    const loadStats = async () => {
      try {
        setStatsLoading(true);
        const { data } = await api.get('/api/admin/dashboard/stats');
        setStats(data.data);
        setStatsError(null);
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
        setStatsError('خطا در دریافت آمار داشبورد');
      } finally {
        setStatsLoading(false);
      }
    };

    if (user) {
      loadStats();
    }
  }, [user]);

  if (isLoading) {
    return <AdminLoadingState label="در حال آماده‌سازی داشبورد..." />;
  }

  if (!user) {
    return null;
  }

  const content = (
    <AdminPageShell
      title="داشبورد مدیریت"
      description={`خوش آمدید ${user.name}. نمای سریع از وضعیت فروش، کاربران و محتوای پلتفرم.`}
      actions={<Badge variant="secondary">{user.role}</Badge>}
    >
      {statsError && (
        <Card className="border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
          {statsError}
        </Card>
      )}

      {statsLoading ? (
        <AdminLoadingState label="در حال دریافت آمار..." />
      ) : stats ? (
        <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
          <StatCard title="بازدید ماه اخیر" value={numberFormatter.format(stats.totalViews.value)} stat={stats.totalViews} icon={Eye} />
          <StatCard title="درآمد ماه اخیر" value={formatMoney(stats.totalRevenue.value)} stat={stats.totalRevenue} icon={ShoppingCart} />
          <StatCard title="سفارش‌های پرداخت‌شده" value={numberFormatter.format(stats.totalOrders.value)} stat={stats.totalOrders} icon={FileText} />
          <StatCard title="کاربران جدید" value={numberFormatter.format(stats.totalUsers.value)} stat={stats.totalUsers} icon={Users} />
        </div>
      ) : null}

      <div className="grid gap-3 lg:grid-cols-3">
        {managementLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.href} className="flex min-h-36 flex-col justify-between p-4">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="rounded-xl bg-slate-100 p-2.5 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-1 text-right">
                  <h2 className="text-lg font-semibold text-slate-950 dark:text-white">{item.title}</h2>
                  <p className="text-xs leading-6 text-slate-500 dark:text-slate-400 sm:text-sm">{item.description}</p>
                </div>
              </div>
              <Button asChild variant="outline" size="sm" className="w-full justify-between">
                <Link href={item.href}>
                  ورود به بخش
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
        <Card className="p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <Badge variant="outline" className="border-blue-200 text-blue-700 dark:border-blue-900 dark:text-blue-300">
              امروز
            </Badge>
            <div className="flex items-center gap-2 text-right">
              <div>
                <h2 className="font-semibold text-slate-950 dark:text-white">کارهای پیشنهادی</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">برای اینکه پنل همیشه به‌روز بماند</p>
              </div>
              <ListChecks className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {adminTasks.map((task) => (
              <div
                key={task}
                className="flex items-start justify-end gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-right text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-200"
              >
                <span className="leading-6">{task}</span>
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <div className="text-right">
              <h2 className="font-semibold text-slate-950 dark:text-white">وضعیت پنل</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">خلاصه‌ی سلامت بخش‌های مدیریتی</p>
            </div>
          </div>
          <div className="space-y-2">
            {managementLinks.map((item) => (
              <div key={item.href} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-900/70">
                <Badge variant="secondary" className="text-[11px]">فعال</Badge>
                <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                  <span>{item.title}</span>
                  <Clock3 className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card className="min-w-0 p-4">
          <div className="flex h-full items-start justify-between gap-3">
            <div className="rounded-xl bg-muted p-2.5 text-primary">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0 flex-1 space-y-2 text-right">
              <p className="text-xs text-muted-foreground sm:text-sm">قیف فروش CRM</p>
              {isPipelineLoading ? (
                <p className="text-sm text-muted-foreground">در حال دریافت...</p>
              ) : (
                <p className="truncate text-lg font-bold text-foreground sm:text-xl">
                  {numberFormatter.format(
                    (pipelineFunnel ?? []).reduce((sum, stage) => sum + stage.dealCount, 0)
                  )}{' '}
                  معامله فعال
                </p>
              )}
              <Button asChild variant="outline" size="sm" className="w-full justify-between">
                <Link href="/admin/reports">
                  مشاهده گزارش کامل
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Card>

        <Card className="min-w-0 p-4">
          <div className="flex h-full items-start justify-between gap-3">
            <div className="rounded-xl bg-muted p-2.5 text-primary">
              <Percent className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0 flex-1 space-y-2 text-right">
              <p className="text-xs text-muted-foreground sm:text-sm">نرخ تبدیل سرنخ‌ها (ماه اخیر)</p>
              {isLeadConversionLoading ? (
                <p className="text-sm text-muted-foreground">در حال دریافت...</p>
              ) : (
                <p className="truncate text-lg font-bold text-foreground sm:text-xl">
                  {numberFormatter.format(leadConversion?.conversionRate ?? 0)}٪
                </p>
              )}
              <Button asChild variant="outline" size="sm" className="w-full justify-between">
                <Link href="/admin/reports">
                  مشاهده گزارش کامل
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </AdminPageShell>
  );

  return content;
}
