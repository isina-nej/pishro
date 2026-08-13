-- Drop homepage album / overlay / video-hero CMS artifacts removed from the product.

DROP TABLE IF EXISTS `HomeSlide`;
DROP TABLE IF EXISTS `HomeMiniSlider`;

ALTER TABLE `HomeLanding`
  DROP COLUMN `mainHeroTitle`,
  DROP COLUMN `mainHeroSubtitle`,
  DROP COLUMN `mainHeroCta1Text`,
  DROP COLUMN `mainHeroCta1Link`,
  DROP COLUMN `heroTitle`,
  DROP COLUMN `heroSubtitle`,
  DROP COLUMN `heroDescription`,
  DROP COLUMN `heroVideoUrl`,
  DROP COLUMN `heroCta1Text`,
  DROP COLUMN `heroCta1Link`,
  DROP COLUMN `overlayTexts`;
