"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react"; // ← import signOut
import { useCurrentUser } from "@/lib/hooks/useUser";
import { cn } from "@/lib/utils";

// Heroicons
import {
  HiOutlineHome,
  HiHome,
  HiOutlineShoppingCart,
  HiShoppingCart,
  HiOutlineAcademicCap,
  HiAcademicCap,
  HiOutlineClipboardList,
  HiClipboardList,
  HiOutlineUser,
  HiUser,
  HiOutlineReceiptTax,
  HiReceiptTax,
  HiOutlineChatAlt2,
  HiChatAlt2,
} from "react-icons/hi";
import { LogOut } from "lucide-react";

const ProfileAside = () => {
  const pathname = usePathname();
  const router = useRouter(); // برای ریدایرکت دستی بعد از signOut
  const { data: userResponse, isLoading: loading } = useCurrentUser();
  const user = userResponse?.data;

  const getUserName = () => {
    if (!user) return "کاربر گرامی";
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.firstName) return user.firstName;
    return user.phone;
  };

  const sidebarLinks = [
    {
      label: "اکانت شما",
      outlinedIcon: <HiOutlineHome />,
      filledIcon: <HiHome />,
      link: "/profile/acc",
    },
    {
      label: "دوره‌های من",
      outlinedIcon: <HiOutlineAcademicCap />,
      filledIcon: <HiAcademicCap />,
      link: "/profile/courses",
    },
    {
      label: "سفارش ها",
      outlinedIcon: <HiOutlineShoppingCart />,
      filledIcon: <HiShoppingCart />,
      link: "/profile/orders",
    },
    {
      label: "تراکنش‌ها",
      outlinedIcon: <HiOutlineReceiptTax />,
      filledIcon: <HiReceiptTax />,
      link: "/profile/transactions",
    },
    {
      label: "لیست ها",
      outlinedIcon: <HiOutlineClipboardList />,
      filledIcon: <HiClipboardList />,
      link: "/profile/lists",
    },
    {
      label: "تیکت و پشتیبانی",
      outlinedIcon: <HiOutlineChatAlt2 />,
      filledIcon: <HiChatAlt2 />,
      link: "/profile/support",
    },
    {
      label: "تنظیمات پروفایل",
      outlinedIcon: <HiOutlineUser />,
      filledIcon: <HiUser />,
      link: "/profile/settings",
    },
  ];

  // ✅ تابع خروج از حساب
  const handleLogout = async () => {
    await signOut({
      redirect: false, // از ریدایرکت خودکار جلوگیری می‌کنیم تا خودمان مسیر را کنترل کنیم
    });
    router.push("/login"); // انتقال کاربر به صفحه ورود
  };

  return (
    <aside className="w-full overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm md:w-[264px] md:min-w-[264px]">
      {/* بخش پروفایل کاربر */}
      <div className="w-full border-b border-border p-5">
        <div className="flex items-center gap-3">
          <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-muted ring-4 ring-muted/50">
            <Image
              alt="user-profile"
              src={user?.avatarUrl || "/images/profile/profile-1.png"}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            {loading ? (
              <p className="h-4 w-28 animate-pulse rounded bg-muted">
                <span className="sr-only">در حال بارگذاری...</span>
              </p>
            ) : (
              <>
                <p className="truncate text-sm font-bold text-foreground">
                  {getUserName()}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {user?.phone}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* لینک‌های ناوبری */}
      <div className="flex gap-2 overflow-x-auto border-b border-border p-3 md:flex-col md:overflow-visible">
        {sidebarLinks.map((item, idx) => {
          const isActive = pathname?.includes(item.link) || false;
          return (
            <div key={idx} className="min-w-fit md:w-full">
              <Link
                href={item.link}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                  isActive
                    ? "bg-navActiveBg text-primary shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <span className={cn("text-lg", isActive && "text-iconBrand")}>
                  {isActive ? item.filledIcon : item.outlinedIcon}
                </span>
                <span>{item.label}</span>
              </Link>
            </div>
          );
        })}
      </div>

      {/* دکمه خروج */}
      <div className="p-3">
        <Button
          variant="outline"
          className="flex w-full items-center justify-center gap-2 rounded-xl border-destructive/30 bg-destructive/10 text-sm font-bold text-destructive hover:bg-destructive/20"
          onClick={handleLogout} // ← تابع خروج
        >
          <LogOut className="size-4" />
          خروج از حساب
        </Button>
      </div>
    </aside>
  );
};

export default ProfileAside;
