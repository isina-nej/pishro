import Courses from "@/components/utils/courses";
import Blog from "@/components/utils/blog";
import VideoSection from "@/components/utils/videoSection";
import AboutIt from "@/components/utils/AboutIt";
import Landing from "@/components/utils/Landing2";
import QuestionsSection from "../utils/QuestionsSection";

const StockMarketPageContent = () => {
  return (
    <div>
      <Landing
        imageUrl="/images/stock/stock-landing.jpg"
        title="بورس"
        titleColor="#58D68D"
      />
      <AboutIt />
      <QuestionsSection />
      <VideoSection videoUrl="/videos/stock.webm" label="معرفی بورس" />
      <Courses />
      <Blog />
    </div>
  );
};

export default StockMarketPageContent;
