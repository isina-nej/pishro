import Courses from "@/components/utils/courses";
import Blog from "@/components/utils/blog";
import VideoSection from "@/components/utils/videoSection";
import Landing from "@/components/utils/Landing";
import AboutIt from "./aboutIt";

const StockMarketPageContent = () => {
  return (
    <div>
      <Landing imageUrl="/images/stock/stock-landing.jpg" title="بورس" />

      <AboutIt />
      <VideoSection videoUrl="/videos/stock.webm" label="معرفی بورس" />
      <Courses />
      <Blog />
    </div>
  );
};

export default StockMarketPageContent;
