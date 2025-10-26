import Landing3 from "@/components/utils/Landing3";
import AboutOtherPages from "@/components/utils/AboutOtherPages";
import UserLevelSection from "@/components/utils/UserLevelSelection";
import StepsSection from "@/components/utils/stepsSection";
import Courses from "@/components/utils/Courses";
import CommentsSlider from "@/components/utils/CommentsSlider";
import TagsList from "@/components/utils/TagsList";
import {
  nftAboutData,
  nftLandingData,
  investmentTagsData,
  stepsData,
} from "@/public/data";

const NftPageContent = () => {
  return (
    <div>
      <Landing3 data={nftLandingData} />
      <AboutOtherPages data={nftAboutData} />
      <UserLevelSection />
      <StepsSection {...stepsData} />
      <Courses />
      <CommentsSlider />
      <TagsList tags={investmentTagsData} title="کلید واژه های NFT" />
    </div>
  );
};

export default NftPageContent;
