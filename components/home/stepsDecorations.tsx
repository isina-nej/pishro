import Image from "next/image";

const StepsDecorations = () => {
  return (
    <div className="absolute inset-0 -z-40 container-xl">
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
