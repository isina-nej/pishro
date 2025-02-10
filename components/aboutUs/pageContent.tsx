import LandingVideo from "@/components/utils/landingVideo";
import Categories from "./categories";
import SectionOne from "./sectionOne";
import SectionTwo from "./sectionTwo";
import Journals from "./journals";

const AboutUsContent = () => {
  return (
    <div>
      <LandingVideo vidSrc="/videos/aboutUs.webm" />
      <Categories />
      <SectionOne />
      <SectionTwo />
      <Journals />
    </div>
  );
};

export default AboutUsContent;
