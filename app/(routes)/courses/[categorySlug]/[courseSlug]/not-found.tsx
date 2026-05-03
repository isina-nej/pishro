/**
 * 404 Page for course detail route
 * Displayed when course is not found or not published
 */

import Link from "next/link";
import { LuSearch, LuHouse, LuArrowRight } from "react-icons/lu";

export default function CourseNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-myPrimary/5 to-mySecondary/5 px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-myPrimary/10 flex items-center justify-center">
              <LuSearch className="text-myPrimary" size={64} />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">!</span>
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900">
            دوره یافت نشد
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
            متأسفانه دوره‌ای با این مشخصات وجود ندارد یا منتشر نشده است.
            <br />
            ممکن است این دوره حذف شده یا آدرس آن تغییر کرده باشد.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link
            href="/courses"
            className="flex items-center gap-2 bg-mySecondary text-white px-8 py-3 rounded-full font-bold text-base shadow-lg hover:opacity-90 transition"
          >
            <LuArrowRight size={20} />
            مشاهده همه دوره‌ها
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 bg-white text-gray-900 px-8 py-3 rounded-full font-bold text-base shadow-md hover:shadow-lg transition border border-gray-200"
          >
            <LuHouse size={20} />
            بازگشت به خانه
          </Link>
        </div>

        {/* Help Text */}
        <p className="text-sm text-gray-500 pt-8">
          اگر فکر می‌کنید این یک اشتباه است، لطفاً با{" "}
          <Link
            href="/contact"
            className="text-myPrimary font-bold hover:underline"
          >
            پشتیبانی
          </Link>{" "}
          تماس بگیرید.
        </p>
      </div>
    </div>
  );
}
