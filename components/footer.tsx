"use client";

import Link from "next/link";
import { Building2, Mail, MapPin, Phone } from "lucide-react";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";
import { RiTelegram2Fill } from "react-icons/ri";

import SiteLogo from "@/components/branding/SiteLogo";
import { useFooter } from "@/lib/hooks/useFooter";
import {
  DEFAULT_FOOTER_CONTENT,
  type ChromeLink,
  type FooterContent,
} from "@/lib/site/chrome-content";
import {
  filterNavByHiddenPages,
  isPathHidden,
} from "@/lib/site/hidable-pages";
import { cn } from "@/lib/utils";

type FooterProps = {
  logoUrl?: string;
  siteName?: string;
  hiddenPages?: string[];
  content?: FooterContent;
};

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: ChromeLink[];
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

function visibleLinks(links: ChromeLink[], hiddenPages: string[]) {
  return filterNavByHiddenPages(links, hiddenPages).filter(
    (item) => !isPathHidden(item.link.replace(/#.*$/, ""), hiddenPages)
  );
}

const Footer = ({
  logoUrl,
  siteName = "پیشرو",
  hiddenPages = [],
  content,
}: FooterProps) => {
  const { showFooter } = useFooter();

  if (!showFooter) return null;

  const footer = content || DEFAULT_FOOTER_CONTENT;
  const brandName = siteName?.trim() || "پیشرو";

  const discover = visibleLinks(footer.columns.discover.links, hiddenPages);
  const learn = visibleLinks(footer.columns.learn.links, hiddenPages);
  const invest = visibleLinks(footer.columns.invest.links, hiddenPages);
  const support = visibleLinks(footer.columns.support.links, hiddenPages);
  const legalLinks = visibleLinks(footer.legalLinks, hiddenPages);

  const socials = [
    {
      name: "اینستاگرام",
      href: footer.instagram,
      icon: FaInstagram,
      hover: "hover:text-[#E1306C]",
    },
    {
      name: "تلگرام",
      href: footer.telegram,
      icon: RiTelegram2Fill,
      hover: "hover:text-[#229ED9]",
    },
    {
      name: "ایکس",
      href: footer.twitter,
      icon: FaXTwitter,
      hover: "hover:text-foreground",
    },
  ];

  const contactRows = [
    {
      icon: Phone,
      label: "تلفن ثابت",
      value: footer.phone,
      href: `tel:${footer.phoneTel}`,
    },
    {
      icon: Phone,
      label: "موبایل",
      value: footer.mobile,
      href: `tel:${footer.mobileTel}`,
    },
    {
      icon: Mail,
      label: "ایمیل",
      value: footer.email,
      href: `mailto:${footer.email}`,
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
              {footer.aboutText}
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
                    {footer.address}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8 lg:gap-6">
            <FooterColumn title={footer.columns.discover.title} links={discover} />
            <FooterColumn title={footer.columns.learn.title} links={learn} />
            <FooterColumn title={footer.columns.invest.title} links={invest} />
            <FooterColumn title={footer.columns.support.title} links={support} />
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
                ساعات پاسخ‌گویی: {footer.weekdaysHours}
              </div>
            </div>

            <div className="flex flex-col items-center gap-3 text-xs text-muted-foreground md:items-end">
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 md:justify-end">
                {legalLinks.map((item) => (
                  <Link
                    key={`${item.label}-${item.link}`}
                    href={item.link}
                    className="transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <p className="text-center md:text-left">
                © {new Date().getFullYear()} {brandName}. {footer.copyrightSuffix}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
