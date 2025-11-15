// @/components/home/mobileScrollSection.server.tsx

import { getMobileScrollerSteps } from "@/lib/services/landing-service";
import { DesktopScroller } from "./mobile-scroll/DesktopScroller";
import { MobileSwiper } from "./mobile-scroll/MobileSwiper";
import type { MobileScrollerCard } from "./mobile-scroll/data";

export default async function MobileScrollSectionServer() {
  const steps = await getMobileScrollerSteps();

  // Transform steps data for components
  const transformedSteps = steps.map((step) => ({
    id: step.stepNumber,
    text: step.title,
    img: step.imageUrl || "/images/home/mobile-scroll/mobile.webp",
    gradient: step.gradient || "from-blue-400/30 via-indigo-400/20 to-transparent",
    cards: (step.cards as unknown as MobileScrollerCard[]) || [],
  }));

  // If no data, don't render
  if (transformedSteps.length === 0) {
    return null;
  }

  return (
    <div id="mobile-scroll">
      <div className="hidden lg:block">
        <DesktopScroller steps={transformedSteps} />
      </div>
      <div className="lg:hidden">
        <MobileSwiper steps={transformedSteps} />
      </div>
    </div>
  );
}
