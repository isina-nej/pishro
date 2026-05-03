import Image from "next/image";

const Banner = () => {
  return (
    <div className="my-10 w-full h-[260px] relative overflow-hidden">
      <Image
        src={"/images/news/header.jpg"}
        alt="news-banner"
        fill
        className="object-cover"
      />
    </div>
  );
};

export default Banner;
