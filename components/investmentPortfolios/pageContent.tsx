"use client";

import CalculatorSection from "./calculatorSection";
import PortfoliosDisplay from "./portfoliosDisplay";
import PortfolioSelectionForm from "./portfolioSelectionForm";
import InvestmentModelsSection from "./investmentModelsSection";

const PageContent = () => {
  return (
    <div className="w-full">
      {/* Hero Section با ماشین حساب */}
      <CalculatorSection />

      {/* نمایش سه سبد با قیمت و توضیحات */}
      <PortfoliosDisplay />

      {/* فرم انتخاب سبد */}
      <PortfolioSelectionForm />

      {/* توضیحات دو مدل سرمایه‌ گذاری */}
      <InvestmentModelsSection />
    </div>
  );
};

export default PageContent;
