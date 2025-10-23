import { coursesData } from "@/public/data";
import CourseCard from "@/components/home/courseCard";
import Image from "next/image";

const Courses = () => {
  return (
    <section className="relative h-[115vh] overflow-hidden flex flex-col justify-center container-xl">
      {/* Header */}
      <div className="text-center w-full">
        <h2 className="font-bold text-5xl flex items-center justify-center gap-3">
          <span>دوره‌ها</span>
          <div className="relative w-16 h-8">
            <Image
              src={"/icons/smile.svg"}
              alt="smile"
              fill
              className="object-fill"
            />
          </div>
        </h2>
        <p className="text-[#8A8A8A] mt-2 font-bold">
          این دوره‌ها منتخب بهترین دوره‌های مجموعه ماست
        </p>
      </div>

      {/* Course grid */}
      <div className="mt-6 flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 gap-x-8 place-items-center pb-4">
        {coursesData.map((data, idx) => (
          <CourseCard key={idx} data={data} link="/courses" />
        ))}
      </div>
    </section>
  );
};

export default Courses;
