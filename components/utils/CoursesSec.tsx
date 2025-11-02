import { coursesData } from "@/public/data";
import CourseCard from "@/components/utils/courseCard";
import Image from "next/image";

const Courses = () => {
  return (
    <section
      className="relative overflow-hidden flex flex-col justify-center container-xl mt-8 sm:mt-12 md:mt-16 lg:mt-20"
      aria-label="دوره‌های آموزشی"
    >
      {/* Header */}
      <div className="text-center w-full">
        <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl flex items-center justify-center gap-2 sm:gap-2.5 md:gap-3">
          <span>دوره‌ها</span>
          <div className="relative w-12 h-6 sm:w-14 sm:h-7 md:w-16 md:h-8">
            <Image
              src={"/icons/smile.svg"}
              alt="ایموجی خوشحالی"
              fill
              className="object-fill"
              sizes="(max-width: 640px) 48px, (max-width: 768px) 56px, 64px"
            />
          </div>
        </h2>
        <p className="text-[#8A8A8A] mt-1 sm:mt-1.5 md:mt-2 font-bold text-xs sm:text-sm md:text-base px-4">
          این دوره‌ها منتخب بهترین دوره‌های مجموعه ماست
        </p>
      </div>

      {/* Course grid */}
      <div className="mt-6 sm:mt-8 md:mt-12 lg:mt-16 flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-7 md:gap-8 place-items-center pb-8 sm:pb-10 md:pb-12 lg:pb-16 w-full">
        {coursesData.map((data, idx) => (
          <CourseCard key={idx} data={data} link="/courses" />
        ))}
      </div>
    </section>
  );
};

export default Courses;
