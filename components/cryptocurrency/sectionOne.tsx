import Image from "next/image";

const SectionOne = () => {
  const airdropData = [
    {
      logo: "/images/airdrop/airdrop1.png",
      description:
        "راهی برای بدست اوردن توکن های پروژه کریپتویی قبل از عرضه به بازار به صورت رایگان است ",
    },
    {
      logo: "/images/airdrop/airdrop2.png",
      description:
        " شاید باورتان نشود ولی بیشتر ایردراپ ها را میتوان به صورت رایگان هم دریافت کرد و تنها کافیست گام هایی را که برای دریافت آن تعریف شده طی نمود .",
    },
    {
      logo: "/images/airdrop/airdrop3.png",
      description:
        "حضور در بازار NFT ها تقریبا بدون ریسک است و تنها کافیست برای این کار اندکی زمان بگذارید ",
    },
    {
      logo: "/images/airdrop/airdrop4.png",
      description: "لیست شدن هر رمز ارز به طور معمول چند ماه زمان میبرد",
    },
  ];

  return (
    <div className="container mt-40 relative flex flex-col items-center">
      {/* عنوان ایردراپ */}
      <h1 className="text-2xl border-2 border-[#0FAE96] font-bold px-9 py-2 mb-12 relative rounded-[25px]">
        ایردراپ
        {/* خط عمودی از عنوان تا وسط کارت‌ها */}
      </h1>
      <div className="absolute left-1/2 top-[51px] h-12 w-[2px] bg-black"></div>

      {/* باکس کارت‌ها */}
      <div className="relative w-full flex justify-center">
        {/* خطوط اتصال بین عنوان و کارت‌ها */}
        <div className="absolute top-0 left-1/2 w-[77%] h-16 border-t-2 border-black -translate-x-1/2"></div>

        {/* کارت‌های ایردراپ */}
        <div className="w-full grid grid-cols-4 gap-6 mt-16">
          {airdropData.map((item, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center h-full"
            >
              {/* خط اتصال بین باکس مرکزی و هر کارت */}
              <div className="absolute top-[-64px] h-16 w-[2px] bg-black"></div>

              {/* کارت ایردراپ */}
              <div className="bg-[#FDFDFD] p-6 rounded-[18px] w-full h-full max-w-[300px] border border-[#eaeaea]">
                <Image
                  src={item.logo}
                  alt="Airdrop"
                  className="w-16 h-16 mx-auto mb-4"
                  width={64}
                  height={64}
                />
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectionOne;
