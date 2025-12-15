import { pishroBranding } from "@/public/data";
import Image from "next/image";

const SectionTwo = () => {
  return (
    <div className="container-md flex justify-between lg:gap-[80px] mt-20 bg-[#fafafa] rounded-md px-10 py-12">
      <div className="w-full max-w-[485px]">
        <h3 className="font-bold text-lg mb-5">{pishroBranding.title}</h3>
        <p className="font-medium text-lg leading-8 text-[#555] mt-8">
          {pishroBranding.description}
        </p>
      </div>
      <div className="relative h-[500px] w-full max-w-[600px] rounded-[10px] overflow-hidden mt-16">
        <Image
          src={pishroBranding.image}
          alt="business"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default SectionTwo;
