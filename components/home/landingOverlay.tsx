"use client";

/**
 * Legacy landing overlay (album / scroll texts / video hero).
 * Homepage no longer mounts this — kept for admin/CMS wiring compatibility.
 */
type LandingOverlayProps = {
  overlayTexts?: string[];
  slides?: { src: string; title: string; text: string }[];
  miniSlider1Data?: string[];
  miniSlider2Data?: string[];
  showAlbum?: boolean;
  showHero?: boolean;
};

export default function LandingOverlay(_props: LandingOverlayProps) {
  return null;
}
