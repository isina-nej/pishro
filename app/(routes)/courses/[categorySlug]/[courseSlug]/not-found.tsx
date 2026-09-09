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
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-myPrimary/10 flex items-center justify-center">
              <LuSearch className="text-myPrimary" size={64} />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-destructive rounded-full flex items-center justify-center">
              <span className="text-destructive-foreground text-xl font-bold">!</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground">
            دوره یافت نشد
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            متأسفانه دوره‌ای با این مشخصات وجود ندارد یا منتشر نشده است.
            <br />
            ممکن است این دوره حذف شده یا آدرس آن تغییر کرده باشد.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link
            href="/courses"
            className="flex items-center gap-2 bg-[var(--btn-primary-bg)] text-white px-8 py-3 rounded-full font-bold text-base shadow-lg hover:bg-[var(--btn-primary-hover)] transition"
          >
            <LuArrowRight size={20} />
            مشاهده همه دوره‌ها
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 bg-card text-foreground px-8 py-3 rounded-full font-bold text-base shadow-md hover:shadow-lg transition border border-border"
          >
            <LuHouse size={20} />
            بازگشت به خانه
          </Link>
        </div>

        <p className="text-sm text-muted-foreground pt-8">
          اگر فکر می‌کنید این یک اشتباه است، لطفاً با{" "}
          <Link
            href="/about-us"
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
