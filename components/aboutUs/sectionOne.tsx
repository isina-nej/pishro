import { aboutPishro } from "@/public/data";
import Image from "next/image";

const SectionOne = () => {
  return (
    <div className="container flex justify-between lg:gap-[50px] mt-20">
      <div className="w-full max-w-[310px]">
        <h1 className="font-medium text-sm leading-7 mb-4">
          {aboutPishro.header}
        </h1>
        <h3 className="font-bold text-lg mb-5">{aboutPishro.title}</h3>
        <p className="font-medium text-sm leading-7 text-[#666666]">
          {aboutPishro.description}
        </p>
      </div>
      <div className="relative h-[366px] w-full max-w-[780px] rounded-[10px] overflow-hidden">
        <Image
          src={aboutPishro.image}
          alt="business"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default SectionOne;
