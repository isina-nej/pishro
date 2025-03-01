import Image from "next/image";

const SectionOne = () => {
  return (
    <div className="container my-40 relative flex flex-col items-center ">
      {/* section one */}
      <div className="flex justify-between items-center gap-20">
        <div className="flex-[2]">
          <p className="font-sm text-gray-900 leading-7">
            راهی برای بدست اوردن توکن های پروژه کریپتویی قبل از عرضه به بازار به
            صورت رایگان است   شاید باورتان نشود ولی بیشتر ایردراپ ها را میتوان
            به صورت رایگان هم دریافت کرد و تنها کافیست گام هایی را که برای
            دریافت آن تعریف شده طی نمود . حضور در بازار NFT ها تقریبا بدون ریسک
            است و تنها کافیست برای این کار اندکی زمان بگذارید
          </p>
        </div>
        <div className="flex-[3] h-[300px]">
          <div className="size-full relative rounded-lg overflow-hidden">
            <Image
              src={"/images/landing-airdrop.jpg"}
              alt="airdrop"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
      {/* section two */}
      <div className="flex justify-between items-center gap-20 mt-32">
        <div className="flex-[3] h-[300px]">
          <div className="size-full relative rounded-lg overflow-hidden">
            <Image
              src={"/images/landing-airdrop.jpg"}
              alt="airdrop"
              fill
              className="object-cover"
            />
          </div>
        </div>
        <div className="flex-[2]">
          <p className="font-sm text-gray-900 leading-7">
            راهی برای بدست اوردن توکن های پروژه کریپتویی قبل از عرضه به بازار به
            صورت رایگان است   شاید باورتان نشود ولی بیشتر ایردراپ ها را میتوان
            به صورت رایگان هم دریافت کرد و تنها کافیست گام هایی را که برای
            دریافت آن تعریف شده طی نمود . حضور در بازار NFT ها تقریبا بدون ریسک
            است و تنها کافیست برای این کار اندکی زمان بگذارید
          </p>
        </div>
      </div>
    </div>
  );
};

export default SectionOne;
