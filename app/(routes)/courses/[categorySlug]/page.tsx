/**
 * Dynamic Category Page with ISR
 * Route: /courses/[categorySlug]
 * Examples: /courses/airdrop, /courses/nft, /courses/cryptocurrency
 *
 * این صفحه با ساختار مشابه صفحات قدیمی (old-courses) طراحی شده است
 * و از کامپوننت‌های جداگانه برای هر بخش استفاده می‌کند.
 */

import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { LuTarget, LuBookOpen, LuUsers } from "react-icons/lu";
import {
  getCategoryBySlug,
  getAllCategorySlugs,
  getCategoryTags,
} from "@/lib/services/category-service";
import Landing3 from "@/components/utils/Landing3";
import AboutOtherPages from "@/components/utils/AboutOtherPages";
import UserLevelSection from "@/components/utils/UserLevelSelection";
import CoursesSectionCategory from "@/components/utils/CoursesSec.category.server";
import CommentsSlider from "@/components/utils/CommentsSlider";
import TagsListDynamic from "@/components/utils/TagsList.dynamic";
import ScrollToHashClient from "@/components/utils/scrollToHashClient";

// Type for page content JSON
interface PageContentData {
  title?: string;
  description?: string;
  image?: string;
  primaryButton?: {
    text: string;
    link: string;
  };
  secondaryButton?: {
    text: string;
    link: string;
  };
  features?: string[];
  paragraphs?: string[];
  stats?: Array<{
    label: string;
    value: string;
  }>;
}

// ISR Configuration: Revalidate every 1 hour
export const revalidate = 3600;

