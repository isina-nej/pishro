import { BusinessConsulting } from "@prisma/client";
import BusinessLanding from "./businessLanding";

interface BusinessConsultingContentProps {
  businessConsultingData: BusinessConsulting;
}

const BusinessConsultingContent = ({
  businessConsultingData,
}: BusinessConsultingContentProps) => {
  return (
    <div>
      <BusinessLanding businessConsultingData={businessConsultingData} />
    </div>
  );
};

export default BusinessConsultingContent;
