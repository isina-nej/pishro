"use client";

import { InvestmentPlansHero } from "./investmentPlansHero";
import CalculatorSection from "@/components/investmentPortfolios/calculatorSection";
import PortfoliosDisplay from "@/components/investmentPortfolios/portfoliosDisplay";
import PortfolioSelectionForm from "@/components/investmentPortfolios/portfolioSelectionForm";
import InvestmentModelsSection from "@/components/investmentPortfolios/investmentModelsSection";
import { InvestmentPlans, InvestmentPlan, InvestmentTag } from "@prisma/client";

interface InvestmentPlansPageContentProps {
  investmentPlansData: InvestmentPlans & {
    plans: InvestmentPlan[];
    tags: InvestmentTag[];
  };
}

const InvestmentPlansPageContent = ({
  investmentPlansData,
}: InvestmentPlansPageContentProps) => {
  return (
    <div>
      {/* Hero Section - New Design */}
      <InvestmentPlansHero investmentPlansData={investmentPlansData} />

      {/* Calculator Section with ID for scroll targeting */}
      <CalculatorSection />

      {/* Investment Models Section - with scroll to calculator */}
      <InvestmentModelsSection />

      {/* Portfolios Display from investment-portfolios */}
      <PortfoliosDisplay />

      {/* Portfolio Selection Form from investment-portfolios */}
      <div id="portfolio-selection">
        <PortfolioSelectionForm />
      </div>
    </div>
  );
};

export default InvestmentPlansPageContent;
