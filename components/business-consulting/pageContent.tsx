import { BusinessConsulting } from "@prisma/client";
import BusinessLanding from "./businessLanding";
import { getHiddenPages } from "@/lib/services/settings-service";
import { createVisibility } from "@/lib/site/hidable-pages";

interface BusinessConsultingContentProps {
  businessConsultingData: BusinessConsulting;
}

const BusinessConsultingContent = async ({
  businessConsultingData,
}: BusinessConsultingContentProps) => {
  const { show } = createVisibility(await getHiddenPages());

  if (!show("consulting:landing")) {
    return null;
  }

  return (
    <div className="public-page-shell">
      <BusinessLanding businessConsultingData={businessConsultingData} />
    </div>
  );
};

export default BusinessConsultingContent;
