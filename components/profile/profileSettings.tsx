"use client";

import { useState } from "react";

import { SearchNormalIcon } from "@/public/svgr-icons";
import ProfileHeader from "./header";

import AllForms from "./allForms";

const ProfileSettings = () => {
  const [formType, setFormType] = useState<"personal" | "pay">("personal");

  return (
    <div className="bg-white w-full max-w-[990px] rounded-md">
      <ProfileHeader>
        <div className="flex items-center gap-5">
          <span className="bg-[#f5f5f5] rounded size-[30px] flex items-center justify-center">
            <SearchNormalIcon fill="#131B22" width={14} height={14} />
          </span>
          <h5 className="font-irsans text-[#131B22] text-sm font-medium">
            اطلاعات پروفایل
          </h5>
        </div>
        <div className="text-xs font-medium flex items-center justify-between gap-8">
          <button
            className={
              formType === "personal" ? "text-[#d52a16]" : "text-[#666]"
            }
            onClick={() => setFormType("personal")}
          >
            اطلاعات شخصی
          </button>
          <button
            className={formType === "pay" ? "text-[#d52a16]" : "text-[#666]"}
            onClick={() => setFormType("pay")}
          >
            اطلاعات پرداخت
          </button>
        </div>
      </ProfileHeader>
      {/* body */}
      <AllForms formType={formType} />
    </div>
  );
};

export default ProfileSettings;
