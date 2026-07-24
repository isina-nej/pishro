import { BusinessConsulting } from "@prisma/client";
import BusinessLanding from "./businessLanding";

interface BusinessConsultingContentProps {
  businessConsultingData: BusinessConsulting;
}

const BusinessConsultingContent = ({
  businessConsultingData,
}: BusinessConsultingContentProps) => {
  return (
    <div className="public-page-shell">
      <BusinessLanding businessConsultingData={businessConsultingData} />
    </div>
  );
};

export default BusinessConsultingContent;
