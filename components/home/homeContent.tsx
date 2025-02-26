import Landing from "@/components/utils/landing";
import Categories from "@/components/home/categories";
import WhyUs from "@/components/home/whyUs";
import HomeSlider from "@/components/utils/homeSlider";
import BusinessConsulting from "@/components/home/businessConsulting";
import Courses from "@/components/home/courses";
import Banner from "@/components/utils/Banner";
import Blog from "@/components/utils/blog";
import Categories2 from "./categories2";
import Categories3 from "./categories3";

const HomePageContent = () => {
  return (
    <div>
      <Landing />
      <Categories3 />
      <Categories2 />
      <Categories />
      <WhyUs />
      <HomeSlider />
      <BusinessConsulting />
      <Banner />
      <Courses />
      <Blog />
    </div>
  );
};

export default HomePageContent;
