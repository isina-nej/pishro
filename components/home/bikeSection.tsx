import Image from "next/image";

const BikeSection = () => {
  return (
    <section className="container-xl mb-20">
      <div className="w-full flex items-center justify-center">
        {/* wrapper با نسبت درست */}
        <div className="relative w-full aspect-[1361/646]">
          <Image
            src={"/images/home/bike.svg"}
            fill
            alt="دکور"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default BikeSection;
