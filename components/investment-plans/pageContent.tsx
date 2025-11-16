import InvestmentPlansLanding from "./investmentPlansLanding";
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
      {/* Landing Section from investment-plans */}
      <InvestmentPlansLanding investmentPlansData={investmentPlansData} />

      {/* Calculator Section from investment-portfolios */}
      <CalculatorSection />

      {/* Portfolios Display from investment-portfolios */}
      <PortfoliosDisplay />

      {/* Portfolio Selection Form from investment-portfolios */}
      <PortfolioSelectionForm />

      {/* Investment Models Section from investment-portfolios */}
      <InvestmentModelsSection />
    </div>
  );
};

export default InvestmentPlansPageContent;
