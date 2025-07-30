import Courses from "@/components/utils/courses";
import Blog from "@/components/utils/blog";
import VideoSection from "../utils/videoSection";
import Landing2 from "../utils/Landing2";
import AboutIt from "@/components/utils/AboutIt";
import Questions from "../faq/questions";

const AirdropPageContent = () => {
  return (
    <div>
      <Landing2
        imageUrl="/images/airdrop/landing-img.jpg"
        title="ایردراپ"
        titleColor="#5DADE2"
      />
      <AboutIt />
      <Questions />
      <VideoSection videoUrl="/videos/crypto.webm" label="معرفی ایردراپ" />
      <Courses />
      <Blog />
    </div>
  );
};

export default AirdropPageContent;
