import Courses from "@/components/utils/courses";
import Blog from "@/components/utils/blog";
import VideoSection from "@/components/utils/videoSection";
import InvestmentPlansLanding from "./investmentPlansLanding";

const InvestmentPlansPageContent = () => {
  return (
    <div>
      <InvestmentPlansLanding />
      <VideoSection
        videoUrl="/videos/crypto.webm"
        label="برنامه های سرمایه گذاری پیشرو"
      />
      <Courses />
      <Blog />
    </div>
  );
};

export default InvestmentPlansPageContent;
