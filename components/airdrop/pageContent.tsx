import Landing from "@/components/utils/landing";
import SectionOne from "@/components/airdrop/sectionOne";
import Courses from "@/components/utils/courses";
import Banner from "@/components/utils/Banner";
import Blog from "@/components/utils/blog";
import Slider from "@/components/utils/slider";
import { airdropSliderData } from "@/public/data";

const AirdropPageContent = () => {
  return (
    <div>
      <Landing />
      <Slider items={airdropSliderData} />
      <SectionOne />
      <Courses />
      <Banner />
      <Blog />
    </div>
  );
};

export default AirdropPageContent;
