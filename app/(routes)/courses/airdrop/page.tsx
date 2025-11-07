import React, { Suspense } from "react";
import AirdropPageContent from "@/components/airdrop/pageContent";
import ScrollToHashClient from "@/components/utils/scrollToHashClient";

const AirdropPage = () => {
  return (
    <>
      <AirdropPageContent />
      <Suspense fallback={null}>
        <ScrollToHashClient />
      </Suspense>
    </>
  );
};

export default AirdropPage;
