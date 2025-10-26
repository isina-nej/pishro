import Courses from "@/components/utils/Courses";
import Blog from "@/components/utils/blog";
import VideoSection from "../utils/videoSection";
import InvestmentLanding from "./investmentLanding";
import AlibabaSlider from "../utils/AlibabaSlider";
import { alibabaData } from "@/public/data";
import QAModal from "../utils/QA";

const InvestmentPageContent = () => {
  return (
    <div>
      <InvestmentLanding />
      <AlibabaSlider
        topImages={alibabaData.topImages}
        middleImages={alibabaData.middleImages}
        bottomImages={alibabaData.bottomImages}
      />
      <div className="h-32"></div>
      <VideoSection videoUrl="/videos/crypto.webm" label="سرمایه گذاری پیشرو" />
      <div className="mb-24 mt-8 flex justify-center">
        <QAModal />
      </div>
      <Courses />
      <Blog />
    </div>
  );
};

export default InvestmentPageContent;
