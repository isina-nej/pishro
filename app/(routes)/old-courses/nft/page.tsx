import { Suspense } from "react";
import NftPageContent from "@/components/nft/pageContent";
import ScrollToHashClient from "@/components/utils/scrollToHashClient";

const NftPage = () => {
  return (
    <>
      <NftPageContent />
      <Suspense fallback={null}>
        <ScrollToHashClient />
      </Suspense>
    </>
  );
};

export default NftPage;
