"use client";

import { InvestmentPlansHero } from "./investmentPlansHero";
import PortfoliosDisplay from "@/components/investmentPortfolios/portfoliosDisplay";
import PortfolioSelectionForm from "@/components/investmentPortfolios/portfolioSelectionForm";
import InvestmentModelsSection from "@/components/investmentPortfolios/investmentModelsSection";
import { InvestmentPlans, InvestmentPlan, InvestmentTag } from "@prisma/client";
import { useVisibility } from "@/components/site/VisibilityProvider";

interface InvestmentPlansPageContentProps {
  investmentPlansData: InvestmentPlans & {
    plans: InvestmentPlan[];
    tags: InvestmentTag[];
  };
}

const InvestmentPlansPageContent = ({
  investmentPlansData,
}: InvestmentPlansPageContentProps) => {
  const { show } = useVisibility();

  return (
    <div className="public-page-shell text-foreground dark:text-textPrimary">
      {show("investment:hero") && (
        <InvestmentPlansHero investmentPlansData={investmentPlansData} />
      )}

      {show("investment:models") && (
        <div id="investment-models">
          <InvestmentModelsSection />
        </div>
      )}

      {show("investment:portfolios") && (
        <div id="plans-section">
          <PortfoliosDisplay />
        </div>
      )}

      {show("investment:selection") && (
        <div id="portfolio-selection">
          <PortfolioSelectionForm />
        </div>
      )}
    </div>
  );
};

export default InvestmentPlansPageContent;
