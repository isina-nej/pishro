import VideoSection from "@/components/utils/videoSection";
import InvestmentCustomLanding from "./investmentCustomLanding";

const InvestmentCustomPageContent = () => {
  return (
    <div>
      <InvestmentCustomLanding />
      <VideoSection
        videoUrl="/videos/crypto.webm"
        label="برنامه های سرمایه گذاری پیشرو"
      />
    </div>
  );
};

export default InvestmentCustomPageContent;
