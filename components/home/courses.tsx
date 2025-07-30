import { coursesData } from "@/public/data";
import Heading from "@/components/utils/heading";
import CourseCard from "@/components/home/courseCard";

const Courses = () => {
  return (
    <div className="container-xl mt-20">
      <Heading>دوره های منتخب</Heading>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {coursesData.map((data, idx) => (
          <CourseCard
            key={idx}
            title={data.title}
            price={data.price}
            img={data.img}
            link="/courses"
          />
        ))}
      </div>
    </div>
  );
};

export default Courses;
