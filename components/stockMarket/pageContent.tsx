import Landing3 from "@/components/utils/Landing3";
import AboutOtherPages from "@/components/utils/AboutOtherPages";
import UserLevelSection from "@/components/utils/UserLevelSelection";
import StepsSection from "@/components/utils/stepsSection";
import Courses from "@/components/utils/CoursesSec";
import CommentsSlider from "@/components/utils/CommentsSlider";
import TagsList from "@/components/utils/TagsList";
import {
  stockMarketAboutData,
  stockMarketLandingData,
  investmentTagsData,
  stepsData,
} from "@/public/data";

const StockMarketPageContent = () => {
  return (
    <div>
      <Landing3 data={stockMarketLandingData} />
      <AboutOtherPages data={stockMarketAboutData} />
      <UserLevelSection />
      <StepsSection {...stepsData} />
      <Courses />
      <CommentsSlider />
      <TagsList tags={investmentTagsData} title="کلید واژه های بورس" />
    </div>
  );
};

export default StockMarketPageContent;
