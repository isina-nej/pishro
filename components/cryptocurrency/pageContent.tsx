import LandingVideo from "@/components/utils/landingVideo";
import Courses from "@/components/utils/courses";
import Banner from "@/components/utils/Banner";
import Blog from "@/components/utils/blog";

const CryptocurrencyPageContent = () => {
  return (
    <div>
      <LandingVideo vidSrc="/videos/crypto.webm" />
      <Courses />
      <Banner />
      <Blog />
    </div>
  );
};

export default CryptocurrencyPageContent;
