"use client";

import Link from "next/link";
import React from "react";
import { PiInstagramLogoThin } from "react-icons/pi";

import SiteLogo from "@/components/branding/SiteLogo";
import { useFooter } from "@/lib/hooks/useFooter";
import { contactInfo } from "@/lib/constants/contact";
import {
  filterNavByHiddenPages,
  isPathHidden,
} from "@/lib/site/hidable-pages";

type FooterProps = {
  logoUrl?: string;
  siteName?: string;
  hiddenPages?: string[];
};

const Footer = ({
  logoUrl,
  siteName,
  hiddenPages = [],
}: FooterProps) => {
  const { showFooter } = useFooter();

  if (!showFooter) return null;

  const socials = [
    {
      icon: <PiInstagramLogoThin />,
      link: contactInfo.socials.instagram,
      name: "اینستاگرام",
    },
  ];

  const categories = filterNavByHiddenPages(
    [
      { label: "کریپتو", link: "/courses/cryptocurrency" },
      { label: "بورس", link: "/courses/stock-market" },
      { label: "متاورس", link: "/courses/metaverse" },
      { label: "NFT", link: "/courses/nft" },
      { label: "ایردراپ", link: "/courses/airdrop" },
    ],
    hiddenPages
  );

  const customerService = filterNavByHiddenPages(
    [
      { label: "سوال دارید؟", link: "/faq" },
      { label: "درباره ما", link: "/about-us" },
    ],
    hiddenPages
  );

  const shoppingGuide = [
    { label: "شیوه ثبت سفارش", link: "/faq#order" },
    { label: "شیوه های پرداخت", link: "/faq#payment" },
  ].filter((item) => !isPathHidden(item.link.replace(/#.*$/, ""), hiddenPages));

  return (
    <footer className="w-full bg-card dark:bg-footerBg mt-8 border-t border-border dark:border-borderColor">
      {/* Main Footer Content */}
      <div className="container-xl">
        <div className="pt-12 md:pt-16 pb-8 md:pb-12 xl:px-10">
          <div className="flex flex-col md:grid md:grid-cols-4 lg:grid-cols-10 gap-8 md:gap-12">
            {/* بخش سمت چپ - Logo & Contact */}
            <div className="md:col-span-2 lg:col-span-3 space-y-6">
              <div className="flex flex-row md:flex-col-reverse">
                <div className="flex-1">
                  <p className="text-sm font-medium text-primary mb-2 md:mt-6">
                    پشتیبانی و تماس
                  </p>
                  <Link
                    href={`tel:${contactInfo.phoneTel}`}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors block mb-1"
                  >
                    تلفن:{contactInfo.phone}
                  </Link>
                  <Link
                    href={`tel:${contactInfo.mobileTel}`}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors block"
                  >
                    موبایل:{contactInfo.mobile}
                  </Link>
                </div>
                <div className="flex-1 md:ml-auto">
                  <SiteLogo logoUrl={logoUrl} siteName={siteName} />
                </div>
              </div>

              {/* Social Media */}
              <div>
                <p className="text-xs text-muted-foreground mb-3">
                  ما را در شبکه‌های اجتماعی دنبال کنید
                </p>
                <div className="flex flex-wrap gap-2">
                  {socials.map((social, index) => (
                    <Link
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      key={index}
                      aria-label={social.name}
                      className="size-9 flex justify-center items-center rounded-md border border-border hover:bg-primary hover:border-primary group transition-all duration-200"
                    >
                      {React.cloneElement(social.icon, {
                        className:
                          "size-5 text-muted-foreground group-hover:text-primary-foreground transition-colors",
                      })}
                    </Link>
                  ))}
                </div>
              </div>

              {/* {/* Newsletter */}
              {/* <div className="w-full">
                <p className="text-xs text-[#495157] mb-3 font-medium">
                  از پیشرو بروز باشید
                </p>
                <form onSubmit={handleNewsletterSubmit} className="relative">
                  <Input
                    type="email"
                    placeholder="ایمیل خود را وارد کنید"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 rounded-md border border-[#D7D7D7] text-xs px-3 pr-12 focus:border-myPrimary focus:ring-1 focus:ring-myPrimary"
                  />
                  <button
                    type="submit"
                    className="absolute left-1 top-1 h-8 px-4 bg-myPrimary text-foreground text-xs rounded-md hover:bg-myPrimary/90 transition-colors font-medium"
                  >
                    عضویت
                  </button>
                </form>
              </div>  */}
            </div>

            {/* بخش وسط و راست - در موبایل کنار هم */}
            <div className="md:col-span-2 lg:col-span-4 grid grid-cols-2 md:contents gap-6 md:gap-0">
              {/* بخش وسط - Categories */}
              <div className="md:col-span-1 lg:col-span-2 space-y-6">
                <div>
                  <h6 className="text-sm font-semibold text-primary mb-4">
                    دسته بندی ها
                  </h6>
                  <ul className="flex flex-col gap-3">
                    {categories.map((category, index) => (
                      <li key={index}>
                        <Link
                          href={category.link}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {category.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* بخش راست - Services & Guide */}
              <div className="md:col-span-1 lg:col-span-2 space-y-6">
                <div>
                  <h6 className="text-sm font-semibold text-primary mb-4">
                    خدمات مشتریان
                  </h6>
                  <ul className="flex flex-col gap-3">
                    {customerService.map((item, index) => (
                      <li key={index}>
                        <Link
                          href={item.link}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h6 className="text-sm font-semibold text-primary mb-4">
                    راهنمای خرید
                  </h6>
                  <ul className="flex flex-col gap-3">
                    {shoppingGuide.map((item, index) => (
                      <li key={index}>
                        <Link
                          href={item.link}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* بخش آخر - About */}
            <div className="md:col-span-4 lg:col-span-3 space-y-6">
              <div>
                <h5 className="text-sm font-semibold text-primary mb-4">
                  درباره پیشرو
                </h5>
                <p className="text-xs text-muted-foreground leading-6 max-w-lg">
                  پیشرو ارائه‌دهنده خدمات حرفه‌ای در زمینه آموزش مالی و سرمایه‌
                  گذاری است. با ارائه منابع آموزشی، مشاوره‌های حرفه‌ای و
                  ابزارهای کارآمد، هدف ما ارتقاء دانش مالی شما و دستیابی به
                  فرصت‌های سرمایه‌ گذاری هوشمندانه است.
                </p>
              </div>

              {/* Certificates */}
              <div className="flex flex-wrap w-full justify-evenly sm:justify-start gap-2">
                <a
                  referrerPolicy="origin"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://trustseal.enamad.ir/?id=4965732&Code=Ey50OxJxpgFGnTsrvUy8QMpXTuLCb930"
                  className="flex justify-center items-center rounded-md border border-border px-3 py-2 hover:border-primary transition-colors cursor-pointer"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    referrerPolicy="origin"
                    src="/images/e-namad.png"
                    alt="نماد اعتماد الکترونیک"
                    width={60}
                    height={60}
                    style={{ cursor: "pointer" }}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-border dark:border-borderColor py-4 md:py-6 xl:px-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <p className="text-center md:text-right">
              © {new Date().getFullYear()} پیشرو سرمایه. تمامی حقوق محفوظ است.
            </p>
            <div className="flex flex-wrap justify-center md:justify-end gap-4">
              {!isPathHidden("/about-us", hiddenPages) && (
                <Link
                  href="/about-us"
                  className="hover:text-primary transition-colors"
                >
                  قوانین و مقررات
                </Link>
              )}
              {!isPathHidden("/faq", hiddenPages) && (
                <Link
                  href="/faq"
                  className="hover:text-primary transition-colors"
                >
                  سوالات متداول
                </Link>
              )}
              {!isPathHidden("/about-us", hiddenPages) && (
                <Link
                  href="/about-us"
                  className="hover:text-primary transition-colors"
                >
                  حریم خصوصی
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
