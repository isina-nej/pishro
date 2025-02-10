import LandingVideo from "@/components/utils/landingVideo";
import Courses from "@/components/utils/courses";
import Banner from "@/components/utils/Banner";
import Blog from "@/components/utils/blog";

const StockMarketPageContent = () => {
  return (
    <div>
      <LandingVideo vidSrc="/videos/stock.webm" />
      <Courses />
      <Banner />
      <Blog />
    </div>
  );
};

export default StockMarketPageContent;
