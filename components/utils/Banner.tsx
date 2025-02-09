import Link from "next/link";

const Banner = () => {
  return (
    <div className="flex w-full h-[160px] bg-[#f5f5f5] mt-10 container">
      <div className="flex-1 flex items-center">
        <Link href="#" className="font-bold text-2xl">
          کلیک کن، پولدار شو!
        </Link>
      </div>
      <div
        className="flex-1 bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: "url('/images/home/golden-egg.png')" }}
      ></div>
    </div>
  );
};

export default Banner;
