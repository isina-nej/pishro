import Courses from "@/components/utils/courses";
import Blog from "@/components/utils/blog";
import VideoSection from "../utils/videoSection";
import Landing2 from "../utils/Landing2";
import AboutIt from "@/components/utils/AboutIt";
import Questions from "../faq/questions";

const CryptocurrencyPageContent = () => {
  return (
    <div>
      <Landing2
        imageUrl="/images/crypto/landing-img.png"
        title="کریپتوکارنسی"
        titleColor="#EC7063"
      />
      <AboutIt />
      <Questions />
      <VideoSection videoUrl="/videos/crypto.webm" label="معرفی کریپتوکارنسی" />
      <Courses />
      <Blog />
    </div>
  );
};

export default CryptocurrencyPageContent;
