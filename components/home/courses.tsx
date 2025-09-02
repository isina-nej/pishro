import { coursesData } from "@/public/data";
import CourseCard from "@/components/home/courseCard";
import Image from "next/image";

const Courses = () => {
  return (
    <div className="container-xl mt-20">
      <div className="text-center w-full">
        <h2 className="font-bold text-5xl flex items-center justify-center gap-3 mr-16">
          <span>دوره ها</span>
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
          این دوره ها منتخب بهترین دوره های مجموعه ماست
        </p>
      </div>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {coursesData.map((data, idx) => (
          <CourseCard key={idx} data={data} link="/courses" />
        ))}
      </div>
    </div>
  );
};

export default Courses;
