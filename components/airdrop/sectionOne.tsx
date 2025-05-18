import Image from "next/image";

const SectionOne = () => {
  return (
    <div className="container my-40 relative flex flex-col items-center ">
      {/* section one */}
      <div className="flex justify-between items-center gap-20">
        <div className="flex-[2]">
          <p className="text-lg text-[#707177] leading-9">
            ایردراپ: دریچه‌ای به فرصت‌های پنهان دنیای کریپتو! توضیح: ایردراپ فقط
            دریافت رایگان توکن نیست، بلکه کلیدی برای کشف پروژه‌های نوظهور،
            فرصت‌های سرمایه‌گذاری و ورود زودهنگام به آینده‌ی کریپتو است.
            پروژه‌های بلاکچینی از طریق ایردراپ، جوامع خود را گسترش می‌دهند و
            کاربران هوشمند، با شناخت این فرصت‌ها، مسیر رشد دارایی‌های دیجیتال
            خود را هموار می‌کنند.
          </p>
        </div>
        <div className="flex-[3] h-[300px]">
          <div className="size-full relative rounded-lg overflow-hidden">
            <Image
              src={"/images/charisma-img.svg"}
              alt="airdrop"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
      {/* section two */}
      <div className="flex justify-between items-center gap-20 mt-32 w-full">
        <div className="flex-[3] h-[300px]">
          <div className="size-full relative rounded-lg overflow-hidden">
            <Image
              src={"/images/charisma-img.svg"}
              alt="airdrop"
              fill
              className="object-contain"
            />
          </div>
        </div>
        <div className="flex-[2]">
          <p className="text-lg text-[#707177] leading-9">
            در پیشرو، ما ایردراپ را فراتر از یک هدیه‌ی رایگان آموزش می‌دهیم: 🚀
            چگونه ایردراپ‌های معتبر را شناسایی کنیم؟
            <br />
            🔍 تحلیل پروژه‌ها و تشخیص فرصت‌های طلایی
            <br />
            ⚠️ جلوگیری از کلاهبرداری‌ها و ایردراپ‌های تقلبی
            <br />
            💰 استراتژی‌های کسب سود از ایردراپ‌ها و هولدینگ هوشمند
            <br />
            <br />
            ایردراپ، اولین گام شما برای ورود رایگان به آینده‌ی کریپتو است!
          </p>
        </div>
      </div>
    </div>
  );
};

export default SectionOne;
