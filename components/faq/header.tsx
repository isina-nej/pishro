const Header = () => {
  return (
    <div
      className="relative flex h-[320px] justify-center bg-cover bg-center bg-no-repeat text-white"
      style={{ backgroundImage: `url('/images/faq/header.png')` }}
    >
      {/* Soft vignette — keep photo clear (no milky white wash) */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/45 via-black/20 to-black/55" />

      <div className="relative z-20 mx-[90px] mt-[130px] w-full">
        <h1 className="text-center text-2xl font-bold text-white drop-shadow-md md:text-[28px]">
          چه ابهامی دارید؟
        </h1>
      </div>
    </div>
  );
};

export default Header;
