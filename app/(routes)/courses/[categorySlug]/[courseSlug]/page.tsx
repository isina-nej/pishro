/**
 * Dynamic Course Detail Page with ISR
 * Route: /courses/[categorySlug]/[courseSlug]
 * Examples: /courses/cryptocurrency/bitcoin-basics, /courses/nft/nft-marketplace
 *
 * SSR Strategy: ISR with 1 hour revalidation for optimal performance and fresh content
 */

import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  LuClock,
  LuUsers,
  LuVideo,
  LuBookOpen,
  LuBan,
  LuGlobe,
} from "react-icons/lu";
import { BsCheckCircleFill } from "react-icons/bs";
import {
  getCourseBySlug,
  getAllCourseSlugs,
} from "@/lib/services/course-service";
import RatingStars from "@/components/utils/RatingStars";
import AddToCartButton from "@/components/utils/AddToCartButton";
import { CourseLevel } from "@prisma/client";
import CtaSection from "@/components/courses/ctaSection";
import DoctorExplanationVideo from "@/components/courses/doctorExplanationVideo";

// ISR Configuration: Revalidate every 1 hour for fresh content
export const revalidate = 3600;

// Generate static params for all courses at build time (ISR)
export async function generateStaticParams() {
  try {
    const slugs = await getAllCourseSlugs();
    return slugs;
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// Generate dynamic metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string; courseSlug: string }>;
}): Promise<Metadata> {
  try {
    const { categorySlug, courseSlug } = await params;
    const course = await getCourseBySlug(categorySlug, courseSlug);

    if (!course) {
      return {
        title: "دوره یافت نشد",
        description: "این دوره وجود ندارد یا منتشر نشده است.",
      };
    }

    return {
      title: `${course.subject} | پیشرو`,
      description: course.description || `آموزش ${course.subject}`,
      keywords: [
        course.subject,
        course.category?.title || "",
        ...(course.relatedTags?.map((tag) => tag.title) || []),
      ],
      openGraph: {
        title: course.subject,
        description: course.description || `آموزش ${course.subject}`,
        images: course.img ? [course.img] : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: course.subject,
        description: course.description || `آموزش ${course.subject}`,
        images: course.img ? [course.img] : [],
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

// Helper function to get level label in Persian
function getLevelLabel(level: CourseLevel | null | undefined): string {
  switch (level) {
    case "BEGINNER":
      return "مبتدی";
    case "INTERMEDIATE":
      return "متوسط";
    case "ADVANCED":
      return "پیشرفته";
    default:
      return "همه سطوح";
  }
}

// Helper function to get language label in Persian
function getLanguageLabel(language: string | null | undefined): string {
  switch (language) {
    case "FA":
      return "فارسی";
    case "EN":
      return "انگلیسی";
    default:
      return "فارسی";
  }
}

// Main course detail page component
export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ categorySlug: string; courseSlug: string }>;
}) {
  try {
    const { categorySlug, courseSlug } = await params;

    // Fetch course data
    const course = await getCourseBySlug(categorySlug, courseSlug);

    if (!course) {
      notFound();
    }

    // Calculate final price
    const discountAmount = course.discountPercent
      ? (course.price * course.discountPercent) / 100
      : 0;
    const finalPrice = course.price - discountAmount;

    return (
      <main className="w-full mt-20">
        {/* Breadcrumb */}
        <section className="bg-gray-50 py-4">
          <div className="container-xl">
            <nav className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-myPrimary transition">
                خانه
              </Link>
              <span>/</span>
              <Link href="/courses" className="hover:text-myPrimary transition">
                دوره‌ها
              </Link>
              <span>/</span>
              <Link
                href={`/courses/${categorySlug}`}
                className="hover:text-myPrimary transition"
              >
                {course.category?.title || "دسته‌بندی"}
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-bold">{course.subject}</span>
            </nav>
          </div>
        </section>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-myPrimary/5 to-mySecondary/5 py-12 sm:py-16 md:py-20">
          <div className="container-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left: Course Info */}
              <div className="space-y-6">
                {/* Category Badge */}
                {course.category && (
                  <div className="flex items-center gap-2">
                    <span
                      className="px-4 py-1.5 rounded-full text-sm font-bold"
                      style={{
                        backgroundColor: course.category.color || "#F3F4F6",
                        color: course.category.color ? "#FFFFFF" : "#1F2937",
                      }}
                    >
                      {course.category.title}
                    </span>
                  </div>
                )}

                {/* Title */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
                  {course.subject}
                </h1>

                {/* Description */}
                {course.description && (
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                    {course.description}
                  </p>
                )}

                {/* Rating & Stats */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-2">
                    <RatingStars rating={course.rating || 4.5} />
                    <span className="text-sm text-gray-600">
                      ({course._count?.comments || 0} نظر)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <LuUsers className="text-myPrimary" size={20} />
                    <span className="text-sm font-bold">
                      {course._count?.enrollments || course.students || 0}{" "}
                      دانشجو
                    </span>
                  </div>
                </div>

                {/* Instructor */}
                {course.instructor && (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-lg font-bold text-gray-600">
                        {course.instructor.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">مدرس دوره</p>
                      <p className="font-bold text-gray-900">
                        {course.instructor}
                      </p>
                    </div>
                  </div>
                )}

                {/* Price & CTA */}
                <div className="flex flex-col gap-4 pt-4">
                  <div className="flex items-center gap-3">
                    {course.discountPercent && course.discountPercent > 0 ? (
                      <>
                        <span className="text-3xl font-bold text-mySecondary">
                          {finalPrice.toLocaleString("fa-IR")} تومان
                        </span>
                        <span className="text-lg line-through text-gray-400">
                          {course.price.toLocaleString("fa-IR")}
                        </span>
                        <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                          {course.discountPercent}٪
                        </span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold text-mySecondary">
                        {course.price.toLocaleString("fa-IR")} تومان
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <Suspense
                      fallback={
                        <div className="w-40 h-12 animate-pulse bg-gray-200 rounded-full" />
                      }
                    >
                      <AddToCartButton course={course} />
                    </Suspense>
                    <DoctorExplanationVideo />
                  </div>
                </div>
              </div>

              {/* Right: Course Image */}
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={course.img || "/images/default-course.jpg"}
                  alt={course.subject}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Course Details */}
        <section className="py-12 sm:py-16 md:py-20">
          <div className="container-xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8 ">
                {/* What You'll Learn */}
                {course.learningGoals && course.learningGoals.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <LuBookOpen className="text-myPrimary" size={28} />
                      چه چیزهایی یاد می‌گیرید؟
                    </h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {course.learningGoals.map((goal, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <BsCheckCircleFill
                            className="text-green-500 flex-shrink-0 mt-1"
                            size={22}
                          />
                          <span className="text-gray-700">{goal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Prerequisites */}
                {course.prerequisites && course.prerequisites.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      پیش‌نیازهای دوره
                    </h2>
                    <ul className="space-y-3">
                      {course.prerequisites.map((prereq, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <BsCheckCircleFill
                            className="text-myPrimary flex-shrink-0 mt-1"
                            size={22}
                          />
                          <span className="text-gray-700">{prereq}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 sticky top-24 space-y-6">
                  <h3 className="text-xl font-bold text-gray-900 border-b pb-4">
                    مشخصات دوره
                  </h3>

                  {/* Course Stats */}
                  <div className="space-y-4">
                    {course.time && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-600">
                          <LuClock size={20} />
                          <span className="text-sm">مدت زمان</span>
                        </div>
                        <span className="font-bold text-gray-900">
                          {course.time}
                        </span>
                      </div>
                    )}

                    {course.videosCount && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-600">
                          <LuVideo size={20} />
                          <span className="text-sm">تعداد ویدئو</span>
                        </div>
                        <span className="font-bold text-gray-900">
                          {course.videosCount} ویدئو
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <LuBan size={20} />
                        <span className="text-sm">سطح دوره</span>
                      </div>
                      <span className="font-bold text-gray-900">
                        {getLevelLabel(course.level)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <LuGlobe size={20} />
                        <span className="text-sm">زبان</span>
                      </div>
                      <span className="font-bold text-gray-900">
                        {getLanguageLabel(course.language)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <LuUsers size={20} />
                        <span className="text-sm">دانشجویان</span>
                      </div>
                      <span className="font-bold text-gray-900">
                        {course._count?.enrollments || course.students || 0} نفر
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <CtaSection
          title="آماده شروع این دوره هستید؟"
          description="با ثبت‌نام در این دوره، مهارت‌های جدید کسب کنید و در مسیر موفقیت قدم بردارید. همین حالا شروع کنید!"
          buttonText="مشاهده همه دوره‌ها"
          buttonLink="/courses"
        />
      </main>
    );
  } catch (error) {
    console.error("Error rendering course page:", error);
    throw error;
  }
}
