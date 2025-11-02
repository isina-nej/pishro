import LandingOverlay from "./landingOverlay";
import MobileScrollSection from "./mobileScrollSection";
import CalculatorSection from "./calculatorSection";
import Courses from "@/components/utils/CoursesSec";
import CommentsSlider from "@/components/utils/CommentsSlider";
import NewsClub from "./newsClub";

const HomePageContent = () => {
  return (
    <div className="w-full">
      <LandingOverlay />
      <MobileScrollSection />
      <CalculatorSection />
      <Courses />
      <CommentsSlider />
      <NewsClub />
    </div>
  );
};

export default HomePageContent;
