import LottieRemote from "@/components/utils/LottieAnimation";

const SectionOne = () => {
  return (
    <div className="container my-40 relative flex flex-col items-center">
      {/* بخش اول */}
      <div className="flex justify-between items-center gap-20">
        <div className="flex-1">
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
        <div className="flex-1 h-[300px]">
          <div className="w-full h-full rounded-lg overflow-hidden">
            <LottieRemote
              path="/animations/cryptocurrency-analytic.json"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* بخش دوم */}
      <div className="flex justify-between items-center gap-20 mt-32">
        <div className="flex-1 h-[300px]">
          <div className="w-full h-full rounded-lg overflow-hidden">
            <LottieRemote
              path="/animations/boy-investing-in-bitcoin.json"
              className="w-full h-full"
            />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-lg text-[#707177] leading-9">
            راهی برای بدست آوردن توکن‌های پروژه‌های کریپتویی قبل از عرضه به
            بازار به‌صورت رایگان است. شاید باورتان نشود، ولی بیشتر ایردراپ‌ها را
            می‌توان بدون پرداخت هزینه دریافت کرد؛ تنها کافی است مراحل مشخص‌شده
            را طی کنید. حضور در بازار NFTها تقریباً بدون ریسک است و تنها کافی‌ست
            اندکی زمان بگذارید.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SectionOne;
