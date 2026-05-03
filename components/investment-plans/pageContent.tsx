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
      <div id="investment-models">
        <InvestmentModelsSection />
      </div>

      {/* Portfolios Display from investment-portfolios */}
      <div id="plans-section">
        <PortfoliosDisplay />
      </div>

      {/* Portfolio Selection Form with Add to Cart Button */}
      <div id="portfolio-selection">
        <PortfolioSelectionForm />
      </div>
    </div>
  );
};

export default InvestmentPlansPageContent;
