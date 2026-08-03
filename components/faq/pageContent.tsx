import Header from "./header";
import Questions, { type FaqItem } from "./questions";

interface FaqPageContentProps {
  items: FaqItem[];
}

const FaqPageContent = ({ items }: FaqPageContentProps) => {
  return (
    <div>
      <Header />
      <Questions items={items} />
    </div>
  );
};

export default FaqPageContent;
