import SectionOne from "@/components/metaverse/sectionOne";
import LandingVideo from "@/components/utils/landingVideo";
import Courses from "@/components/utils/courses";
import Banner from "@/components/utils/Banner";
import Blog from "@/components/utils/blog";
import Slider from "@/components/utils/slider";

import { metaverseSliderData } from "@/public/data";

const MetaversePageContent = () => {
  return (
    <div>
      <LandingVideo vidSrc="/videos/metaverse.mp4" />
      <Slider items={metaverseSliderData} />
      <SectionOne />
      <Courses />
      <Banner />
      <Blog />
    </div>
  );
};

export default MetaversePageContent;
