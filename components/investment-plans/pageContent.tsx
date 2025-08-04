// import VideoSection from "@/components/utils/videoSection";
import { investmentTagsData } from "@/public/data";
import TagsList from "../utils/TagsList";
import InvestmentPlansLanding from "./investmentPlansLanding";

const InvestmentPlansPageContent = () => {
  return (
    <div>
      <InvestmentPlansLanding />
      <TagsList tags={investmentTagsData} />
      {/* <VideoSection
        videoUrl="/videos/aboutUs.webm"
        label="برنامه های سرمایه گذاری پیشرو"
      /> */}
    </div>
  );
};

export default InvestmentPlansPageContent;
