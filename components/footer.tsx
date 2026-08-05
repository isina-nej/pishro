"use client";

import Link from "next/link";
import {
  Building2,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";
import { RiTelegram2Fill } from "react-icons/ri";

import SiteLogo from "@/components/branding/SiteLogo";
import { useFooter } from "@/lib/hooks/useFooter";
import { contactInfo } from "@/lib/constants/contact";
import {
  filterNavByHiddenPages,
  isPathHidden,
} from "@/lib/site/hidable-pages";
import { cn } from "@/lib/utils";

type FooterProps = {
  logoUrl?: string;
  siteName?: string;
  hiddenPages?: string[];
};

type FooterLink = { label: string; link: string };

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: FooterLink[];
}) {
  if (!links.length) return null;

  return (
    <div>
      <h3 className="mb-4 text-[11px] font-bold tracking-[0.14em] text-primary">
        {title}
      </h3>
      <ul className="flex flex-col gap-2.5">
        {links.map((item) => (
          <li key={`${item.label}-${item.link}`}>
            <Link
              href={item.link}
              className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="h-px w-0 bg-primary transition-all duration-300 group-hover:w-3" />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const Footer = ({
  logoUrl,
  siteName = "پیشرو",
  hiddenPages = [],
}: FooterProps) => {
  const { showFooter } = useFooter();

  if (!showFooter) return null;

  const brandName = siteName?.trim() || "پیشرو";

  const discover = filterNavByHiddenPages(
    [
      { label: "صفحه اصلی", link: "/" },
      { label: "اخبار", link: "/news" },
      { label: "درباره ما", link: "/about-us" },
      { label: "همایش‌ها", link: "/skyroom-classes" },
    ],
    hiddenPages
  );

  const learn = filterNavByHiddenPages(
    [
      { label: "دوره‌های آموزشی", link: "/courses" },
      { label: "کتابخانه دیجیتال", link: "/library" },
      { label: "کریپتو", link: "/courses/cryptocurrency" },
      { label: "بورس", link: "/courses/stock-market" },
    ],
    hiddenPages
  );

  const invest = filterNavByHiddenPages(
    [
      { label: "قیمت ارزها", link: "/crypto-prices" },
      { label: "سبدهای سرمایه‌گذاری", link: "/investment-plans" },
      { label: "مشاوره کسب‌وکار", link: "/business-consulting" },
    ],
    hiddenPages
  );

  const support = [
    { label: "سوالات متداول", link: "/faq" },
    { label: "شیوه ثبت سفارش", link: "/faq#order" },
    { label: "شیوه‌های پرداخت", link: "/faq#payment" },
  ].filter((item) => !isPathHidden(item.link.replace(/#.*$/, ""), hiddenPages));

  const socials = [
    {
      name: "اینستاگرام",
      href: contactInfo.socials.instagram,
      icon: FaInstagram,
      hover: "hover:text-[#E1306C]",
    },
    {
      name: "تلگرام",
      href: contactInfo.socials.telegram,
      icon: RiTelegram2Fill,
      hover: "hover:text-[#229ED9]",
    },
    {
      name: "ایکس",
      href: contactInfo.socials.linkedin,
      icon: FaXTwitter,
      hover: "hover:text-foreground",
    },
  ];

  const contactRows = [
    {
      icon: Phone,
      label: "تلفن ثابت",
      value: contactInfo.phone,
      href: `tel:${contactInfo.phoneTel}`,
    },
    {
      icon: Phone,
      label: "موبایل",
      value: contactInfo.mobile,
      href: `tel:${contactInfo.mobileTel}`,
    },
    {
      icon: Mail,
      label: "ایمیل",
      value: contactInfo.email,
      href: `mailto:${contactInfo.email}`,
    },
  ];

  return (
    <footer className="relative mt-16 w-full overflow-hidden border-t border-border bg-secondary/40 text-foreground">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 50% at 100% 0%, hsl(var(--primary) / 0.08), transparent 55%), radial-gradient(ellipse 45% 40% at 0% 100%, hsl(var(--premium) / 0.07), transparent 50%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-primary/35 to-transparent"
        aria-hidden="true"
      />

      <div className="container-xl relative">
        <div className="grid gap-10 px-4 pb-10 pt-14 sm:px-6 md:gap-12 md:pt-16 lg:grid-cols-12 lg:px-10">
          <div className="space-y-6 lg:col-span-4">
            <SiteLogo logoUrl={logoUrl} siteName={brandName} className="h-10 w-[128px]" />
            <p className="max-w-sm text-sm leading-7 text-muted-foreground">
              {brandName} ارائه‌دهنده آموزش مالی، ابزارهای سرمایه‌گذاری و محتوای تخصصی
              برای تصمیم‌گیری آگاهانه‌تر در بازارهای مالی است.
            </p>

            <div className="flex flex-wrap gap-2">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className={cn(
                      "inline-flex size-10 items-center justify-center rounded-xl border border-border/80 bg-card/60 text-muted-foreground backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card",
                      social.hover
                    )}
                  >
                    <Icon className="size-[18px]" />
                  </Link>
                );
              })}
            </div>

            <div className="space-y-3 rounded-2xl border border-border/70 bg-card/50 p-4 backdrop-blur-sm">
              {contactRows.map((row) => {
                const Icon = row.icon;
                return (
                  <Link
                    key={row.label}
                    href={row.href}
                    className="group flex items-start gap-3 transition-colors"
                  >
                    <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="size-3.5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11px] text-muted-foreground">{row.label}</span>
                      <span
                        className="block truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary"
                        dir="ltr"
                      >
                        {row.value}
                      </span>
                    </span>
                  </Link>
                );
              })}
              <div className="flex items-start gap-3 pt-1">
                <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-premium/15 text-premium">
                  <MapPin className="size-3.5" />
                </span>
                <span>
                  <span className="block text-[11px] text-muted-foreground">آدرس</span>
                  <span className="block text-sm leading-6 text-foreground">
                    {contactInfo.address}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8 lg:gap-6">
            <FooterColumn title="کاوش" links={discover} />
            <FooterColumn title="آموزش" links={learn} />
            <FooterColumn title="سرمایه‌گذاری" links={invest} />
            <FooterColumn title="پشتیبانی" links={support} />
          </div>
        </div>

        <div className="border-t border-border/80 px-4 py-6 sm:px-6 lg:px-10">
          <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
            <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <a
                referrerPolicy="origin"
                target="_blank"
                rel="noopener noreferrer"
                href="https://trustseal.enamad.ir/?id=4965732&Code=Ey50OxJxpgFGnTsrvUy8QMpXTuLCb930"
                className="inline-flex items-center justify-center rounded-xl border border-border/80 bg-card/60 px-3 py-2 transition-colors hover:border-primary/40"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  referrerPolicy="origin"
                  src="/images/e-namad.png"
                  alt="نماد اعتماد الکترونیک"
                  width={52}
                  height={52}
                />
              </a>
              <div className="hidden items-center gap-2 text-[11px] text-muted-foreground sm:flex">
                <Building2 className="size-3.5 text-primary" />
                ساعات پاسخ‌گویی: {contactInfo.businessHours.weekdays}
              </div>
            </div>

            <div className="flex flex-col items-center gap-3 text-xs text-muted-foreground md:items-end">
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 md:justify-end">
                {!isPathHidden("/about-us", hiddenPages) && (
                  <Link href="/about-us" className="transition-colors hover:text-primary">
                    قوانین و مقررات
                  </Link>
                )}
                {!isPathHidden("/faq", hiddenPages) && (
                  <Link href="/faq" className="transition-colors hover:text-primary">
                    سوالات متداول
                  </Link>
                )}
                {!isPathHidden("/about-us", hiddenPages) && (
                  <Link href="/about-us" className="transition-colors hover:text-primary">
                    حریم خصوصی
                  </Link>
                )}
              </div>
              <p className="text-center md:text-left">
                © {new Date().getFullYear()} {brandName}. تمامی حقوق محفوظ است.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
