/**
 * Dynamic Category Page with ISR
 * Route: /courses/[categorySlug]
 * Examples: /courses/airdrop, /courses/nft, /courses/cryptocurrency
 */

import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  getCategoryBySlug,
  getAllCategorySlugs,
  getCategoryTags,
  getCategoryCourses,
} from "@/lib/services/category-service";
import Landing3 from "@/components/utils/Landing3";
import AboutOtherPages from "@/components/utils/AboutOtherPages";
// import UserLevelSection from "@/components/utils/UserLevelSelection";
// import CoursesSec from "@/components/utils/CoursesSec.server";
import CommentsSlider from "@/components/utils/CommentsSlider";
import { CourseLevel } from "@prisma/client";
// import TagsList from "@/components/utils/TagsList";

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
  searchParams,
}: {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<{ level?: string; page?: string }>;
}) {
  try {
    const { categorySlug } = await params;
    const { level: levelParam, page: pageParam } = await searchParams;

    // Fetch category data
    const category = await getCategoryBySlug(categorySlug);

    if (!category) {
      notFound();
    }

    // Parse search params for filtering
    const level = levelParam as CourseLevel | undefined;
    const page = parseInt(pageParam || "1");

    // Fetch additional data in parallel
    const [tags, coursesData] = await Promise.all([
      getCategoryTags(categorySlug, 20),
      getCategoryCourses(categorySlug, {
        page,
        limit: 6,
        level,
      }),
    ]);

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
      features: landingContentData?.features?.map((f) => ({ text: f })) || [],
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

    // Transform testimonials for CommentsSlider
    const comments = category.testimonials.map((t) => ({
      id: t.id,
      userName: t.userName,
      userAvatar: t.userAvatar || "/images/default-avatar.png",
      userRole: t.userRole || "کاربر",
      rating: t.rating,
      content: t.content,
      date: t.createdAt.toISOString(),
      verified: t.verified,
      likes: t.likes,
    }));

    // Transform tags for TagsList
    const tagList = tags.map((tag) => ({
      id: tag.id,
      title: tag.title,
      slug: tag.slug,
      color: tag.color,
      icon: tag.icon,
      usageCount: tag.usageCount,
    }));

    return (
      <div className="min-h-screen">
        {/* Hero/Landing Section */}
        <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100" />}>
          <Landing3 data={landingData} />
        </Suspense>

        {/* About Section */}
        <Suspense
          fallback={<div className="h-64 animate-pulse bg-gray-50 my-8" />}
        >
          <AboutOtherPages data={aboutData} />
        </Suspense>

        {/* Courses Section */}
        <section id="courses" className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              دوره‌های {category.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coursesData.courses.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500">
                  هیچ دوره‌ای یافت نشد
                </div>
              ) : (
                coursesData.courses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-bold text-lg mb-2">{course.subject}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {course.description ||
                        "توضیحاتی برای این دوره ثبت نشده است"}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-semibold">
                        {course.price.toLocaleString("fa-IR")} تومان
                      </span>
                      <span className="text-xs text-gray-500">
                        {course.level || "همه سطوح"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Testimonials/Comments Section */}
        {comments.length > 0 && (
          <Suspense
            fallback={<div className="h-64 animate-pulse bg-white my-8" />}
          >
            <CommentsSlider
              comments={comments}
              title={`نظرات دوره آموزان ${category.title}`}
            />
          </Suspense>
        )}

        {/* Tags Section */}
        {tagList.length > 0 && (
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold text-center mb-8">
                برچسب‌های مرتبط
              </h2>
              <div className="flex flex-wrap gap-3 justify-center">
                {tagList.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-100 hover:bg-gray-200 transition-colors"
                    style={{ backgroundColor: tag.color || undefined }}
                  >
                    {tag.icon && <span className="mr-2">{tag.icon}</span>}
                    {tag.title}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section - if exists */}
        {category.faqs.length > 0 && (
          <section className="py-12 bg-gray-50">
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
      </div>
    );
  } catch (error) {
    console.error("Error rendering category page:", error);
    throw error;
  }
}
