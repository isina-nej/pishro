// @/components/home/mobileLanding.server.tsx

import MobileLanding from './mobileLanding';
import { getHomeLandingData, getHomeSlides } from '@/lib/services/landing-service';
import { homeAlbumSlides, normalizeHomeAlbumImageUrl } from '@/lib/data/home-album';

export default async function MobileLandingServer() {
  const [homeLanding, slides] = await Promise.all([getHomeLandingData(), getHomeSlides()]);
  const slideRows = slides.length > 0 ? slides : homeAlbumSlides;
  const slidesData = slideRows.map((slide) => ({
    src: normalizeHomeAlbumImageUrl(slide.imageUrl),
    title: slide.title,
    text: slide.description || '',
  }));

  return (
    <MobileLanding
      mainHeroTitle={homeLanding?.mainHeroTitle || 'پیشرو بزرگترین مؤسسه سرمایه‌ گذاری در ایران'}
      mainHeroSubtitle={homeLanding?.mainHeroSubtitle || 'شروع مسیر موفقیت'}
      mainHeroCta1Link={homeLanding?.mainHeroCta1Link || '/business-consulting'}
      heroVideoUrl={homeLanding?.heroVideoUrl || '/videos/aboutUs.webm'}
      overlayTexts={homeLanding?.overlayTexts?.length ? homeLanding.overlayTexts : undefined}
      slides={slidesData}
    />
  );
}
