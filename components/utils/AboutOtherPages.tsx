import Image from "next/image";
import Link from "next/link";

const AboutOtherPages = () => {
  return (
    <div className="h-[1010px] relative mt-20">
      {/* 🌄 پس‌زمینه */}
      <div className="absolute bottom-0 left-0 w-full aspect-[1440/847] pointer-events-none !-z-10">
        <div className="size-full relative">
          <Image
            src="/images/utiles/font-iran-section.svg"
            alt="Background Image"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 size-full pointer-events-none !-z-20 bg-[#F4F0EA]"></div>

      {/* ✍️ متن اصلی */}
      <div className="container-xl flex pt-40 justify-end h-full z-[999]">
        <div className="max-w-[520px] text-right space-y-6">
          {/* 🔹 تیتر اصلی با دو رنگ */}
          <h2 className="text-[120px] leading-[1.1] font-extrabold">
            <span className="text-[#214254]">مسیر</span>
            <span className="text-[#FFA135] ml-2">پیشرو</span>
          </h2>

          {/* 🔸 متن توضیحی */}
          <p className="text-[#8E8E8E] leading-8 text-lg font-medium !z-[10000]">
            در مسیر پیشرو، هدف ما فقط سرمایه‌گذاری نیست؛ بلکه ساختن آینده‌ای
            مطمئن و پویاست. با بهره‌گیری از تجربه، دانش و اعتماد، مسیر رشد و
            توسعه را هموار می‌کنیم تا شما با اطمینان قدم بردارید. هر تصمیم در
            این مسیر با تحلیل دقیق و دیدگاه بلندمدت گرفته می‌شود تا بازدهی
            پایدار و واقعی حاصل شود.
          </p>

          {/* 🔘 دکمه‌ها */}
          <div className="flex gap-4 pt-4">
            <Link
              href="#"
              className="px-8 py-3 w-1/2 flex justify-center items-center rounded-full text-lg font-bold bg-[#214254] text-white hover:bg-[#214254]/5 hover:text-[#214254] hover:border-[#214254] border transition-all"
            >
              شروع مسیر
            </Link>
            <Link
              href="#"
              className="px-8 py-3 w-1/2 flex justify-center items-center rounded-full text-lg font-bold border-2 border-[#FFA135] hover:text-[#FFA135] hover:bg-transparent bg-[#FFA135] text-white transition-all"
            >
              بیشتر بدانید
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutOtherPages;
