import { Input } from "@/components/ui/input";
import Image from "next/image";

const Navbar = () => {
  return (
    <nav className="h-[115px] w-full flex flex-col px-[60px]">
      <div className="px-3 py-5 h-20 flex justify-between items-center">
        {/* بخش سمت راست */}
        <div className="w-full max-w-[650px] flex items-center gap-6">
          <div className="h-10 w-[100px] text-green-600 text-[32px] font-bold ltr">
            logo
          </div>
          <div className="relative w-full max-w-[400px]">
            {/* آیکون جستجو */}
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Image
                src="/icons/search-normal.svg"
                alt="search logo"
                width={20}
                height={20}
              />
            </button>
            {/* اینپوت */}
            <Input
              type="text"
              placeholder="جستجو"
              className="pl-12 pr-12 w-full"
            />
            {/* آیکون فیلتر */}
            <button className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Image
                src="/icons/Filter.svg"
                alt="filter logo"
                width={20}
                height={20}
              />
            </button>
          </div>
        </div>
        {/* بخش سمت چپ */}
        <div>left</div>
      </div>
      <div>down</div>
    </nav>
  );
};

export default Navbar;
