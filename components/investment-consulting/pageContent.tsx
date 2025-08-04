import Courses from "@/components/utils/courses";
import Blog from "@/components/utils/blog";
import VideoSection from "../utils/videoSection";
import InvestmentLanding from "./investmentLanding";
import AlibabaSlider from "../utils/AlibabaSlider";
import { alibabaData } from "@/public/data";

const InvestmentPageContent = () => {
  return (
    <div>
      <InvestmentLanding />
      <AlibabaSlider
        topImages={alibabaData.topImages}
        middleImages={alibabaData.middleImages}
        bottomImages={alibabaData.bottomImages}
      />
      <VideoSection videoUrl="/videos/crypto.webm" label="سرمایه گذاری پیشرو" />
      <Courses />
      <Blog />
    </div>
  );
};

export default InvestmentPageContent;
