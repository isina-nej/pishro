import Landing2 from "../utils/Landing2";
import AboutIt from "@/components/utils/AboutIt";
import { investmentTagsData, stepsData } from "@/public/data";
import TagsList from "../utils/TagsList";
import Courses from "../utils/Courses2";
import CommentsSlider from "../utils/CommentsSlider";
import StepsSection from "../home/stepsSection";
import AboutOtherPages from "../utils/AboutOtherPages";
import UserLevelSection from "../utils/UserLevelSelection";

const CryptocurrencyPageContent = () => {
  return (
    <div>
      <Landing2
        imageUrl="/images/crypto/landing-img.png"
        title="کریپتو"
        titleColor="#EC7063"
      />
      <AboutIt />
      <AboutOtherPages />
      <UserLevelSection />
      <StepsSection {...stepsData} />
      <Courses />
      <CommentsSlider />
      <TagsList tags={investmentTagsData} title="کلید واژه های کریپتو" />
    </div>
  );
};

export default CryptocurrencyPageContent;
