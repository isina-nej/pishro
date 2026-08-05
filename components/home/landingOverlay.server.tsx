// @/components/home/landingOverlay.server.tsx

import LandingOverlay from './landingOverlay';
import { getHomeLandingData, getHomeSlides, getHomeMiniSliders } from '@/lib/services/landing-service';
import {
  homeAlbumSlides,
  homeMiniSliderRows,
  normalizeHomeAlbumImageUrl,
} from '@/lib/data/home-album';

type LandingOverlayServerProps = {
  showAlbum?: boolean;
  showHero?: boolean;
};

export default async function LandingOverlayServer({
  showAlbum = true,
  showHero = true,
}: LandingOverlayServerProps) {
  const [homeLanding, slides, miniSlider1, miniSlider2] = await Promise.all([
    getHomeLandingData(),
    showAlbum ? getHomeSlides() : Promise.resolve([]),
    showAlbum ? getHomeMiniSliders(1) : Promise.resolve([]),
    showAlbum ? getHomeMiniSliders(2) : Promise.resolve([]),
  ]);

  const slideRows = slides.length > 0 ? slides : homeAlbumSlides;
  const slidesData = showAlbum
    ? slideRows.map((slide) => ({
        src: normalizeHomeAlbumImageUrl(slide.imageUrl),
        title: slide.title,
        text: slide.description || '',
      }))
    : [];
  const miniSlider1Data = !showAlbum
    ? []
    : miniSlider1.length > 0
      ? miniSlider1.map((slide) => normalizeHomeAlbumImageUrl(slide.imageUrl))
      : [...homeMiniSliderRows[1]];
  const miniSlider2Data = !showAlbum
    ? []
    : miniSlider2.length > 0
      ? miniSlider2.map((slide) => normalizeHomeAlbumImageUrl(slide.imageUrl))
      : [...homeMiniSliderRows[2]];

  return (
    <LandingOverlay
      mainHeroTitle={homeLanding?.mainHeroTitle || 'پیشرو بزرگترین مؤسسه سرمایه‌ گذاری در ایران'}
      mainHeroSubtitle={homeLanding?.mainHeroSubtitle || 'شروع مسیر موفقیت'}
      mainHeroCta1Link={homeLanding?.mainHeroCta1Link || '/business-consulting'}
      heroVideoUrl={homeLanding?.heroVideoUrl || '/videos/aboutUs.webm'}
      overlayTexts={homeLanding?.overlayTexts?.length ? homeLanding.overlayTexts : undefined}
      slides={slidesData}
      miniSlider1Data={miniSlider1Data}
      miniSlider2Data={miniSlider2Data}
      showAlbum={showAlbum}
      showHero={showHero}
    />
  );
}
