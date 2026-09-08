import type { Metadata } from "next";
import Link from "next/link";
import { contactInfo } from "@/lib/constants/contact";
import {
  getPublicContent,
  getPublicSiteChrome,
} from "@/lib/services/settings-service";
import { DynamicIcon } from "@/components/site/DynamicIcon";

export const metadata: Metadata = {
  title: "تماس با ما | پیشرو",
  description: "راه‌های ارتباطی با مؤسسه پیشرو برای پشتیبانی، مشاوره و همکاری",
};

export default async function ContactPage() {
  const [content, chrome] = await Promise.all([
    getPublicContent(),
    getPublicSiteChrome(),
  ]);

  const copy = (key: string, fallback = "") =>
    content["contact"]?.[key] || fallback;

  const phone = chrome.footerContent.phone || contactInfo.phone;
  const phoneTel = chrome.footerContent.phoneTel || contactInfo.phoneTel;
  const mobile = chrome.footerContent.mobile || contactInfo.mobile;
  const mobileTel = chrome.footerContent.mobileTel || contactInfo.mobileTel;
  const email = chrome.footerContent.email || contactInfo.email;
  const address = chrome.footerContent.address || contactInfo.address;
  const weekdaysHours = chrome.footerContent.weekdaysHours || contactInfo.businessHours.weekdays;
  const weekendsHours = chrome.footerContent.weekendsHours || contactInfo.businessHours.weekends;

  const channels = [
    {
      iconName: copy("phoneIcon", "Phone"),
      title: copy("phoneLabel", "تلفن ثابت"),
      value: phone,
      href: phoneTel ? `tel:${phoneTel}` : undefined,
    },
    {
      iconName: copy("mobileIcon", "Smartphone"),
      title: copy("mobileLabel", "موبایل"),
      value: mobile,
      href: mobileTel ? `tel:${mobileTel}` : undefined,
    },
    {
      iconName: copy("emailIcon", "Mail"),
      title: copy("emailLabel", "ایمیل"),
      value: email,
      href: email ? `mailto:${email}` : undefined,
    },
    {
      iconName: copy("addressIcon", "MapPin"),
      title: copy("addressLabel", "آدرس"),
      value: address,
      href: undefined,
    },
  ];

  return (
    <main className="min-h-[70vh] bg-background text-foreground" dir="rtl">
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-primary/10 via-transparent to-emerald-500/5" />
        <div className="container-md relative py-16 sm:py-20">
          <p className="mb-3 text-sm font-semibold text-primary">
            {copy("badge", "ارتباط با پیشرو")}
          </p>
          <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {copy("title", "تماس با ما")}
          </h1>
          <p className="max-w-2xl text-sm leading-8 text-muted-foreground sm:text-base">
            {copy(
              "description",
              "برای پشتیبانی دوره‌ها، مشاوره سرمایه‌گذاری یا همکاری سازمانی از راه‌های زیر با ما در ارتباط باشید. معمولاً در ساعات کاری پاسخ‌گو هستیم."
            )}
          </p>
        </div>
      </section>

      <section className="container-md grid gap-6 py-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          {channels.map((item) => {
            const contentCard = (
              <div className="h-full rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30">
                <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <DynamicIcon name={item.iconName} className="size-5" />
                </div>
                <h2 className="mb-1 text-base font-semibold">{item.title}</h2>
                <p className="text-sm leading-7 text-muted-foreground">{item.value}</p>
              </div>
            );
            return item.href ? (
              <Link key={item.title} href={item.href} className="block">
                {contentCard}
              </Link>
            ) : (
              <div key={item.title}>{contentCard}</div>
            );
          })}
        </div>

        <aside className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-muted text-foreground">
            <DynamicIcon name={copy("hoursIcon", "Clock")} className="size-5" />
          </div>
          <h2 className="mb-2 text-lg font-semibold">{copy("hoursTitle", "ساعات پاسخ‌گویی")}</h2>
          <ul className="space-y-2 text-sm leading-7 text-muted-foreground">
            <li>{copy("weekdaysLabel", "روزهای کاری")}: {weekdaysHours}</li>
            <li>{copy("weekendsLabel", "تعطیلات")}: {weekendsHours}</li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={copy("consultationLink", "/business-consulting")}
              className="inline-flex items-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              {copy("consultation", "درخواست مشاوره")}
            </Link>
            <Link
              href={copy("faqLink", "/faq")}
              className="inline-flex items-center rounded-xl border border-border px-4 py-2.5 text-sm font-semibold"
            >
              {copy("faq", "سوالات متداول")}
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}
