"use client";

import { useState } from "react";

import { SearchNormalIcon } from "@/public/svgr-icons";
import ProfileHeader from "./header";

import AllForms from "./allForms";

const ProfileSettings = () => {
  const [formType, setFormType] = useState<"personal" | "pay">("personal");

  return (
    <div className="bg-card w-full md:max-w-[990px] rounded-md">
      <ProfileHeader>
        <div className="flex items-center gap-3 md:gap-5">
          <span className="bg-muted rounded size-[26px] md:size-[30px] flex items-center justify-center">
            <SearchNormalIcon
              fill="currentColor"
              stroke="currentColor"
              width={12}
              height={12}
            />
          </span>
          <h5 className="font-irsans text-foreground text-xs md:text-sm font-medium">
            اطلاعات پروفایل
          </h5>
        </div>
        <div className="text-xs font-medium flex items-center justify-between gap-4 md:gap-8">
          <button
            className={
              formType === "personal"
                ? "text-primary"
                : "text-muted-foreground"
            }
            onClick={() => setFormType("personal")}
          >
            اطلاعات شخصی
          </button>
          <button
            className={
              formType === "pay" ? "text-primary" : "text-muted-foreground"
            }
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
