import { aboutPishro } from "@/public/data";
import Image from "next/image";

const SectionOne = () => {
  return (
    <div className="container flex flex-col-reverse justify-between items-center lg:gap-[50px] mt-40">
      <div className="w-full">
        <h1 className="font-medium text-lg leading-7 mb-4">
          {aboutPishro.header}
        </h1>
        <h3 className="font-bold text-xl mb-5">{aboutPishro.title}</h3>
        <p className="font-medium text-lg leading-7 text-[#555]">
          {aboutPishro.description}
        </p>
      </div>
      <div className="relative h-[496px] w-full max-w-[984px] rounded-[10px] overflow-hidden">
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
