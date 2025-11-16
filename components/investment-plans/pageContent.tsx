"use client";

import { InvestmentPlansHero } from "./investmentPlansHero";
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

      {/* Investment Models Section */}
      <InvestmentModelsSection />

      {/* Portfolios Display from investment-portfolios */}
      <PortfoliosDisplay />

      {/* Portfolio Selection Form with Add to Cart Button */}
      <PortfolioSelectionForm />
    </div>
  );
};

export default InvestmentPlansPageContent;
