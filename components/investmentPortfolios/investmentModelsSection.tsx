"use client";

import { useState } from "react";
import {
  Building2,
  Globe,
  CheckCircle2,
  ArrowRight,
  FileSpreadsheet,
  Users,
  CreditCard,
  TrendingUp,
  Phone,
  MapPin,
  Mail,
  Clock,
  MessageCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/lib/hooks/use-media-query";

const InvestmentModelsSection = () => {
  const [openModal, setOpenModal] = useState<"in-person" | "online" | null>(
    null
  );
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Contact information
  const contactInfo = {
    "in-person": {
      title: "رزرو مشاوره حضوری",
      description: "برای رزرو مشاوره حضوری با ما تماس بگیرید",
      contacts: [
        {
          icon: Phone,
          title: "تلفن تماس",
          value: "021-12345678",
          link: "tel:02112345678",
        },
        {
          icon: Phone,
          title: "موبایل",
          value: "0912-345-6789",
          link: "tel:09123456789",
        },
        {
          icon: MapPin,
          title: "آدرس دفتر",
          value: "تهران، خیابان ولیعصر، پلاک 123",
          link: "https://maps.google.com",
        },
        {
          icon: Clock,
          title: "ساعت کاری",
          value: "شنبه تا چهارشنبه: 9 صبح تا 6 عصر",
        },
        {
          icon: Mail,
          title: "ایمیل",
          value: "info@pishro.com",
          link: "mailto:info@pishro.com",
        },
      ],
    },
    online: {
      title: "رزرو مشاوره آنلاین",
      description: "برای مشاوره آنلاین از طریق راه‌های زیر با ما در تماس باشید",
      contacts: [
        {
          icon: MessageCircle,
          title: "تلگرام",
          value: "@pishro_support",
          link: "https://t.me/pishro_support",
        },
        {
          icon: MessageCircle,
          title: "واتساپ",
          value: "0912-345-6789",
          link: "https://wa.me/989123456789",
        },
        {
          icon: Phone,
          title: "تلفن پشتیبانی",
          value: "021-87654321",
          link: "tel:02187654321",
        },
        {
          icon: Mail,
          title: "ایمیل",
          value: "online@pishro.com",
          link: "mailto:online@pishro.com",
        },
        {
          icon: Clock,
          title: "پشتیبانی آنلاین",
          value: "همه روزه: 8 صبح تا 12 شب",
        },
      ],
    },
  };

  // Render contact content
  const renderContactContent = (type: "in-person" | "online") => {
    const info = contactInfo[type];
    return (
      <div className="space-y-4 p-4">
        {info.contacts.map((contact, idx) => {
          const Icon = contact.icon;
          return (
            <div
              key={idx}
              className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-white shadow-sm flex items-center justify-center">
                <Icon className="text-mySecondary" size={24} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 mb-1">
                  {contact.title}
                </p>
                {contact.link ? (
                  <a
                    href={contact.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-mySecondary hover:underline"
                  >
                    {contact.value}
                  </a>
                ) : (
                  <p className="text-gray-700">{contact.value}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Function to scroll to calculator
  const scrollToCalculator = () => {
    const calculatorSection = document.getElementById("calculator-section");
    if (calculatorSection) {
      calculatorSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const models = [
    {
      type: "in-person" as const,
      title: "سرمایه‌گذاری حضوری",
      description:
        "برای سرمایه‌گذاران حرفه‌ای که تمایل به همکاری حضوری و مدیریت مستقیم سرمایه دارند",
      icon: Building2,
      color: "green",
      gradient: "from-green-500 to-emerald-600",
      features: [
        {
          icon: Users,
          title: "مشاوره حضوری",
          description: "جلسات مشاوره حضوری با کارشناسان مجرب",
        },
        {
          icon: CreditCard,
          title: "پرداخت حضوری",
          description: "پرداخت نقدی یا کارت به کارت در دفتر",
        },
        {
          icon: TrendingUp,
          title: "دریافت سود",
          description: "دریافت سود ماهیانه یا سررسید به صورت نقدی",
        },
        {
          icon: FileSpreadsheet,
          title: "گزارش‌های تخصصی",
          description: "دریافت گزارش‌های کامل سرمایه‌گذاری به صورت چاپی",
        },
      ],
      benefits: [
        "تضمین اصل سرمایه با سند رسمی",
        "پشتیبانی ۲۴ ساعته تلفنی",
        "امکان بازدید از دفتر مرکزی",
        "مشاوره رایگان قبل از سرمایه‌گذاری",
      ],
      cta: {
        text: "رزرو مشاوره حضوری",
        link: "/contact",
      },
    },
    {
      type: "online" as const,
      title: "سرمایه‌گذاری آنلاین",
      description:
        "برای سرمایه‌گذارانی که ترجیح می‌دهند از طریق سایت اقدام کنند و اطلاعات و سیگنال‌ها را به صورت دیجیتال دریافت کنند",
      icon: Globe,
      color: "blue",
      gradient: "from-blue-500 to-cyan-600",
      features: [
        {
          icon: CreditCard,
          title: "پرداخت آنلاین",
          description: "پرداخت امن از طریق درگاه بانکی",
        },
        {
          icon: FileSpreadsheet,
          title: "فایل اکسل اختصاصی",
          description: "دریافت فایل اکسل با سیگنال‌های معاملاتی",
        },
        {
          icon: TrendingUp,
          title: "به‌روزرسانی مستمر",
          description: "دریافت سیگنال‌ها و اطلاعات در پنل کاربری",
        },
        {
          icon: Users,
          title: "پشتیبانی آنلاین",
          description: "پشتیبانی سریع از طریق تلگرام و واتساپ",
        },
      ],
      benefits: [
        "دسترسی ۲۴/۷ به پنل کاربری",
        "دریافت فایل اکسل با فرمول‌های محاسباتی",
        "هزینه متناسب با سرمایه و مدت زمان",
        "امکان تمدید و ارتقای سبد",
      ],
      cta: {
        text: "شروع سرمایه‌گذاری آنلاین",
        link: "#calculator",
        isScroll: true, // Flag to indicate this should scroll
      },
    },
  ];

  return (
    <section className="w-full bg-gradient-to-br from-gray-50 via-white to-gray-50 py-16 md:py-24 mt-24">
      <div className="container-xl">
        {/* Header */}

        {/* Models Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {models.map((model) => {
            const Icon = model.icon;
            return (
              <div
                key={model.type}
                className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              >
                {/* Header با gradient */}
                <div
                  className={`bg-gradient-to-br ${model.gradient} p-8 text-white`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Icon size={32} />
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold">
                        {model.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-white/90 leading-relaxed">
                    {model.description}
                  </p>
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* Features */}
                  <div className="mb-8">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">
                      ویژگی‌ها
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                      {model.features.map((feature, idx) => {
                        const FeatureIcon = feature.icon;
                        return (
                          <div
                            key={idx}
                            className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
                          >
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
                              <FeatureIcon
                                className="text-mySecondary"
                                size={20}
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 mb-1">
                                {feature.title}
                              </p>
                              <p className="text-sm text-gray-600">
                                {feature.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="mb-8">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">
                      مزایا
                    </h4>
                    <ul className="space-y-3">
                      {model.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2
                            className="flex-shrink-0 mt-0.5 text-green-600"
                            size={20}
                          />
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() =>
                      model.type === "online"
                        ? scrollToCalculator()
                        : setOpenModal(model.type)
                    }
                    className={`group w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r ${model.gradient} text-white font-bold text-lg hover:shadow-lg transition-all`}
                  >
                    {model.cta.text}
                    <ArrowRight
                      className="group-hover:-translate-x-1 transition-transform"
                      size={20}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-gradient-to-r from-mySecondary/10 via-mySecondary/5 to-mySecondary/10 border-2 border-mySecondary/20 rounded-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-mySecondary/20 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-mySecondary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-gray-900 mb-2">توجه مهم</h4>
              <p className="text-gray-700 leading-relaxed">
                در مدل آنلاین، هزینه سبد متناسب با مبلغ سرمایه‌گذاری و مدت زمان
                انتخابی شما محاسبه می‌شود. فرمول دقیق محاسبه در آینده نزدیک به
                سیستم اضافه خواهد شد. پس از پرداخت، فایل اکسل شامل اطلاعات،
                سیگنال‌ها و فرمول‌های محاسباتی در پنل کاربری شما قرار می‌گیرد.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Modals/Drawers */}
        {openModal && (
          <>
            {isDesktop ? (
              <Dialog
                open={openModal !== null}
                onOpenChange={() => setOpenModal(null)}
              >
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-900 rtl">
                      {contactInfo[openModal].title}
                    </DialogTitle>
                    <DialogDescription className="text-base text-gray-600 rtl">
                      {contactInfo[openModal].description}
                    </DialogDescription>
                  </DialogHeader>
                  {renderContactContent(openModal)}
                </DialogContent>
              </Dialog>
            ) : (
              <Drawer
                open={openModal !== null}
                onOpenChange={() => setOpenModal(null)}
              >
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle className="text-2xl font-bold text-gray-900 rtl">
                      {contactInfo[openModal].title}
                    </DrawerTitle>
                    <DrawerDescription className="text-base text-gray-600 rtl">
                      {contactInfo[openModal].description}
                    </DrawerDescription>
                  </DrawerHeader>
                  {renderContactContent(openModal)}
                  <div className="h-8" />
                </DrawerContent>
              </Drawer>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default InvestmentModelsSection;
