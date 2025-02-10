import Image from "next/image";

const MetaverseBanner = () => {
  return (
    <div>
      <div className="relative mt-[72px] h-[358px]">
        <div
          className="w-full h-[250px]"
          style={{
            background:
              "linear-gradient(90deg, #24344A 0%, #3A5670 100%), linear-gradient(87.93deg, rgba(36,52,74,0) 0%, rgba(36,52,74,0.1) 11.98%, rgba(36,52,74,0.15) 27.65%, rgba(36,52,74,0.7) 61.45%)",
          }}
        ></div>
        <div className="relative w-full max-w-[900px] h-[300px] mx-auto -mt-[200px] rounded-[15px] overflow-hidden">
          <Image
            src={"/images/metaverse/banner.jpg"}
            alt="banner"
            fill
            className="object-cover"
          />
        </div>
      </div>

      <h3 className="font-bold text-[32px] text-[#222222] my-10 text-center">
        یادگیری متاورس را چگونه آغاز کنیم؟
      </h3>
    </div>
  );
};

export default MetaverseBanner;
