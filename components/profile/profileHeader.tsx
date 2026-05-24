"use client";

import { useEffect, useState } from "react";
import { Bell, CalendarDays } from "lucide-react";
import { useCurrentUser } from "@/lib/hooks/useUser";

const ProfileHeader = () => {
  const { data: userResponse, isLoading: loading } = useCurrentUser();
  const user = userResponse?.data;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const today = mounted
    ? new Date().toLocaleDateString("fa-IR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const getUserName = () => {
    if (!user) return "کاربر گرامی";
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.firstName) return user.firstName;
    return user.phone;
  };

  const getGreeting = () => {
    if (!mounted) return "روز";
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return "صبح";
    if (hour >= 11 && hour < 16) return "ظهر";
    if (hour >= 16 && hour < 20) return "عصر";
    return "شب";
  };

  return (
    <div className="container-xl mb-5 flex flex-col gap-3 px-4 md:flex-row md:items-center md:justify-between md:px-0">
      <div>
        <p className="text-xs font-medium text-slate-500 dark:text-textSecondary">
          داشبورد کاربری پیشرو
        </p>
        <h1 className="mt-1 text-xl font-extrabold text-slate-950 dark:text-textPrimary md:text-2xl">
          {loading ? (
            <span className="inline-block h-7 w-44 animate-pulse rounded bg-slate-200 dark:bg-darkBgHidden" />
          ) : (
            <>
              {getGreeting()} بخیر، <span>{getUserName()}</span>
            </>
          )}
        </h1>
      </div>
      <div className="flex w-full items-center justify-end gap-2 md:w-auto">
        <div className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm dark:border-borderColor dark:bg-cardBg dark:text-textPrimary">
          <CalendarDays className="size-4 text-mySecondary dark:text-myGolden" />
          <span>{today || "..."}</span>
        </div>
        <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-borderColor dark:bg-cardBg dark:text-textPrimary dark:hover:bg-darkBgHidden">
          <Bell className="size-5" />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-myPrimary" />
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;
