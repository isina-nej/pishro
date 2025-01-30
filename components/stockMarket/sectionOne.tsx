import { cryptoData } from "@/public/data";

const SectionOne = () => {
  return (
    <div className="container">
      <h1 className="text-xl font-bold mb-9 text-center">بورس</h1>
      <div className="space-y-12 relative">
        <div className="absolute border border-black rounded-full w-[2%] h-full top-0 right-[49%]"></div>
        {cryptoData.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between"
            dir="rtl" // برای پشتیبانی از زبان فارسی
          >
            {/* جملات فرد در سمت راست */}
            {index % 2 === 0 && (
              <div className="w-[40%] text-right bg-[#fafafa] p-5">
                <div className="flex items-center">
                  <span className="block size-2 rounded-full bg-black mb-3 ml-2"></span>
                  <h2 className="text-sm font-bold mb-2">{item.title}</h2>
                </div>
                <p className="text-xs font-medium leading-7">
                  {item.description}
                </p>
              </div>
            )}
            {index % 2 !== 0 && <div className="w-[40%] text-right"></div>}

            {/* شماره جمله در وسط */}
            <div className="w-[15%] flex items-center justify-center">
              <span className="text-4xl font-medium border border-black rounded-full size-16 flex justify-center items-center bg-white z-10 ">
                {index + 1}
              </span>
            </div>

            {/* جملات زوج در سمت چپ */}
            {index % 2 !== 0 && (
              <div className="w-[40%] text-right bg-[#fafafa] p-5">
                <div className="flex items-center">
                  <span className="block size-2 rounded-full bg-black mb-3 ml-2"></span>
                  <h2 className="text-sm font-bold mb-2">{item.title}</h2>
                </div>
                <p className="text-xs font-medium leading-7">
                  {item.description}
                </p>
              </div>
            )}
            {index % 2 === 0 && <div className="w-[40%] text-right"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionOne;
