import type { Metadata } from "next";
import Link from "next/link";
import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import { contactInfo } from "@/lib/constants/contact";

export const metadata: Metadata = {
  title: "تماس با ما | پیشرو",
  description: "راه‌های ارتباطی با مؤسسه پیشرو برای پشتیبانی، مشاوره و همکاری",
};

const channels = [
  {
    icon: Phone,
    title: "تلفن ثابت",
    value: contactInfo.phone,
    href: `tel:${contactInfo.phoneTel}`,
  },
  {
    icon: Phone,
    title: "موبایل",
    value: contactInfo.mobile,
    href: `tel:${contactInfo.mobileTel}`,
  },
  {
    icon: Mail,
    title: "ایمیل",
    value: contactInfo.email,
    href: `mailto:${contactInfo.email}`,
  },
  {
    icon: MapPin,
    title: "آدرس",
    value: contactInfo.address,
    href: undefined,
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-[70vh] bg-background text-foreground" dir="rtl">
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-primary/10 via-transparent to-emerald-500/5" />
        <div className="container-md relative py-16 sm:py-20">
          <p className="mb-3 text-sm font-semibold text-primary">ارتباط با پیشرو</p>
          <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            تماس با ما
          </h1>
          <p className="max-w-2xl text-sm leading-8 text-muted-foreground sm:text-base">
            برای پشتیبانی دوره‌ها، مشاوره سرمایه‌گذاری یا همکاری سازمانی از
            راه‌های زیر با ما در ارتباط باشید. معمولاً در ساعات کاری پاسخ‌گو هستیم.
          </p>
        </div>
      </section>

      <section className="container-md grid gap-6 py-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          {channels.map((item) => {
            const Icon = item.icon;
            const content = (
              <div className="h-full rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30">
                <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <h2 className="mb-1 text-base font-semibold">{item.title}</h2>
                <p className="text-sm leading-7 text-muted-foreground">{item.value}</p>
              </div>
            );
            return item.href ? (
              <Link key={item.title} href={item.href} className="block">
                {content}
              </Link>
            ) : (
              <div key={item.title}>{content}</div>
            );
          })}
        </div>

        <aside className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-muted text-foreground">
            <Clock3 className="size-5" />
          </div>
          <h2 className="mb-2 text-lg font-semibold">ساعات پاسخ‌گویی</h2>
          <ul className="space-y-2 text-sm leading-7 text-muted-foreground">
            <li>روزهای کاری: {contactInfo.businessHours.weekdays}</li>
            <li>تعطیلات: {contactInfo.businessHours.weekends}</li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/business-consulting"
              className="inline-flex items-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              درخواست مشاوره
            </Link>
            <Link
              href="/faq"
              className="inline-flex items-center rounded-xl border border-border px-4 py-2.5 text-sm font-semibold"
            >
              سوالات متداول
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}
