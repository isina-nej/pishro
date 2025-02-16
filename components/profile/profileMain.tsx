import { SearchNormalIcon, ProfileIcon } from "@/public/svgr-icons";
import ProfileHeader from "./header";
import { profileAvatars } from "@/public/data";
import Image from "next/image";
import { IoCheckmarkCircle } from "react-icons/io5";

const ProfileMain = () => {
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
          <button className="text-[#d52a16]">اطلاعات شخصی</button>
          <button className="text-[#666]">اطلاعات پرداخت</button>
        </div>
      </ProfileHeader>
      {/* body */}
      <div className="p-5">
        {/* pick profile picture */}
        <div className="w-full p-5 bg-[#fafafa]">
          <h6 className="font-irsans text-xs text-[#4d4d4d] mb-5 flex items-center">
            <ProfileIcon className="size-4 stroke-[#2F2F2F]" />
            <span className="mr-3">تصویر پروفایل</span>
          </h6>
          <p className="text-xs text-[#80878c]">
            برای معرفی بهتر، یک تصویر برای پروفایل خودتون انتخاب کنید و پنج
            امتیاز از مونت بگیرید!
          </p>
        </div>
        <div className="p-5 bg-[#fafafa] w-full">
          {/* profile avatars */}
          <div className="p-5 bg-white flex gap-6">
            {profileAvatars.map((item, idx) => (
              <div
                key={idx}
                className="size-[87px] rounded-full bg-[#edf4f8] relative overflow-hidden group cursor-pointer"
              >
                {/* overly */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 z-10 bg-[#d52a16]"></div>
                {/* selected */}
                {idx === 0 && (
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
    </div>
  );
};

export default ProfileMain;
