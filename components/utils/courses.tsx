import Link from "next/link";

import Heading from "@/components/utils/heading";
import { cryptoCursesData } from "@/public/data";
import CourseCard from "@/components/utils/courseCard";

const Courses = () => {
  return (
    <div className="container mt-8" id="courses">
      <Heading className="mb-6">دوره های آموزشی</Heading>
      <div className="flex flex-col gap-2">
        {cryptoCursesData.map((data, idx) => (
          <CourseCard
            img={data.img}
            link={"/courses"}
            title={data.title}
            description={data.description}
            key={idx}
          />
        ))}
        <div className="flex justify-center mt-6">
          <Link
            href={"/courses"}
            className="flex justify-center items-center w-[244px] h-10 bg-[#f5f5f5] rounded-sm hover:bg-[#e5e5e5] hover:shadow-lg hover:scale-[105%] transition-all"
          >
            مشاهده بیشتر
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Courses;
