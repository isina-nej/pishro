import Landing3 from "@/components/utils/Landing3";
import AboutOtherPages from "@/components/utils/AboutOtherPages";
import UserLevelSection from "@/components/utils/UserLevelSelection";
import StepsSection from "@/components/utils/stepsSection";
import Courses from "@/components/utils/Courses";
import CommentsSlider from "@/components/utils/CommentsSlider";
import TagsList from "@/components/utils/TagsList";
import {
  airdropAboutData,
  airdropLandingData,
  investmentTagsData,
  stepsData,
} from "@/public/data";

const AirdropPageContent = () => {
  return (
    <div>
      <Landing3 data={airdropLandingData} />
      <AboutOtherPages data={airdropAboutData} />
      <UserLevelSection />
      <StepsSection {...stepsData} />
      <Courses />
      <CommentsSlider />
      <TagsList tags={investmentTagsData} title="کلید واژه های ایردراپ" />
    </div>
  );
};

export default AirdropPageContent;
