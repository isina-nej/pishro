import SectionOne from "@/components/cryptocurrency/sectionOne";
import Landing from "@/components/utils/landing";
import Slider from "@/components/utils/slider";
import Courses from "@/components/utils/courses";
import Banner from "@/components/utils/Banner";
import Blog from "@/components/utils/blog";

import { cryptoSliderData } from "@/public/data";

const CryptocurrencyPageContent = () => {
  return (
    <div>
      <Landing />
      <Slider items={cryptoSliderData} />
      <SectionOne />
      <Courses />
      <Banner />
      <Blog />
    </div>
  );
};

export default CryptocurrencyPageContent;
