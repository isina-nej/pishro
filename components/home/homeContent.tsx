import Categories from "@/components/home/categories";
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
      <AboutUs />
      <Banner />
      <Courses />
      <Blog />
    </div>
  );
};

export default HomePageContent;