// Generate static params for all categories at build time
export async function generateStaticParams() {
  try {
    const slugs = await getAllCategorySlugs();
    return slugs.map((slug) => ({
      categorySlug: slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// Generate dynamic metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}): Promise<Metadata> {
  try {
    const { categorySlug } = await params;
    const category = await getCategoryBySlug(categorySlug);

    if (!category) {
      return {
        title: "دسته‌بندی یافت نشد",
        description: "این دسته‌بندی وجود ندارد یا منتشر نشده است.",
      };
    }

    return {
      title: category.metaTitle || category.title,
      description: category.metaDescription || category.description,
      keywords: category.metaKeywords,
      openGraph: {
        title: category.metaTitle || category.title,
        description:
          category.metaDescription ||
          category.description ||
          "توضیحات پیدا نشد",
        images: category.coverImage ? [category.coverImage] : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: category.metaTitle || category.title,
        description:
          category.metaDescription ||
          category.description ||
          "توضیحات پیدا نشد",
        images: category.coverImage ? [category.coverImage] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "خطا در بارگذاری صفحه",
      description: "مشکلی در بارگذاری اطلاعات صفحه وجود دارد.",
    };
  }
}

// Main category page component
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  try {
    const { categorySlug } = await params;

    // Fetch category data
    const category = await getCategoryBySlug(categorySlug);

    if (!category) {
      notFound();
    }

    // Fetch tags
    const tags = await getCategoryTags(categorySlug, 20);

    // Extract landing and about content from PageContent
    const landingContent = category.content.find((c) => c.type === "LANDING");
    const aboutContent = category.content.find((c) => c.type === "ABOUT");

    // Transform data for Landing3 component (matches Landing3Props)
    const landingContentData = landingContent?.content as
      | PageContentData
      | undefined;
    const landingData = {
      title: landingContentData?.title || category.title,
      description:
        landingContentData?.description || category.description || "",
      button1: landingContentData?.primaryButton?.text || "مشاهده دوره‌ها",
      button2: landingContentData?.secondaryButton?.text || "مشاوره رایگان",
      image:
        landingContentData?.image ||
        category.coverImage ||
        "/images/default-hero.jpg",
      features: landingContentData?.features?.map((f) => ({ text: f })) || [
        {
          icon: <LuTarget className="text-myPrimary text-3xl" />,
          text: "نقشه راه کامل از صفر",
        },
        {
          icon: <LuBookOpen className="text-myPrimary text-3xl" />,
          text: "کامل‌ترین محتوا",
        },
        {
          icon: <LuUsers className="text-myPrimary text-3xl" />,
          text: "اجتماع بزرگ دانش‌آموزان",
        },
      ],
      // 🟩 Floating boxes around the image
      boxes: [
        {
          text: "محتوای کاربردی",
          number: "1K+",
          imgSrc: "/images/utiles/ring.svg",
          top: "5%",
          left: "-2%",
          align: "center" as const,
          col: true,
        },
        {
          text: "ویدئوهای آموزشی",
          number: "250+",
          imgSrc: "/images/utiles/icon1.svg",
          top: "80%",
          left: "9%",
          align: "right" as const,
          col: false,
        },
        {
          text: "دانشجویان راضی",
          number: "3K+",
          imgSrc: "/images/utiles/icon2.svg",
          top: "30%",
          left: "78%",
          align: "right" as const,
          col: false,
        },
      ],
      // 🟦 Animated stats counters at the bottom
      stats: [
        { number: 1000, suffix: "+", label: "دانشجو" },
        { number: 250, suffix: "+", label: "دوره آموزشی" },
        { number: 95, suffix: "%", label: "رضایت کاربران" },
        { number: 5, suffix: "سال", label: "تجربه آموزشی" },
      ],
    };

    // Transform data for AboutOtherPages component (matches AboutOtherPagesProps)
    const aboutContentData = aboutContent?.content as
      | PageContentData
      | undefined;
    const aboutData = {
      title1: "مسیر",
      title2: category.title,
      description:
        aboutContentData?.description ||
        aboutContentData?.paragraphs?.join("\n\n") ||
        category.description ||
        "",
      button1: "شروع مسیر",
      button2: "بیشتر بدانید",
      image: aboutContentData?.image || "/images/utiles/font-iran-section.svg",
    };

    // Transform comments for CommentsSlider با تصحیح Type mismatch
    const comments = (category.comments || []).map((c) => ({
      id: c.id,
      userName: c.userName || "کاربر",
      userAvatar: c.userAvatar || "/images/default-avatar.png",
      userRole: c.userRole || "کاربر",
      rating: c.rating || 5,
      content: c.text,
      // ✅ تبدیل Date به string برای رفع Type mismatch
      date: c.createdAt.toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      verified: c.verified,
      likes: c.likes?.length || 0,
    }));

    // Transform tags for TagsListDynamic
    const tagList = tags.map((tag) => ({
      id: tag.id,
      title: tag.title,
      slug: tag.slug,
      color: tag.color,
      icon: tag.icon,
      usageCount: tag.usageCount,
    }));

    return (
      <main className="w-full">
        {/* 1️⃣ Hero/Landing Section */}
        <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100" />}>
          <Landing3 data={landingData} />
        </Suspense>

        {/* 2️⃣ About Section */}
        <section
          className="w-full mt-8 sm:mt-12 md:mt-16 lg:mt-20"
          aria-label={`درباره ${category.title}`}
        >
          <Suspense
            fallback={<div className="h-64 animate-pulse bg-gray-50" />}
          >
            <AboutOtherPages data={aboutData} />
          </Suspense>
        </section>

        {/* 3️⃣ User Level Selection Section */}
        <section
          className="w-full mt-8 sm:mt-12 md:mt-16"
          aria-label="انتخاب سطح کاربری"
        >
          <Suspense
            fallback={<div className="h-96 animate-pulse bg-gray-50" />}
          >
            <UserLevelSection />
          </Suspense>
        </section>

        {/* 4️⃣ Courses Section */}
        <section
          className="w-full mt-8 sm:mt-12 md:mt-16 lg:mt-20"
          aria-label="دوره‌های آموزشی"
        >
          <Suspense fallback={<div className="h-96 animate-pulse bg-white" />}>
            <CoursesSectionCategory
              categorySlug={categorySlug}
              categoryTitle={category.title}
            />
          </Suspense>
        </section>

        {/* 5️⃣ Testimonials/Comments Section */}
        {comments.length > 0 && (
          <section
            className="w-full mt-12 sm:mt-16 md:mt-20 lg:mt-24"
            aria-label="نظرات کاربران"
          >
            <Suspense
              fallback={<div className="h-64 animate-pulse bg-white" />}
            >
              <CommentsSlider
                comments={comments}
                title={`نظرات دوره آموزان ${category.title}`}
              />
            </Suspense>
          </section>
        )}

        {/* 6️⃣ Tags Section */}
        {tagList.length > 0 && (
          <section
            className="w-full mt-12 sm:mt-16 md:mt-20 lg:mt-24 pb-8 sm:pb-12 md:pb-16 lg:pb-20"
            aria-label={`کلید واژه‌های ${category.title}`}
          >
            <Suspense
              fallback={<div className="h-32 animate-pulse bg-gray-50" />}
            >
              <TagsListDynamic
                tags={tagList}
                title={`کلید واژه‌های ${category.title}`}
              />
            </Suspense>
          </section>
        )}

        {/* 7️⃣ FAQ Section - if exists */}
        {category.faqs.length > 0 && (
          <section className="w-full py-8 sm:py-10 md:py-12 bg-gray-50">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-3xl font-bold text-center mb-8">
                سوالات متداول
              </h2>
              <div className="space-y-4">
                {category.faqs.map((faq) => (
                  <details
                    key={faq.id}
                    className="bg-white p-6 rounded-lg shadow-sm"
                  >
                    <summary className="font-semibold text-lg cursor-pointer hover:text-primary">
                      {faq.question}
                    </summary>
                    <div
                      className="mt-4 text-gray-600 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: faq.answer }}
                    />
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 8️⃣ Scroll to Hash Client */}
        <Suspense fallback={null}>
          <ScrollToHashClient />
        </Suspense>
      </main>
    );
  } catch (error) {
    console.error("Error rendering category page:", error);
    throw error;
  }
}
