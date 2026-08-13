// @/components/home/mobileLanding.server.tsx

import MobileLanding from './mobileLanding';
import { getHomeSlides } from '@/lib/services/landing-service';
import { homeAlbumSlides, normalizeHomeAlbumImageUrl } from '@/lib/data/home-album';

export default async function MobileLandingServer() {
  const slides = await getHomeSlides();
  const slideRows = slides.length > 0 ? slides : homeAlbumSlides;
  const slidesData = slideRows.map((slide) => ({
    src: normalizeHomeAlbumImageUrl(slide.imageUrl),
    title: slide.title,
    text: slide.description || '',
  }));

  return <MobileLanding slides={slidesData} />;
}
