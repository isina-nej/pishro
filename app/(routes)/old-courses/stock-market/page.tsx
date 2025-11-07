import StockMarketPageContent from "@/components/stockMarket/pageContent";
import ScrollToHashClient from "@/components/utils/scrollToHashClient";
import { Suspense } from "react";

const StockMarket = () => {
  return (
    <>
      <StockMarketPageContent />
      <Suspense fallback={null}>
        <ScrollToHashClient />
      </Suspense>
    </>
  );
};

export default StockMarket;
