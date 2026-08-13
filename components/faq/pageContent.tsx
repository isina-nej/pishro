import Header from "./header";
import Questions, { type FaqItem } from "./questions";
import { getHiddenPages } from "@/lib/services/settings-service";
import { createVisibility } from "@/lib/site/hidable-pages";

interface FaqPageContentProps {
  items: FaqItem[];
}

const FaqPageContent = async ({ items }: FaqPageContentProps) => {
  const { show } = createVisibility(await getHiddenPages());

  return (
    <div>
      {show("faq:header") && <Header />}
      {show("faq:list") && <Questions items={items} />}
    </div>
  );
};

export default FaqPageContent;
