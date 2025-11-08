import Landing3 from "@/components/utils/Landing3";
import AboutOtherPages from "@/components/utils/AboutOtherPages";
import UserLevelSection from "@/components/utils/UserLevelSelection";
import Courses from "@/components/utils/CoursesSec.server";
import CommentsSlider from "@/components/utils/CommentsSlider";
import TagsList from "@/components/utils/TagsList";
import {
  stockMarketAboutData,
  stockMarketLandingData,
  investmentTagsData,
} from "@/public/data";

const StockMarketPageContent = () => {
  return (
    <main className="w-full">
      <Landing3 data={stockMarketLandingData} />

      <section
        className="w-full mt-8 sm:mt-12 md:mt-16 lg:mt-20"
        aria-label="درباره بورس"
      >
        <AboutOtherPages data={stockMarketAboutData} />
      </section>

      <section
        className="w-full mt-8 sm:mt-12 md:mt-16"
        aria-label="انتخاب سطح کاربری"
      >
        <UserLevelSection />
      </section>

      <section
        className="w-full mt-8 sm:mt-12 md:mt-16 lg:mt-20"
        aria-label="دوره‌های آموزشی"
      >
        <Courses />
      </section>

      <section
        className="w-full mt-12 sm:mt-16 md:mt-20 lg:mt-24"
        aria-label="نظرات کاربران"
      >
        <CommentsSlider comments={[]} title="نظرات دوره آموزان بورس" />
      </section>

      <section
        className="w-full mt-12 sm:mt-16 md:mt-20 lg:mt-24 pb-8 sm:pb-12 md:pb-16 lg:pb-20"
        aria-label="کلید واژه‌های بورس"
      >
        <TagsList tags={investmentTagsData} title="کلید واژه های بورس" />
      </section>
    </main>
  );
};

export default StockMarketPageContent;
