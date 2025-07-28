import Courses from "@/components/utils/courses";
import Blog from "@/components/utils/blog";
import VideoSection from "../utils/videoSection";
import Landing2 from "../utils/Landing2";
import AboutIt from "./aboutIt";
import Questions from "../faq/questions";

const AirdropPageContent = () => {
  return (
    <div>
      <Landing2
        imageUrl="/images/airdrop/landing-img.jpg"
        title="به دنیای ایردراپ خوش آمدید"
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
