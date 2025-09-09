// import Categories from "@/components/home/categories";
// import WhyUs from "@/components/home/whyUs";
// import BusinessConsulting from "@/components/home/businessConsulting";
// import Blog from "@/components/utils/blog";
// import HomeLanding from "@/components/utils/homeLanding";
// import TransparentVideoPlayer from "@/components/utils/TransparentVideoPlayer";
import CommentsSlider from "@/components/utils/CommentsSlider";
import Courses from "@/components/home/courses";
import NewsClub from "./newsClub";
import LandingOverlay from "./landingOverlay";

const HomePageContent = () => {
  return (
    <div>
      {/* <HomeLanding size="normal" /> */}
      {/* <Categories /> */}
      {/* <WhyUs /> */}
      {/* <TransparentVideoPlayer src="/videos/landing-vid.webm" /> */}
      {/* <BusinessConsulting /> */}
      <LandingOverlay />
      <Courses />
      <CommentsSlider />
      <NewsClub />
      {/* <Blog /> */}
    </div>
  );
};

export default HomePageContent;
