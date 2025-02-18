import React, { forwardRef, useImperativeHandle, useState } from "react";
import Image from "next/image";
import { IoCheckmarkCircle } from "react-icons/io5";
import { profileAvatars } from "@/public/data";
import { ProfileIcon } from "@/public/svgr-icons";

const ProfileAvatarForm = forwardRef((props, ref) => {
  // مدیریت انتخاب آواتار
  const [selectedIndex, setSelectedIndex] = useState(0);

  useImperativeHandle(ref, () => ({
    submit: () => {
      // در اینجا می‌توانید منطق ارسال فرم (مثلاً فراخوانی API) را پیاده کنید.
      console.log(
        "ProfileAvatarForm submitted. Selected avatar index:",
        selectedIndex
      );
      return selectedIndex;
    },
  }));

  return (
    <div className="bg-[#fafafa] w-full rounded">
      <div className="w-full p-5 border-b border-[#e1e1e1]">
        <h6 className="font-irsans text-xs text-[#4d4d4d] mb-5 flex items-center">
          <ProfileIcon className="size-4 stroke-[#2F2F2F]" />
          <span className="mr-3">تصویر پروفایل</span>
        </h6>
        <p className="text-xs text-[#80878c]">
          برای معرفی بهتر، یک تصویر برای پروفایل خودتون انتخاب کنید و پنج امتیاز
          از مونت بگیرید!
        </p>
      </div>
      <div className="p-5 w-full">
        {/* نمایش آواتارها */}
        <div className="p-5 bg-white flex gap-6 rounded">
          {profileAvatars.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className="size-[87px] rounded-full bg-[#edf4f8] relative overflow-hidden group cursor-pointer"
            >
              {/* افکت hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 z-10 bg-[#d52a16]"></div>
              {/* انتخاب شده */}
              {selectedIndex === idx && (
                <div className="absolute inset-0 z-10 bg-[#d52a16]/20 flex justify-center items-center">
                  <IoCheckmarkCircle className="fill-white size-5" />
                </div>
              )}
              <Image
                alt="avatar"
                src={item.img}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

ProfileAvatarForm.displayName = "ProfileAvatarForm";
export default ProfileAvatarForm;
