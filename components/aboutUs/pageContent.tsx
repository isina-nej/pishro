import HeroSection from "./heroSection";
import ResumeSection from "./resumeSection";
import TeamSection from "./teamSection";
import CertificatesGallery from "./certificatesGallery";
import CtaSection from "./ctaSection";
import Journals from "./journals";
import type { AboutPageData } from "@/types/about-us";

interface AboutUsContentProps {
  aboutPageData: AboutPageData | null;
}

const AboutUsContent = ({ aboutPageData }: AboutUsContentProps) => {
  if (!aboutPageData) {
    return (
      <div className="container-md py-20 text-center">
        <p className="text-gray-600">اطلاعات صفحه درباره ما در دسترس نیست</p>
      </div>
    );
  }

  return (
    <div>
      {/* Hero با دیزاین مدرن */}
      <HeroSection
        title={aboutPageData.heroTitle}
        subtitle={aboutPageData.heroSubtitle}
        description={aboutPageData.heroDescription}
        badgeText={aboutPageData.heroBadgeText}
        stats={aboutPageData.heroStats}
      />

      {/* بخش رزومه نوشتاری: تاریخچه، ماموریت، چشم‌انداز، ارزش‌ها */}
      <ResumeSection resumeItems={aboutPageData.resumeItems} />

      {/* بخش تیم و بانیان */}
      <TeamSection teamMembers={aboutPageData.teamMembers} />

      {/* گالری تقدیرنامه‌ها و افتخارات */}
      <CertificatesGallery certificates={aboutPageData.certificates} />

      {/* بخش اطلاعیه‌ها و مقالات */}
      <Journals news={aboutPageData.news} />

      {/* بخش CTA (Call to Action) */}
      <CtaSection
        title={aboutPageData.ctaTitle}
        description={aboutPageData.ctaDescription}
        buttonText={aboutPageData.ctaButtonText}
        buttonLink={aboutPageData.ctaButtonLink}
      />
    </div>
  );
};

export default AboutUsContent;
