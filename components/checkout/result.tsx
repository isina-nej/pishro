import Image from "next/image";

const Result = () => {
  const result = true;
  return (
    <main className="w-full min-h-[485px] flex flex-col justify-center items-center">
      {result ? (
        <>
          <div className="relative w-[276px] h-[234px]">
            <Image
              src={"/images/checkout/success.png"}
              alt="success"
              fill
              className="object-cover"
            />
          </div>
          <p className="mt-16 text-[#3c9a4f] font-bold">
            از خریدتان متشکریم! سفارش شما ثبت شد.
          </p>
        </>
      ) : (
        <>
          <div className="relative w-[276px] h-[234px]">
            <Image
              src={"/images/checkout/failure.png"}
              alt="failure"
              fill
              className="object-cover"
            />
          </div>
          <p className="mt-16 text-[#d52a16] font-bold">
            متاسفیم! پرداخت شما ناموفق بود.
          </p>
        </>
      )}
    </main>
  );
};

export default Result;
