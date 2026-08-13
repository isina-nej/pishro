// @/components/home/landingOverlay.server.tsx

import LandingOverlay from './landingOverlay';
import { getHomeLandingData, getHomeSlides, getHomeMiniSliders } from '@/lib/services/landing-service';
import {
  homeAlbumSlides,
  homeMiniSliderRows,
  normalizeHomeAlbumImageUrl,
} from '@/lib/data/home-album';

export default async function LandingOverlayServer() {
  const [homeLanding, slides, miniSlider1, miniSlider2] = await Promise.all([
    getHomeLandingData(),
    getHomeSlides(),
    getHomeMiniSliders(1),
    getHomeMiniSliders(2),
  ]);

  const slideRows = slides.length > 0 ? slides : homeAlbumSlides;
  const slidesData = slideRows.map((slide) => ({
    src: normalizeHomeAlbumImageUrl(slide.imageUrl),
    title: slide.title,
    text: slide.description || '',
  }));
  const miniSlider1Data =
    miniSlider1.length > 0
      ? miniSlider1.map((slide) => normalizeHomeAlbumImageUrl(slide.imageUrl))
      : [...homeMiniSliderRows[1]];
  const miniSlider2Data =
    miniSlider2.length > 0
      ? miniSlider2.map((slide) => normalizeHomeAlbumImageUrl(slide.imageUrl))
      : [...homeMiniSliderRows[2]];

  return (
    <LandingOverlay
      overlayTexts={homeLanding?.overlayTexts?.length ? homeLanding.overlayTexts : undefined}
      slides={slidesData}
      miniSlider1Data={miniSlider1Data}
      miniSlider2Data={miniSlider2Data}
    />
  );
}
