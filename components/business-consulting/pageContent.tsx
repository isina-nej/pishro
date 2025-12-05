import { BusinessConsulting } from "@prisma/client";
import BusinessLanding from "./businessLanding";
import CalculatorSection from "@/components/home/calculatorSection";

interface BusinessConsultingContentProps {
  businessConsultingData: BusinessConsulting;
}

const BusinessConsultingContent = ({
  businessConsultingData,
}: BusinessConsultingContentProps) => {
  return (
    <div>
      <BusinessLanding businessConsultingData={businessConsultingData} />
      <div className="mt-32">
        <CalculatorSection />
      </div>
    </div>
  );
};

export default BusinessConsultingContent;
