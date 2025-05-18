import Image from "next/image";

const SectionOne = () => {
  return (
    <div className="container my-40 relative flex flex-col items-center ">
      {/* section one */}
      <div className="flex justify-between items-center gap-20">
        <div className="flex-[2]">
          <p className="text-lg text-[#707177] leading-9">
            NFT: مالکیتی فراتر از زمان، دارایی‌ای فراتر از مرزها! NFT دیگر فقط
            یک تصویر دیجیتالی نیست، بلکه انقلاب در مالکیت و ارزش‌گذاری
            دارایی‌ها است. برای اولین بار در تاریخ، می‌توان مالکیت واقعی بر
            دارایی‌های دیجیتالی را به شکل انحصاری، غیرقابل‌تغییر و جهانی ثبت
            کرد. از هنر و موسیقی گرفته تا زمین‌های متاورسی و کلکسیون‌های کمیاب،
            NFTها مفهوم کمیابی، اعتبار و سرمایه‌گذاری را در دنیای دیجیتال
            بازتعریف کرده‌اند.
          </p>
        </div>
        <div className="flex-[3] h-[300px]">
          <div className="size-full relative rounded-lg overflow-hidden">
            <Image
              src={"/images/charisma-img.svg"}
              alt="stock-market"
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
              alt="stock-market"
              fill
              className="object-contain"
            />
          </div>
        </div>
        <div className="flex-[2]">
          <p className="text-lg text-[#707177] leading-9">
            در  پیشرو، ما شما را برای ورود حرفه‌ای به دنیای NFT آماده می‌کنیم:
            <br />
            🎨 خلق و فروش NFT – چگونه دارایی دیجیتال خود را به ارزش تبدیل کنید؟
            <br />
            🔗 بلاکچین و قراردادهای هوشمند – زیرساختی که NFTها را منحصر‌به‌فرد
            می‌کند
            <br /> 💰 سرمایه‌گذاری هوشمند در NFT – فرصت‌ها و چالش‌های این بازار
            نوظهور
            <br /> 🌎 آینده NFT در متاورس، بازی‌ها و دنیای دیجیتال
            <br />
            <br /> NFTها فقط فایل‌های دیجیتال نیستند، بلکه آینده‌ای هستند که در
            آن، شما مالک چیزی بیشتر از یک اثر، یک تجربه و یک هویت خواهید بود!
          </p>
        </div>
      </div>
    </div>
  );
};

export default SectionOne;
