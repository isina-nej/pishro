import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdVideoLibrary } from "react-icons/md";

export default function ClassNotFound() {
  return (
    <div className="container-xl mt-24 min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="mb-6">
          <MdVideoLibrary className="text-gray-400 dark:text-textSecondary text-6xl mx-auto" />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 dark:text-textPrimary mb-4">
          کلاس یافت نشد
        </h1>

        <p className="text-gray-600 dark:text-textSecondary mb-8">
          متأسفانه کلاس درخواستی شما یافت نشد. این کلاس ممکن است حذف شده یا در دسترس نباشد.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <IoMdArrowRoundBack />
            بازگشت به دوره‌ها
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-borderColor rounded-lg hover:bg-gray-50 dark:hover:bg-darkBgHidden dark:bg-darkBgHidden transition-colors"
          >
            صفحه اصلی
          </Link>
        </div>
      </div>
    </div>
  );
}
