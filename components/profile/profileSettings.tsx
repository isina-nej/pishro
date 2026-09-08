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
          <h5 className="font-yekan text-foreground text-xs md:text-sm font-medium">
            اطلاعات پروفایل
          </h5>
        </div>
        <div className="flex items-center gap-1 rounded-xl bg-muted p-1 text-xs font-bold">
          <button
            type="button"
            className={
              formType === "personal"
                ? "rounded-lg bg-card px-3 py-1.5 text-primary shadow-sm"
                : "rounded-lg px-3 py-1.5 text-muted-foreground transition hover:text-foreground"
            }
            onClick={() => setFormType("personal")}
          >
            اطلاعات شخصی
          </button>
          <button
            type="button"
            className={
              formType === "pay"
                ? "rounded-lg bg-card px-3 py-1.5 text-primary shadow-sm"
                : "rounded-lg px-3 py-1.5 text-muted-foreground transition hover:text-foreground"
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
