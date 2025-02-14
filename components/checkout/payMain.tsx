import { cn } from "@/lib/utils";
import { checkoutBank } from "@/public/data";
import Image from "next/image";
import { useState } from "react";

const PayMain = () => {
  const [bank, setBank] = useState<"saman" | "melli" | "mellat">("saman");
  return (
    <main className="w-full">
      {/* header */}
      <div className="border-b pb-4">
        <h6 className="text-[#333] font-medium text-sm">انتخاب شیوه پرداخت</h6>
      </div>
      {/* choose bank */}
      <div className="mt-9 bg-[#fafafa]">
        <div className="p-4 border-b">
          <h6 className="text-[#131b22] font-medium text-sm">
            پرداخت اینترنتی
          </h6>
        </div>
        <div className="py-6 px-14 flex flex-wrap gap-10">
          {checkoutBank.map((item, idx) => (
            <button
              key={idx}
              className="flex flex-col items-center"
              onClick={() => setBank(item.name as "saman" | "melli" | "mellat")}
            >
              <div
                className={cn(
                  "flex justify-center items-center overflow-hidden rounded-full bg-black size-12 mb-4",
                  bank === item.name && "bg-[#D52A16]"
                )}
              >
                <div className="relative size-7">
                  <Image
                    src={item.logo}
                    alt={item.name}
                    fill
                    className="object-cover filter brightness-0 invert "
                  />
                </div>
              </div>
              <div>
                <p
                  className={cn(
                    "text-xs text-[#879ca6] transition",
                    bank === item.name && "text-black font-bold"
                  )}
                >
                  {item.label}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
};

export default PayMain;
