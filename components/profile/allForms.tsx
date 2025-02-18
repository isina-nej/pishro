"use client";

import React, { useRef } from "react";
import ProfileAvatarForm from "./profileAvatarForm";
import PersonalInfoForm from "./personalInfoForm";
import PasswordForm from "./passwordForm";
import { Button } from "../ui/button";

const AllForms = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const avatarFormRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const personalInfoFormRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const passwordFormRef = useRef<any>(null);

  const handleSaveChanges = () => {
    // فراخوانی متد submit هر فرم
    avatarFormRef.current?.submit();
    personalInfoFormRef.current?.submit();
    passwordFormRef.current?.submit();
  };

  return (
    <div className="p-5">
      {/* pick profile picture */}
      <ProfileAvatarForm ref={avatarFormRef} />
      {/* user info */}
      <PersonalInfoForm ref={personalInfoFormRef} />
      {/* password */}
      <PasswordForm ref={passwordFormRef} />
      <div className="mt-8 flex justify-end">
        <Button
          variant={"destructive"}
          className="px-6 text-xs"
          onClick={handleSaveChanges}
        >
          ذخیره تغییرات
        </Button>
      </div>
    </div>
  );
};

export default AllForms;
