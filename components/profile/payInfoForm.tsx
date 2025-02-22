import React, { forwardRef, useImperativeHandle, useState } from "react";
import { ProfileIcon } from "@/public/svgr-icons";

import Link from "next/link";
import { bankCardsInfo } from "@/public/data";

const PayInfoForm = forwardRef((props, ref) => {
  const [selected, setSelected] = useState(bankCardsInfo[0].cardNumber);

  useImperativeHandle(ref, () => ({
    submit: () => {
      console.log("PayInfoForm submitted.");
    },
  }));

  return (
    <div className="bg-[#fafafa] w-full rounded mt-8">
      {/* هدر */}
      <div className="w-full p-5 border-b border-[#e1e1e1]">
        <h6 className="font-irsans text-xs text-[#4d4d4d] mb-5 flex items-center">
          <ProfileIcon className="size-4 stroke-[#2F2F2F]" />
          <span className="mr-3">شیوه بازگشت وجه</span>
        </h6>
        <p className="font-medium text-xs text-[#4D4D4D]">
          لطفاً شیوه بازگشت وجه را انتخاب کنید؛ همچنین میتوانید{" "}
          <Link href={"#"} className="text-[#2B93F3]">
            شرایط بازگشت
          </Link>{" "}
          وجه را نیز مطالعه کنید.
        </p>
      </div>
      {/* cards list */}
      <div className="p-5 flex flex-col gap-3">
        {bankCardsInfo.map((item, idx) => (
          <div
            key={idx}
            className="p-5 cursor-pointer bg-white rounded"
            onClick={() => setSelected(item.cardNumber)}
          >
            <div className="flex items-center">
              {/* is selected or not */}
              <div className="size-4 bg-[#d7d7d7] rounded-full flex justify-center items-center">
                {selected === item.cardNumber && (
                  <div className="bg-black size-2 rounded-full"></div>
                )}
              </div>
              <h6 className="text-[#1a1a1a] text-xs leading-6 font-medium mr-5">
                {item.label}
              </h6>
            </div>
            <div className="flex gap-20 mt-3 text-[#666] text-xs pr-9">
              <p>شماره کارت | {item.cardNumber}</p>
              <p>شماره شبا | {item.cardShaba}</p>
            </div>
          </div>
        ))}
        {/* wallet item */}
        <div
          className="p-5 cursor-pointer bg-white rounded"
          onClick={() => setSelected("1111")}
        >
          <div className="flex items-center">
            {/* is selected or not */}
            <div className="size-4 bg-[#d7d7d7] rounded-full flex justify-center items-center">
              {selected === "1111" && (
                <div className="bg-black size-2 rounded-full"></div>
              )}
            </div>
            <h6 className="text-[#1a1a1a] text-xs leading-6 font-medium mr-5">
              واریز به کیف پول
            </h6>
          </div>
          <div className="flex gap-20 mt-3 text-[#666] text-xs pr-9">
            <p>
              با فعال کردن این گزینه به عنوان{" "}
              <Link href={"#"} className="text-[#2B93F3]">
                کیف پول
              </Link>{" "}
              ، تراکنش های بازگشت وجه شما سریعتر انجام خواهد شد و به ازای هر
              تراکنش تا پنج درصد هدیه نقدی دریافت کنید!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

PayInfoForm.displayName = "PayInfoForm";
export default PayInfoForm;
