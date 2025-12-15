import Image from "next/image";

const StepsDecorations = () => {
  return (
    <div className="absolute inset-0 -z-40 container-xl">
      {/* Circle */}
      <div className="size-[456px] absolute top-16 left-0 bg-[#f1f3f5] rounded-full opacity-70 -z-50" />

      {/* Lamp */}
      <div className="w-[260px] aspect-[265/228] absolute left-20 top-[290px]">
        <div className="relative size-full z-10">
          <Image
            fill
            src={"/icons/lamp.svg"}
            alt="چراغ"
            className="object-contain object-center"
          />
        </div>
      </div>
    </div>
  );
};

export default StepsDecorations;
