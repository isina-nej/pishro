import Courses from "@/components/utils/courses";
import Blog from "@/components/utils/blog";
import Landing2 from "../utils/Landing2";
import AboutIt from "@/components/utils/AboutIt";
import QuestionsSection from "../utils/QuestionsSection";

const MetaversePageContent = () => {
  return (
    <div>
      <Landing2
        imageUrl="/images/metaverse/banner.jpg"
        title="متاورس"
        titleColor="#AF7AC5"
      />
      <AboutIt />
      <QuestionsSection />
      <Courses />
      <Blog />
    </div>
  );
};

export default MetaversePageContent;
