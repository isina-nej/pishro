"use client";

import { Shield, TrendingUp, Zap, CheckCircle2 } from "lucide-react";

const PortfoliosDisplay = () => {
  const portfolios = [
    {
      id: "low-risk",
      name: "سبد کم‌ریسک",
      riskLevel: "low" as const,
      monthlyReturn: 7,
      description: "برای سرمایه‌گذاران محافظه‌کار با تضمین اصل سرمایه",
      icon: Shield,
      color: "green",
      gradient: "from-green-500 to-emerald-600",
      features: [
        "تضمین ۱۰۰٪ اصل سرمایه",
        "سود ثابت ۷٪ ماهیانه",
        "مناسب برای سرمایه‌گذاری بلندمدت",
        "ریسک بسیار پایین",
      ],
      price: null, // قیمت بعداً اضافه می‌شود
    },
    {
      id: "medium-risk",
      name: "سبد متوسط",
      riskLevel: "medium" as const,
      monthlyReturn: 8,
      description: "تعادل مناسب بین ریسک و بازدهی",
      icon: TrendingUp,
      color: "yellow",
      gradient: "from-yellow-500 to-orange-500",
      features: [
        "تضمین ۱۰۰٪ اصل سرمایه",
        "سود ثابت ۸٪ ماهیانه",
        "متعادل و مناسب برای اکثر سرمایه‌گذاران",
        "ریسک متوسط",
      ],
      price: null,
      recommended: true, // پیشنهاد ویژه
    },
    {
      id: "high-risk",
      name: "سبد پرریسک",
      riskLevel: "high" as const,
      monthlyReturn: 11,
      description: "برای سرمایه‌گذاران با ریسک‌پذیری بالا",
      icon: Zap,
      color: "red",
      gradient: "from-red-500 to-rose-600",
      features: [
        "تضمین اصل سرمایه",
        "بازدهی بین ۵٪ تا ۵۰٪ ماهیانه",
        "پتانسیل سود بالا",
        "ریسک بالا با مدیریت حرفه‌ای",
      ],
      price: null,
    },
  ];

  const getBorderColor = (color: string) => {
    switch (color) {
      case "green":
        return "border-green-200 hover:border-green-400";
      case "yellow":
        return "border-orange-200 hover:border-orange-400";
      case "red":
        return "border-red-200 hover:border-red-400";
      default:
        return "border-gray-200";
    }
  };

  const getTextColor = (color: string) => {
    switch (color) {
      case "green":
        return "text-green-600";
      case "yellow":
        return "text-orange-600";
      case "red":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <section className="w-full bg-gray-50 py-16 md:py-24">
      <div className="container-xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            انتخاب سبد سرمایه‌گذاری
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            بر اساس میزان ریسک‌پذیری خود، یکی از سبدهای زیر را انتخاب کنید
          </p>
        </div>

        {/* Portfolios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {portfolios.map((portfolio) => {
            const Icon = portfolio.icon;
            return (
              <div
                key={portfolio.id}
                className={`relative bg-white rounded-2xl border-2 ${getBorderColor(
                  portfolio.color
                )} p-6 md:p-8 hover:shadow-xl transition-all duration-300 ${
                  portfolio.recommended ? "ring-2 ring-orange-400" : ""
                }`}
              >
                {/* Recommended Badge */}
                {portfolio.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                    پیشنهاد ویژه
                  </div>
                )}

                {/* Icon with gradient background */}
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${portfolio.gradient} flex items-center justify-center mb-6 shadow-lg`}
                >
                  <Icon className="text-white" size={32} />
                </div>

                {/* Title & Description */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {portfolio.name}
                </h3>
                <p className="text-gray-600 mb-6">{portfolio.description}</p>

                {/* Monthly Return */}
                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">بازدهی ماهیانه</p>
                  <p
                    className={`text-3xl font-bold ${getTextColor(
                      portfolio.color
                    )}`}
                  >
                    {portfolio.monthlyReturn}٪
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {portfolio.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2
                        className={`flex-shrink-0 mt-0.5 ${getTextColor(
                          portfolio.color
                        )}`}
                        size={20}
                      />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Price - اختیاری برای آینده */}
                {portfolio.price && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">هزینه سبد</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {new Intl.NumberFormat("fa-IR").format(portfolio.price)}{" "}
                      <span className="text-base font-normal text-gray-500">
                        تومان
                      </span>
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Info Box */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-2xl p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-blue-600"
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
            <div>
              <h4 className="text-lg font-bold text-blue-900 mb-2">
                نکته مهم
              </h4>
              <p className="text-blue-800 leading-relaxed">
                تمامی سبدهای سرمایه‌گذاری پیشرو با تضمین اصل سرمایه ارائه می‌شوند.
                هزینه هر سبد متناسب با مبلغ سرمایه‌گذاری و مدت زمان انتخابی شما
                محاسبه خواهد شد.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfoliosDisplay;
