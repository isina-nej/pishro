import InvestmentPlansLanding from "./investmentPlansLanding";
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
      <InvestmentPlansLanding investmentPlansData={investmentPlansData} />
    </div>
  );
};

export default InvestmentPlansPageContent;
