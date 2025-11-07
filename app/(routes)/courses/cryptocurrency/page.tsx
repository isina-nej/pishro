import CryptocurrencyPageContent from "@/components/cryptocurrency/pageContent";
import ScrollToHashClient from "@/components/utils/scrollToHashClient";
import { Suspense } from "react";

const CryptocurrencyPage = () => {
  return (
    <>
      <CryptocurrencyPageContent />
      <Suspense fallback={null}>
        <ScrollToHashClient />
      </Suspense>
    </>
  );
};

export default CryptocurrencyPage;
