import SectionOne from "@/components/metaverse/sectionOne";
import Courses from "@/components/utils/courses";
import Banner from "@/components/utils/Banner";
import Blog from "@/components/utils/blog";

const MetaversePageContent = () => {
  return (
    <div>
      <SectionOne />
      <Courses />
      <Banner />
      <Blog />
    </div>
  );
};

export default MetaversePageContent;
