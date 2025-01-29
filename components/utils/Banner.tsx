const Banner = () => {
  return (
    <div className="flex w-full h-[160px] bg-[#f5f5f5] mt-10 container">
      <div className="flex-1 flex items-center">
        <h2 className="font-bold text-2xl">
          بدون هیچ ضامن و اتلاف وقتی؛ اعتبار بگیرید
        </h2>
      </div>
      <div
        className="flex-1 bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: "url('/images/home/golden-egg.png')" }}
      ></div>
    </div>
  );
};

export default Banner;
