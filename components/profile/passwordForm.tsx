"use client";

import React, { forwardRef, useImperativeHandle, useState } from "react";
import { ProfileIcon } from "@/public/svgr-icons";
import { Button } from "../ui/button";
import { ChangePasswordModal } from "./changePasswordModal";
import { useCurrentUser } from "@/lib/hooks/useUser";

const PasswordForm = forwardRef((props, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: userResponse } = useCurrentUser();
  const user = userResponse?.data;

  useImperativeHandle(ref, () => ({
    submit: () => {
      // این فرم دیگر نیازی به submit ندارد چون مودال خودش مدیریت می‌کند
      console.log("PasswordForm - no action needed");
    },
  }));

  return (
    <>
      <div className="bg-[#fafafa] w-full rounded mt-8">
        {/* هدر */}
        <div className="w-full p-5 border-b border-[#e1e1e1]">
          <h6 className="font-irsans text-xs text-[#4d4d4d] mb-5 flex items-center">
            <ProfileIcon className="size-4 stroke-[#2F2F2F]" />
            <span className="mr-3">اطلاعات امنیتی</span>
          </h6>
        </div>
        {/* دکمه تغییر رمز عبور */}
        <div className="p-5">
          <Button
            className="text-xs px-8"
            onClick={() => setIsModalOpen(true)}
            type="button"
          >
            تغییر رمز عبور
          </Button>
        </div>
      </div>

      {/* مودال تغییر رمز عبور */}
      {isModalOpen && user?.phone && (
        <ChangePasswordModal
          phone={user.phone}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
});

PasswordForm.displayName = "PasswordForm";
export default PasswordForm;
