import { Suspense } from "react";
import MetaversePageContent from "@/components/metaverse/pageContent";
import ScrollToHashClient from "@/components/utils/scrollToHashClient";

const MetaversePage = () => {
  return (
    <>
      <MetaversePageContent />
      <Suspense fallback={null}>
        <ScrollToHashClient />
      </Suspense>
    </>
  );
};

export default MetaversePage;
