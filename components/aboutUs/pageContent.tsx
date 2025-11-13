import HeroSection from "./heroSection";
import ResumeSection from "./resumeSection";
import TeamSection from "./teamSection";
import CertificatesGallery from "./certificatesGallery";
import CtaSection from "./ctaSection";
import Journals from "./journals";

const AboutUsContent = () => {
  return (
    <div>
      {/* Hero با دیزاین مدرن */}
      <HeroSection />

      {/* بخش رزومه نوشتاری: تاریخچه، ماموریت، چشم‌انداز، ارزش‌ها */}
      <ResumeSection />

      {/* بخش تیم و بانیان */}
      <TeamSection />

      {/* گالری تقدیرنامه‌ها و افتخارات */}
      <CertificatesGallery />

      {/* بخش اطلاعیه‌ها و مقالات */}
      <Journals />

      {/* بخش CTA (Call to Action) */}
      <CtaSection />
    </div>
  );
};

export default AboutUsContent;
