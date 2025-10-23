import Landing2 from "../utils/Landing2";
import AboutIt from "@/components/utils/AboutIt";
import { investmentTagsData, stepsData } from "@/public/data";
import TagsList from "../utils/TagsList";
import Courses from "../home/courses";
import CommentsSlider from "../utils/CommentsSlider";
import StepsSection from "../home/stepsSection";
import AboutOtherPages from "../utils/AboutOtherPages";

const CryptocurrencyPageContent = () => {
  return (
    <div>
      <Landing2
        imageUrl="/images/crypto/landing-img.png"
        title="کریپتوکارنسی"
        titleColor="#EC7063"
      />
      <AboutIt />
      <AboutOtherPages />
      <StepsSection {...stepsData} />
      <Courses />
      <CommentsSlider />
      <TagsList tags={investmentTagsData} title="کلید واژه های کریپتوکارنسی" />
    </div>
  );
};

export default CryptocurrencyPageContent;
