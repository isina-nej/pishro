import Image from "next/image";

import { Input } from "@/components/ui/input";
import {
  SearchNormalIcon,
  FilterIcon,
  UserIcon,
  BuyIcon,
} from "@/public/svgr-icons";

const Navbar = () => {
  return (
    <nav className="h-[115px] w-full flex flex-col px-[60px]">
      <div className="px-3 py-5 h-20 flex justify-between items-center">
        {/* بخش سمت راست */}
        <div className="w-full max-w-[650px] flex items-center gap-6">
          <div className="h-10 w-[100px] flex items-center">
            <Image src={"/icons/Logo.png"} alt="logo" width={90} height={32} />
          </div>
          <div className="relative h-8 w-full max-w-[526px]">
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
            <button className="absolute left-0 top-1/2 transform -translate-y-1/2 h-full w-7 bg-[#EDF4F8] border-transparent flex justify-center items-center rounded-l-sm">
              <FilterIcon width={20} height={20} />
            </button>
          </div>
        </div>
        {/* بخش سمت چپ */}
        <div className="flex items-center gap-7">
          <button className="flex items-center gap-1">
            <UserIcon width={18} height={18} />
            <span className="font-medium text-xs"> ورود یا ثبت نام</span>
          </button>
          <button className="flex items-center gap-1">
            <BuyIcon width={18} height={18} />
            <span className="text-white bg-[#D52A16] size-4 rounded-[2px] text-xs font-bold text-center">
              6
            </span>
          </button>
        </div>
      </div>
      <div>down</div>
    </nav>
  );
};

export default Navbar;
