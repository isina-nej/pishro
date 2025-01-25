import { Input } from "@/components/ui/input";
import { SearchNormalIcon, FilterIcon } from "@/public/svgr-icons";

const Navbar = () => {
  return (
    <nav className="h-[115px] w-full flex flex-col px-[60px]">
      <div className="px-3 py-5 h-20 flex justify-between items-center">
        {/* بخش سمت راست */}
        <div className="w-full max-w-[650px] flex items-center gap-6">
          <div className="h-10 w-[100px] text-green-600 text-[32px] font-bold ltr">
            logo
          </div>
          <div className="relative h-8 w-full max-w-[400px]">
            {/* آیکون جستجو */}
            <button className="absolute top-1/2 transform -translate-y-1/2 h-8 px-4">
              <SearchNormalIcon width={12} height={12} />
            </button>
            {/* اینپوت */}
            <Input
              type="text"
              placeholder="جستجو"
              className="pl-12 pr-12 w-full h-8"
            />
            {/* آیکون فیلتر */}
            <button className="absolute left-0 top-1/2 transform -translate-y-1/2 h-8 size-7 bg-[#EDF4F8]">
              <FilterIcon width={20} height={20} />
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
