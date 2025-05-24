import LottieRemote from "../utils/LottieAnimation";

const SectionOne = () => {
  return (
    <div className="container my-40 relative flex flex-col items-center ">
      {/* section one */}
      <div className="flex justify-between items-center gap-20">
        <div className="flex-1">
          <p className="text-lg text-[#707177] leading-9">
            بورس از دانش تا سودآوری، حرفه‌ای بیاموزید! سرمایه‌گذاری در بورس، یک
            بازی شانسی نیست؛ بلکه دانشی است که مسیر رشد مالی را هموار می‌کند. در
            دنیایی که اطلاعات، تفاوت‌ها را رقم می‌زند، یادگیری اصولی و حرفه‌ای،
            کلید ورود به موفقیت است. در اینجا، ما با آموزش تخصصی و کاربردی، شما
            را از یک معامله‌گر مبتدی به یک تحلیل‌گر حرفه‌ای تبدیل می‌کنیم.
          </p>
        </div>
        <div className="flex-1 h-[300px]">
          <LottieRemote
            path="/animations/man-thinking-about-investment.json" // ← آدرس دلخواه خودت رو بزار
            className="w-full h-full"
          />
        </div>
      </div>
      {/* section two */}
      <div className="flex justify-between items-center gap-20 mt-32">
        <div className="flex-1 h-[300px]">
          <div className="flex-1 h-[300px]">
            <LottieRemote
              path="/animations/financial-growth-chart.json" // ← آدرس دلخواه خودت رو بزار
              className="w-full h-full"
            />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-lg text-[#707177] leading-9">
            دوره‌های ما شامل
            <br /> ✅ تحلیل تکنیکال پیشرفته (الیوت، ایچیموکو، پرایس اکشن،
            پترن‌ها، کندل‌شناسی) <br /> ✅ تحلیل بنیادی (بررسی صورت‌های مالی،
            ارزش‌گذاری سهام، فاکتورهای اقتصادی) <br /> ✅ آموزش کار با سایت‌های
            تحلیلی و ابزارهای معاملاتی
            <br /> ✅ فیلترنویسی و ساخت استراتژی‌های معاملاتی هوشمند
            <br /> ✅ مدیریت سرمایه و سناریوسازی برای تصمیم‌گیری بهتر با یادگیری
            عمیق، ریسک‌های خود را کاهش دهید و در مسیر سودآوری حرکت کنید! آموزش
            ببینید، تحلیل کنید، سرمایه‌گذاری کنید!
          </p>
        </div>
      </div>
    </div>
  );
};

export default SectionOne;
