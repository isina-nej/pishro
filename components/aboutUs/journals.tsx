import Link from "next/link";
import { FaCircleChevronLeft } from "react-icons/fa6";

import { pishroJournals } from "@/public/data";

const Journals = () => {
  return (
    <div className="container mt-12">
      <h2 className="font-medium text-base mb-4 text-center">
        اطلاعیه ها و مقالات پیشرو
      </h2>
      <h3 className="font-bold text-xl mb-12 text-center">
        تازه ها و رویدادهای پیشرو
      </h3>
      <div className="grid grid-cols-3 gap-16">
        {pishroJournals.map((item, idx) => (
          <div key={idx}>
            <h5 className="font-bold text-xl mb-8">{item.title}</h5>
            <p className="font-medium text-base left-7 text-[#666666] mb-6">
              {item.text}
            </p>
            <Link
              href={item.link}
              className="w-full flex items-center gap-5 group"
            >
              <div className="w-full h-[1px] bg-[#d7d7d7] group-hover:bg-[#a5a5a5] transition-all"></div>
              <FaCircleChevronLeft className="size-6 text-[#666666] group-hover:text-[#444444] transition-all" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Journals;
