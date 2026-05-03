const Header = () => {
  return (
    <div
      className="relative h-[320px] bg-no-repeat bg-cover bg-center flex justify-center text-white"
      style={{ backgroundImage: `url('/images/faq/header.png')` }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 z-10" // اضافه کردن z-index
        style={{
          background: `linear-gradient(180deg, rgba(255, 255, 255, 0.44) 12.33%, #FFFFFF 63.39%)`,
        }}
      ></div>

      {/* Content */}
      <div className="relative w-full mt-[130px] mx-[90px] z-20">
        <h1 className="text-2xl text-black text-center md:text-[28px] font-bold">
          چه ابهامی دارید؟
        </h1>
      </div>
    </div>
  );
};

export default Header;
