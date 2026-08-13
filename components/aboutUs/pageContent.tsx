import HeroSection from "./heroSection";
import ResumeSection from "./resumeSection";
import TeamSection from "./teamSection";
import CertificatesGallery from "./certificatesGallery";
import CtaSection from "./ctaSection";
import Journals from "./journals";
import type { AboutPageData } from "@/types/about-us";
import { getHiddenPages } from "@/lib/services/settings-service";
import { createVisibility } from "@/lib/site/hidable-pages";

interface AboutUsContentProps {
  aboutPageData: AboutPageData | null;
}

const AboutUsContent = async ({ aboutPageData }: AboutUsContentProps) => {
  const { show } = createVisibility(await getHiddenPages());

  if (!aboutPageData) {
    return (
      <div className="container-md py-20 text-center">
        <p className="text-muted-foreground dark:text-textSecondary">
          اطلاعات صفحه درباره ما در دسترس نیست
        </p>
      </div>
    );
  }

  return (
    <div className="public-page-shell text-foreground dark:text-textPrimary">
      {show("about:hero") && (
        <HeroSection
          title={aboutPageData.heroTitle}
          subtitle={aboutPageData.heroSubtitle}
          description={aboutPageData.heroDescription}
          badgeText={aboutPageData.heroBadgeText}
          stats={aboutPageData.heroStats}
        />
      )}

      {show("about:resume") && (
        <ResumeSection resumeItems={aboutPageData.resumeItems} />
      )}

      {show("about:team") && (
        <TeamSection teamMembers={aboutPageData.teamMembers} />
      )}

      {show("about:certificates") && (
        <CertificatesGallery certificates={aboutPageData.certificates} />
      )}

      {show("about:journals") && <Journals news={aboutPageData.news} />}

      {show("about:cta") && (
        <CtaSection
          title={aboutPageData.ctaTitle}
          description={aboutPageData.ctaDescription}
          buttonText={aboutPageData.ctaButtonText}
          buttonLink={aboutPageData.ctaButtonLink}
        />
      )}
    </div>
  );
};

export default AboutUsContent;
