// @/components/home/mobileScrollSection.server.tsx

import { getMobileScrollerSteps } from "@/lib/services/landing-service";
import { PhoneStoryScroller } from "./mobile-scroll/PhoneStoryScroller";
import type { MobileScrollerContentType } from "./mobile-scroll/data";

function normalizeContentType(value: unknown): MobileScrollerContentType {
  return value === "PAGE" ? "PAGE" : "IMAGE";
}

export default async function MobileScrollSectionServer() {
  const steps = await getMobileScrollerSteps();

  const transformedSteps = steps.map((step) => {
    const contentType = normalizeContentType(
      (step as { contentType?: string }).contentType
    );
    const pageUrl =
      (step as { pageUrl?: string | null }).pageUrl || undefined;

    return {
      id: step.id,
      title: step.title,
      text: step.description || step.title,
      contentType,
      imgCover: step.coverImageUrl || "/images/home/mobile-scroll/mobile.webp",
      img:
        contentType === "IMAGE"
          ? step.imageUrl || "/images/home/mobile-scroll/in-mobile-1.svg"
          : undefined,
      pageUrl: contentType === "PAGE" ? pageUrl : undefined,
      gradient:
        step.gradient || "from-primary/30 via-primary/20 to-transparent",
      link: step.link || undefined,
    };
  });

  if (transformedSteps.length === 0) {
    return null;
  }

  return (
    <div id="mobile-scroll">
      <PhoneStoryScroller steps={transformedSteps} />
    </div>
  );
}
