import Courses from "@/components/utils/courses";
import Blog from "@/components/utils/blog";
import Landing2 from "../utils/Landing2";
import AboutIt from "@/components/utils/AboutIt";
import Questions from "../faq/questions";

const MetaversePageContent = () => {
  return (
    <div>
      <Landing2
        imageUrl="/images/metaverse/banner.jpg"
        title="متاورس"
        titleColor="#AF7AC5"
      />
      <AboutIt />
      <Questions />
      <Courses />
      <Blog />
    </div>
  );
};

export default MetaversePageContent;
