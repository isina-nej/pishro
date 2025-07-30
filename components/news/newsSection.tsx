import Banner from "./banner";
import Filter from "./filter";
import NewsList from "./NewsList";

const NewsSection = () => {
  return (
    <div>
      <Filter />
      <Banner />
      <NewsList />
    </div>
  );
};

export default NewsSection;
