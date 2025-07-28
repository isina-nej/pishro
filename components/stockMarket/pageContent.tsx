import Courses from "@/components/utils/courses";
import Blog from "@/components/utils/blog";
import VideoSection from "@/components/utils/videoSection";
import AboutIt from "./aboutIt";
import Questions from "../faq/questions";
import Landing from "../utils/Landing";

const StockMarketPageContent = () => {
  return (
    <div>
      <Landing
        imageUrl="/images/stock/stock-landing.jpg"
        title="به دنیای بورس خوش آمدید"
      />
      <AboutIt />
      <Questions />
      <VideoSection videoUrl="/videos/stock.webm" label="معرفی بورس" />
      <Courses />
      <Blog />
    </div>
  );
};

export default StockMarketPageContent;
