import Landing from "@/components/utils/landing";
import Categories from "@/components/home/categories";
import WhyUs from "@/components/home/whyUs";
import HomeSlider from "@/components/utils/homeSlider";
import BusinessConsulting from "@/components/home/businessConsulting";
import Courses from "@/components/home/courses";
import Banner from "@/components/utils/Banner";
import Blog from "@/components/utils/blog";

const HomePageContent = () => {
  return (
    <div>
      <Landing />
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
