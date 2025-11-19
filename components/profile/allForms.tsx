"use client";

import React, { useRef } from "react";
import ProfileAvatarForm from "./profileAvatarForm";
import PersonalInfoForm from "./personalInfoForm";
import PasswordForm from "./passwordForm";
import { Button } from "../ui/button";
import PayInfoForm from "./payInfoForm";

interface FormSubmitRef {
  submit: () => void;
}
interface AllFormsProps {
  formType: "personal" | "pay";
}

const AllForms = ({ formType }: AllFormsProps) => {
  const avatarFormRef = useRef<FormSubmitRef>(null);
  const personalInfoFormRef = useRef<FormSubmitRef>(null);
  const passwordFormRef = useRef<FormSubmitRef>(null);
  const payInfoFormRef = useRef<FormSubmitRef>(null);

  const handleSaveChanges = () => {
    if (formType === "personal") {
      // فراخوانی متد submit هر فرم
      avatarFormRef.current?.submit();
      personalInfoFormRef.current?.submit();
      passwordFormRef.current?.submit();
    } else if (formType === "pay") {
      payInfoFormRef.current?.submit();
    }
  };

  return (
    <div className="p-4 md:p-5">
      {formType === "personal" && (
        <>
          {/* pick profile picture */}
          <ProfileAvatarForm ref={avatarFormRef} />
          {/* user info */}
          <PersonalInfoForm ref={personalInfoFormRef} />
          {/* password */}
          <PasswordForm ref={passwordFormRef} />
        </>
      )}
      {formType === "pay" && (
        <>
          <PayInfoForm ref={payInfoFormRef} />
        </>
      )}
      <div className="mt-6 md:mt-8 flex justify-end">
        <Button
          variant={"destructive"}
          className="px-4 md:px-6 text-xs w-full sm:w-auto"
          onClick={handleSaveChanges}
        >
          ذخیره تغییرات
        </Button>
      </div>
    </div>
  );
};

export default AllForms;
