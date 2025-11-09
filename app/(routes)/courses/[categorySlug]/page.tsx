/**
 * Dynamic Category Page with ISR
 * Route: /courses/[categorySlug]
 * Examples: /courses/airdrop, /courses/nft, /courses/cryptocurrency
 */

import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { LuTarget, LuBookOpen, LuUsers } from "react-icons/lu";
import { PageContent } from "@prisma/client";
import {
  getCategoryBySlug,
  getAllCategorySlugs,
  getCategoryTags,
  PageContentData,
} from "@/lib/services/category-service";
import CategoryHeroSection from "@/components/utils/CategoryHeroSection";
import CategoryAboutSection from "@/components/utils/CategoryAboutSection";
import UserLevelSection from "@/components/utils/UserLevelSelection";
import CoursesSectionCategory from "@/components/utils/CoursesSec.category.server";
import CommentsSlider from "@/components/utils/CommentsSlider";
import TagsListDynamic from "@/components/utils/TagsList.dynamic";
import ScrollToHashClient from "@/components/utils/scrollToHashClient";

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

// Helper function to safely parse JSON content
function parseContentData(content: unknown): PageContentData | undefined {
  if (!content) return undefined;

  try {
    if (typeof content === "string") {
      return JSON.parse(content) as PageContentData;
    }
    return content as PageContentData;
  } catch (e) {
    console.error("Error parsing content data:", e);
    return undefined;
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

    // Parse statsBoxes from JSON
    let parsedStatsBoxes = [];
    try {
      if (category.statsBoxes) {
        parsedStatsBoxes =
          typeof category.statsBoxes === "string"
            ? JSON.parse(category.statsBoxes)
            : category.statsBoxes;
      }
    } catch (e) {
      console.error("Error parsing statsBoxes:", e);
    }

    // Extract landing and about content from PageContent
    const landingContent = category.content.find((c: PageContent) => c.type === "LANDING");
    const aboutContent = category.content.find((c: PageContent) => c.type === "ABOUT");

    const landingContentData = landingContent
      ? parseContentData(landingContent.content)
      : undefined;
    const aboutContentData = aboutContent
      ? parseContentData(aboutContent.content)
      : undefined;

    // Hero Section Data
    const heroData = {
      title: category.heroTitle || category.title,
      subtitle: category.heroSubtitle || undefined,
      description:
        category.heroDescription ||
        landingContentData?.description ||
        category.description ||
        "",
      image:
        category.heroImage || category.coverImage || "/images/default-hero.jpg",
      cta1Text: category.heroCta1Text || "مشاهده دوره‌ها",
      cta1Link: category.heroCta1Link || "#courses",
      cta2Text: category.heroCta2Text || "مشاوره رایگان",
      cta2Link: category.heroCta2Link || "#contact",
      statsBoxes:
        parsedStatsBoxes.length > 0
          ? parsedStatsBoxes
          : [
              {
                text: "محتوای کاربردی",
                number: "1K+",
                icon: "/images/utiles/ring.svg",
                top: "5%",
                left: "-2%",
                align: "center" as const,
                col: true,
              },
              {
                text: "ویدئوهای آموزشی",
                number: "250+",
                icon: "/images/utiles/icon1.svg",
                top: "80%",
                left: "9%",
                align: "right" as const,
                col: false,
              },
              {
                text: "دانشجویان راضی",
                number: "3K+",
                icon: "/images/utiles/icon2.svg",
                top: "30%",
                left: "78%",
                align: "right" as const,
                col: false,
              },
            ],
      statCounters: [
        { number: 1000, suffix: "+", label: "دانشجو" },
        { number: 250, suffix: "+", label: "دوره آموزشی" },
        { number: 95, suffix: "%", label: "رضایت کاربران" },
        { number: 5, suffix: "سال", label: "تجربه آموزشی" },
      ],
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
    };

    // About Section Data
    const aboutData = {
      title1: category.aboutTitle1 || "مسیر",
      title2: category.aboutTitle2 || category.title,
      description:
        category.aboutDescription ||
        aboutContentData?.description ||
        aboutContentData?.paragraphs?.join("\n\n") ||
        category.description ||
        "",
      image: category.aboutImage || "/images/utiles/font-iran-section.svg",
      cta1Text: category.aboutCta1Text || "شروع مسیر",
      cta1Link: category.aboutCta1Link || "#courses",
      cta2Text: category.aboutCta2Text || "بیشتر بدانید",
      cta2Link: category.aboutCta2Link || undefined,
    };

    // Transform comments for CommentsSlider
    const comments = (category.comments || []).map((c) => {
      // Determine user name
      let displayName = c.userName || "کاربر";
      if (!c.userName && c.user) {
        const firstName = c.user.firstName || "";
        const lastName = c.user.lastName || "";
        displayName = `${firstName} ${lastName}`.trim() || "کاربر";
      }

      // Determine avatar
      const avatar =
        c.userAvatar || c.user?.avatarUrl || "/images/default-avatar.png";

      return {
        id: c.id,
        userName: displayName,
        userAvatar: avatar,
        userRole: c.userRole || "کاربر",
        rating: c.rating || 5,
        content: c.text,
        date: c.createdAt.toLocaleDateString("fa-IR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        verified: c.verified,
        likes: c.likes?.length || 0,
      };
    });

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
          <CategoryHeroSection {...heroData} />
        </Suspense>

        {/* 2️⃣ About Section */}
        <section
          className="w-full mt-8 sm:mt-12 md:mt-16 lg:mt-20"
          aria-label={`درباره ${category.title}`}
        >
          <Suspense
            fallback={<div className="h-64 animate-pulse bg-gray-50" />}
          >
            <CategoryAboutSection {...aboutData} />
          </Suspense>
        </section>

        {/* 3️⃣ User Level Selection Section */}
        {category.enableUserLevelSection && (
          <section
            className="w-full mt-8 sm:mt-12 md:mt-16"
            aria-label="انتخاب سطح کاربری"
          >
            <Suspense
              fallback={<div className="h-96 animate-pulse bg-gray-50" />}
            >
              <UserLevelSection categorySlug={categorySlug} />
            </Suspense>
          </section>
        )}

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

        {/* 7️⃣ FAQ Section */}
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
