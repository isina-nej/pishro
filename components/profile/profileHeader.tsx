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
        <p className="text-xs font-medium text-muted-foreground">
          داشبورد کاربری پیشرو
        </p>
        <h1 className="mt-1 text-xl font-extrabold text-foreground md:text-2xl">
          {loading ? (
            <span className="inline-block h-7 w-44 animate-pulse rounded bg-muted" />
          ) : (
            <>
              {getGreeting()} بخیر، <span>{getUserName()}</span>
            </>
          )}
        </h1>
      </div>
      <div className="flex w-full items-center justify-end gap-2 md:w-auto">
        <div className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm text-foreground shadow-sm">
          <CalendarDays className="size-4 text-primary" />
          <span>{today || "..."}</span>
        </div>
        {/* Decorative only — no notification backend exists yet */}
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground">
          <Bell className="size-5" />
        </span>
      </div>
    </div>
  );
};

export default ProfileHeader;
