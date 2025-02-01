import Image from "next/image";

const Banner = () => {
  return (
    <div className="my-10 w-full h-[220px] relative overflow-hidden">
      <Image
        src={"/images/news/header.jpg"}
        alt="news-banner"
        width={1356}
        height={220}
        className="-mt-[260px]"
      />
    </div>
  );
};

export default Banner;
