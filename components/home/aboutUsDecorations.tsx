import Image from "next/image";

export const AboutUsDecorations = () => {
  return (
    <>
      {/* circle */}
      <div className="absolute top-0 right-0 size-[456px] bg-[#F5F8FF] rounded-full -z-10"></div>
      {/* arrow */}
      <div className="absolute top-10 right-16 size-[140px] -z-10 -rotate-[15deg]">
        <Image src={"/icons/circle-arrow-left.svg"} fill alt="پیکان" />
      </div>
      {/* triangles */}
      <div className="absolute top-0 right-[47%] size-[250px] -z-10">
        <div className="size-full relative">
          <div className="absolute bottom-0 right-8 size-[80px]">
            <Image src={"/icons/triangle1.svg"} fill alt="مثلث" />
          </div>
          <div className="absolute top-8 left-0 size-[100px]">
            <Image src={"/icons/triangle2.svg"} fill alt="مثلث" />
          </div>
          <div className="absolute top-0 right-0 size-[130px]">
            <Image src={"/icons/triangle3.svg"} fill alt="مثلث" />
          </div>
        </div>
      </div>
      {/* lozenges */}
      <div className="absolute bottom-20 left-0 w-[50%] h-[80%] -z-10">
        <div className="size-full relative">
          <div className="absolute bottom-[35%] right-16 w-[110px] h-[100px]">
            <Image src={"/icons/lozenge1.svg"} fill alt="لوزی" />
          </div>
          <div className="absolute top-24 left-0 w-[270px] h-[250px]">
            <Image src={"/icons/lozenge2.svg"} fill alt="لوزی" />
          </div>
          <div className="absolute top-0 left-0 w-[280px] h-[260px]">
            <Image src={"/icons/lozenge3.svg"} fill alt="لوزی" />
          </div>
          <div className="absolute bottom-0 left-0 w-[240px] h-[210px]">
            <Image src={"/icons/lozenge4.svg"} fill alt="لوزی" />
          </div>
          <div className="absolute bottom-0 right-0 w-[100%] h-[550px]">
            <Image src={"/icons/lozenge5.svg"} fill alt="لوزی" />
          </div>
        </div>
      </div>
    </>
  );
};
