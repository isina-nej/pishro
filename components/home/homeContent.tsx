import Categories from "@/components/home/categories";
import WhyUs from "@/components/home/whyUs";
import HomeSlider from "@/components/utils/homeSlider";
import AboutUs from "@/components/home/aboutUs";
import Courses from "@/components/home/courses";
import Landing from "@/components/utils/landing";
import Banner from "@/components/utils/Banner";
import Blog from "@/components/utils/blog";

const HomePageContent = () => {
  return (
    <div>
      <Landing />
      <Categories />
      <WhyUs />
      <HomeSlider />
      <AboutUs />
      <Banner />
      <Courses />
      <Blog />
    </div>
  );
};

export default HomePageContent;
