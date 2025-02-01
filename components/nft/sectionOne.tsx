import Image from "next/image";

import { nftData } from "@/public/data";

const SectionOne = () => {
  return (
    <div className="container-xl py-16 bg-[#fafafa] flex justify-between">
      {/* texts div */}
      <div className="flex-1 flex">
        <div className="h-full flex flex-col gap-[57px]">
          {nftData.map((item, idx) => (
            <div className="flex gap-2 items-center" key={idx}>
              <div className="flex justify-center items-center p-4 w-full h-[90px] border border-black rounded-[20px]">
                <p className="font-bold text-base text-[#222222]">{item}</p>
              </div>
              <div className="w-10 h-0.5 bg-black"></div>
            </div>
          ))}
        </div>
        <div className="h-full w-0.5 py-[44px]">
          <div className="h-full w-0.5 bg-black"></div>
        </div>
      </div>
      {/* images div */}
      <div className="w-full h-auto flex-1 px-[70px] relative">
        <Image
          alt="nft"
          src={"/images/nft/nft.png"}
          width={322}
          height={488}
          className="absolute bottom-20 z-10"
        />
        <Image
          alt="nft"
          src={"/images/nft/chart.png"}
          width={275}
          height={607}
          className="absolute bottom-10 right-[220px]"
        />
      </div>
    </div>
  );
};

export default SectionOne;
