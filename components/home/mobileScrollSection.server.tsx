// @/components/home/mobileScrollSection.server.tsx

import { getMobileScrollerSteps } from "@/lib/services/landing-service";
import { PhoneStoryScroller } from "./mobile-scroll/PhoneStoryScroller";

export default async function MobileScrollSectionServer() {
  const steps = await getMobileScrollerSteps();

  const transformedSteps = steps.map((step) => ({
    id: step.stepNumber,
    title: step.title,
    text: step.description || step.title,
    imgCover: step.coverImageUrl || "/images/home/mobile-scroll/mobile.webp",
    img: step.imageUrl || "/images/home/mobile-scroll/in-mobile-1.svg",
    gradient:
      step.gradient || "from-primary/30 via-primary/20 to-transparent",
    link: step.link || undefined,
  }));

  if (transformedSteps.length === 0) {
    return null;
  }

  return (
    <div id="mobile-scroll">
      <PhoneStoryScroller steps={transformedSteps} />
    </div>
  );
}
