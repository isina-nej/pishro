import Image from "next/image";

const SectionOne = () => {
  return (
    <div className="container my-40 relative flex flex-col items-center ">
      {/* section one */}
      <div className="flex justify-between items-center gap-20">
        <div className="flex-[2]">
          <p className="text-lg text-[#707177] leading-9">
            رمزارزها انقلاب دیجیتال در دستان شما! در دنیای امروز، رمزارزها تنها
            یک دارایی دیجیتال نیستند، بلکه دری به سوی آینده‌ای نوین در دنیای
            مالی‌اند. جایی که دانش، استراتژ‌ی و تحلیل، مسیر موفقیت شما را رقم
            می‌زند. ما در سایت پیشرو سرمایه ، با بیش از ۱۲ سرفصل آموزشی تخصصی از
            جمله الیوت، ایچیموکو، پرایس اکشن، پترن‌ها، فیبوناچی، کندل‌شناسی،
            فیلترنویسی ،سناریوسازی و ... شما را برای ورود قدرتمند به دنیای
            کریپتو آماده می‌کنیم. آموزش ببینید، تحلیل کنید و هوشمندانه
            سرمایه‌گذاری کنید! آینده مالی شما از اینجا شروع می‌شود.
          </p>
        </div>
        <div className="flex-[3] h-[300px]">
          <div className="size-full relative rounded-lg overflow-hidden">
            <Image
              src={"/images/charisma-img.svg"}
              alt="crypto"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
      {/* section two */}
      <div className="flex justify-between items-center gap-20 mt-32">
        <div className="flex-[3] h-[300px]">
          <div className="size-full relative rounded-lg overflow-hidden">
            <Image
              src={"/images/charisma-img.svg"}
              alt="crypto"
              fill
              className="object-contain"
            />
          </div>
        </div>
        <div className="flex-[2]">
          <p className="text-lg text-[#707177] leading-9">
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
