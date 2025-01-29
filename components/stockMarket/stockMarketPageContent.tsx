import Landing from "@/components/utils/landing";
import SectionOne from "@/components/stockMarket/sectionOne";
import Courses from "@/components/utils/courses";
import Slider from "@/components/stockMarket/slider";
import Banner from "@/components/utils/Banner";
import Blog from "@/components/utils/blog";

const StockMarketPageContent = () => {
  return (
    <div>
      <Landing />
      <Slider />
      <SectionOne />
      <Courses />
      <Banner />
      <Blog />
    </div>
  );
};

export default StockMarketPageContent;
