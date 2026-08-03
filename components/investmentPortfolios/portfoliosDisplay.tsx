"use client";

import { Shield, TrendingUp, Zap, CheckCircle2 } from "lucide-react";
import { useInvestmentFunds } from "@/lib/hooks/useInvestmentFunds";

const CARD_THEMES = [
  { icon: Shield, color: "green", gradient: "from-primary to-primary" },
  { icon: TrendingUp, color: "yellow", gradient: "from-premium to-premium" },
  { icon: Zap, color: "red", gradient: "from-destructive to-destructive" },
];

const getBorderColor = (color: string) => {
  switch (color) {
    case "green":
      return "border-primary hover:border-primary";
    case "yellow":
      return "border-premium hover:border-premium";
    case "red":
      return "border-destructive hover:border-destructive";
    default:
      return "border-border dark:border-borderColor";
  }
};

const getTextColor = (color: string) => {
  switch (color) {
    case "green":
      return "text-primary";
    case "yellow":
      return "text-premium";
    case "red":
      return "text-destructive";
    default:
      return "text-muted-foreground dark:text-textSecondary";
  }
};

const PortfoliosDisplay = () => {
  const { data: funds, isLoading } = useInvestmentFunds();

  return (
    <section className="w-full py-16 md:py-24">
      <div className="container-xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground dark:text-textPrimary mb-4">
            انتخاب صندوق سرمایه‌ گذاری
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground dark:text-textSecondary max-w-3xl mx-auto">
            بر اساس هدف سرمایه‌ گذاری خود، یکی از صندوق‌های زیر را انتخاب کنید
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground dark:text-textSecondary">
            در حال بارگذاری صندوق‌ها...
          </div>
        ) : (
          /* Funds Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {(funds ?? []).map((fund, idx) => {
              const theme = CARD_THEMES[idx % CARD_THEMES.length];
              const Icon = theme.icon;
              return (
                <div
                  key={fund.id}
                  className={`public-page-card relative rounded-3xl border-2 ${getBorderColor(
                    theme.color
                  )} p-6 md:p-8 hover:-translate-y-1 hover:shadow-xl transition-all duration-300`}
                >
                  {/* Icon with gradient background */}
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center mb-6 shadow-lg`}
                  >
                    <Icon className="text-primary-foreground" size={32} />
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-2xl font-bold text-foreground dark:text-textPrimary mb-2 tracking-widest">
                    {fund.name}
                  </h3>
                  {fund.description && (
                    <p className="text-muted-foreground dark:text-textSecondary mb-6">{fund.description}</p>
                  )}

                  {/* Monthly Return */}
                  <div className="mb-6 p-4 bg-muted dark:bg-darkBgHidden rounded-xl">
                    <p className="text-sm text-muted-foreground dark:text-textSecondary mb-1">بازدهی ماهیانه</p>
                    <p className={`text-3xl font-bold ${getTextColor(theme.color)}`}>
                      {(fund.monthlyRate * 100).toFixed(0)}٪
                    </p>
                  </div>

                  {/* Features — derived from the fund's own duration constraints */}
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle2
                        className={`flex-shrink-0 mt-0.5 ${getTextColor(theme.color)}`}
                        size={20}
                      />
                      <span className="text-muted-foreground dark:text-textPrimary text-sm">
                        حداقل مدت سرمایه‌ گذاری {fund.minDuration} ماه
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2
                        className={`flex-shrink-0 mt-0.5 ${getTextColor(theme.color)}`}
                        size={20}
                      />
                      <span className="text-muted-foreground dark:text-textPrimary text-sm">
                        سود {(fund.monthlyRate * 100).toFixed(0)}٪ ماهیانه
                      </span>
                    </li>
                  </ul>
                </div>
              );
            })}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-12 rounded-2xl border border-primary bg-primary p-6 md:p-8/60/30">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center/50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-bold text-primary mb-2">نکته مهم</h4>
              <p className="text-primary leading-relaxed">
                تمامی صندوق‌های سرمایه‌ گذاری پیشرو با تضمین اصل سرمایه ارائه
                می‌شوند. سود هر صندوق متناسب با مبلغ سرمایه‌ گذاری و مدت زمان
                انتخابی شما محاسبه خواهد شد.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfoliosDisplay;
