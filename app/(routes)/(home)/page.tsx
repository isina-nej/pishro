import HomePageContent from "@/components/home/homeContent";
import { Metadata } from "next";
import { getHomeLandingData } from "@/lib/services/landing-service";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const homeLanding = await getHomeLandingData();

    return {
      title: "52392950",
      description:
        homeLanding?.metaDescription ||
        "آموزش تخصصی بورس، بازارهای مالی و سرمایه‌ گذاری. از آموزش اصولی تا مشاوره حرفه‌ای",
      keywords: homeLanding?.metaKeywords || [],
    };
  } catch (error) {
    console.error("Error in generateMetadata:", error);
    return {
      title: "52392950",
      description: "آموزش تخصصی بورس، بازارهای مالی و سرمایه‌ گذاری. از آموزش اصولی تا مشاوره حرفه‌ای",
    };
  }
}

const Home = async () => {
  // Fetch home landing data
  let homeLanding = null;
  try {
    homeLanding = await getHomeLandingData();
  } catch (error) {
    console.error("Error loading home landing data:", error);
  }

  // If no data is available, show a fallback message
  if (!homeLanding) {
    return (
      <div className="container-md py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">صفحه اصلی</h1>
        <p className="text-gray-600">
          اطلاعات صفحه اصلی در حال حاضر در دسترس نیست. لطفاً بعداً مراجعه کنید.
        </p>
      </div>
    );
  }

  return <HomePageContent />;
};

export default Home;
