'use client';

import Link from 'next/link';
import {
  Briefcase,
  Home,
  Info,
  LayoutTemplate,
  PieChart,
  TrendingUp,
} from 'lucide-react';
import { AdminPageShell } from '@/components/admin/AdminPageShell';
import { Card } from '@/components/ui/card';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';

const sections = [
  {
    href: '/admin/landing/home',
    title: 'صفحه اصلی',
    description: 'هیرو، آمار، ماشین‌حساب، اسلایدها، مینی‌اسلایدر و قدم‌های موبایل',
    icon: Home,
  },
  {
    href: '/admin/landing/about',
    title: 'درباره ما',
    description: 'متن هیرو، رزومه، تیم و گواهی‌نامه‌ها',
    icon: Info,
  },
  {
    href: '/admin/landing/business-consulting',
    title: 'مشاوره کسب‌وکار',
    description: 'عنوان، تصویر، تماس و محتوای مشاوره‌ها',
    icon: Briefcase,
  },
  {
    href: '/admin/landing/investment-plans',
    title: 'سبدهای سرمایه‌گذاری',
    description: 'صفحه سبدها، انواع پلن و تگ‌ها',
    icon: PieChart,
  },
  {
    href: '/admin/investment-funds',
    title: 'صندوق‌های سرمایه‌گذاری',
    description: 'نرخ‌ها و تنظیمات ماشین‌حساب صندوق‌ها',
    icon: TrendingUp,
  },
];

export default function LandingCmsHubPage() {
  const { user, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <AdminPageShell title="لندینگ / CMS" description="مدیریت محتوای صفحات مارکتینگ">
        <p className="text-sm text-muted-foreground">در حال بارگذاری...</p>
      </AdminPageShell>
    );
  }

  if (!user) return null;

  return (
    <AdminPageShell
      title="لندینگ / CMS"
      description="متن‌ها، تصاویر و بخش‌های صفحات عمومی را از اینجا ویرایش کنید."
    >
      <div className="mb-6 flex items-center gap-2 text-muted-foreground">
        <LayoutTemplate className="size-5" />
        <span className="text-sm">محتوای ذخیره‌شده در دیتابیس مستقیماً روی سایت عمومی اثر می‌گذارد.</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.href} href={section.href} className="group">
              <Card className="h-full p-5 transition-colors group-hover:border-primary/40 group-hover:bg-muted/30">
                <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-muted">
                  <Icon className="size-5" />
                </div>
                <h2 className="mb-1 text-base font-semibold">{section.title}</h2>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </Card>
            </Link>
          );
        })}
      </div>
    </AdminPageShell>
  );
}
