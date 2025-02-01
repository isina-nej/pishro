import { newsData } from "@/public/data";
import NewsCard from "./newsCard";

const NewsList = () => {
  return (
    <div className="mt-8 grid grid-cols-2 gap-x-[50px] gap-y-[60px]">
      {newsData.map((data, idx) => (
        <NewsCard key={idx} data={data} />
      ))}
    </div>
  );
};

export default NewsList;
