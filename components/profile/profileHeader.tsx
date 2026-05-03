"use client";

import { CiCalendarDate } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import { useCurrentUser } from "@/lib/hooks/useUser";

const ProfileHeader = () => {
  const { data: userResponse, isLoading: loading } = useCurrentUser();
  const user = userResponse?.data;

  const today = new Date().toLocaleDateString("fa-IR", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  const getUserName = () => {
    if (!user) return "کاربر گرامی";
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.firstName) return user.firstName;
    return user.phone;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return "صبح";
    if (hour >= 11 && hour < 16) return "ظهر";
    if (hour >= 16 && hour < 20) return "عصر";
    return "شب";
  };

  return (
    <div className="container-xl flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3 px-4 md:px-0">
      <p className="font-semibold text-sm md:text-base text-[#333] truncate max-w-full">
        {loading ? (
          <span className="animate-pulse">در حال بارگذاری...</span>
        ) : (
          <>
            {getGreeting()} بخیر <span className="hidden sm:inline">{getUserName()}</span>
          </>
        )}
      </p>
      <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto justify-end">
        {/* date */}
        <div className="flex gap-2 md:gap-4 items-center bg-white rounded-sm px-2 h-[26px]">
          <CiCalendarDate className="size-4 md:size-5 text-[#130F26]" />
          <span className="text-xs md:text-sm text-[#333]">{today}</span>
        </div>
        {/* notification */}
        <button className="flex justify-center items-center bg-white rounded-sm px-1 h-[26px] relative">
          <IoIosNotificationsOutline className="size-5 text-[#130F26]" />
          <div className="absolute top-1.5 left-1.5 size-1.5 bg-[#D52A16] rounded full z-10"></div>
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;
