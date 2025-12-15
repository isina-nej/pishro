import Heading from "@/components/utils/heading";
import { blogData } from "@/public/data";
import BlogCard from "@/components/utils/blogCard";

const Blog = () => {
  return (
    <div className="container-md mt-20 mb-6" id="news">
      <Heading link="مطالعه بیشتر" href="/news">
        مجله خبری و مقالات
      </Heading>
      <div className="mt-8 flex flex-wrap gap-5 justify-between">
        {blogData.map((data, idx) => (
          <BlogCard
            key={idx}
            title={data.title}
            date={data.date}
            description={data.description}
            img={data.img}
            link={data.link}
          />
        ))}
      </div>
    </div>
  );
};

export default Blog;
