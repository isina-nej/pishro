import Link from "next/link";
import Image from "next/image";

import { categories } from "@/public/data";

const Categories = () => {
  return (
    <div className="mt-10 container">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-[72px]">
        {categories.map((item, idx) => (
          <div key={idx} className="text-center">
            <Link href={item.link} className="block">
              <Image
                src={item.src}
                alt={item.label}
                width={154}
                height={154}
                className="w-full object-cover mb-8 rounded-md"
              />
              <span className="text-lg font-semibold">{item.label}</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
