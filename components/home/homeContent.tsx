import Categories from "@/components/home/categories";
import WhyUs from "@/components/home/whyUs";
// import HomeSlider from "@/components/utils/homeSlider";
import BusinessConsulting from "@/components/home/businessConsulting";
import Courses from "@/components/home/courses";
import Banner from "@/components/utils/Banner";
import Blog from "@/components/utils/blog";
import Landing from "../utils/landing";
import TransparentVideoPlayer from "../utils/TransparentVideoPlayer";

const HomePageContent = () => {
  return (
    <div>
      <Landing size="normal" />
      <Categories />
      <WhyUs />
      {/* <HomeSlider /> */}
      <TransparentVideoPlayer src="/videos/landing-vid.webm" />
      <BusinessConsulting />
      <Banner />
      <Courses />
      <Blog />
    </div>
  );
};

export default HomePageContent;
