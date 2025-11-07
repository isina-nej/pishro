"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react"; // ← import signOut
import { useCurrentUser } from "@/lib/hooks/useUser";

// Heroicons
import {
  HiOutlineHome,
  HiHome,
  HiOutlineShoppingCart,
  HiShoppingCart,
  HiOutlineClipboardList,
  HiClipboardList,
  HiOutlineUser,
  HiUser,
} from "react-icons/hi";

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
      label: "سفارش ها",
      outlinedIcon: <HiOutlineShoppingCart />,
      filledIcon: <HiShoppingCart />,
      link: "/profile/orders",
    },
    {
      label: "لیست ها",
      outlinedIcon: <HiOutlineClipboardList />,
      filledIcon: <HiClipboardList />,
      link: "/profile/lists",
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
    <aside className="rounded-md bg-[#131B22] text-white w-[286px]">
      {/* بخش پروفایل کاربر */}
      <div className="w-full flex flex-col justify-center items-center pt-8 pb-16 border-b border-dashed border-[#495157]">
        <div className="relative rounded-full overflow-hidden w-20 h-20 mb-2 bg-gray-700">
          <Image
            alt="user-profile"
            src={user?.avatarUrl || "/images/profile/profile-1.png"}
            fill
            className="object-cover"
          />
        </div>
        {loading ? (
          <p className="font-medium text-sm animate-pulse">
            در حال بارگذاری...
          </p>
        ) : (
          <>
            <p className="font-medium text-sm">{user?.phone}</p>
            <p className="font-medium text-sm">{getUserName()}</p>
          </>
        )}
      </div>

      {/* لینک‌های ناوبری */}
      <div className="pt-8 pb-80 pr-2 flex flex-col items-start gap-4 border-b border-dashed border-[#495157]">
        {sidebarLinks.map((item, idx) => {
          const isActive = pathname.includes(item.link);
          return (
            <button
              key={idx}
              className="relative w-full text-left hover:bg-blue-500/5"
            >
              {isActive && (
                <span className="absolute left-0 top-0 h-full w-1 bg-red-500 rounded-r-md"></span>
              )}
              <Link
                href={item.link}
                className={`text-sm flex gap-5 items-center pl-4 pr-2 py-2 transition ${
                  isActive ? "font-bold" : "font-medium"
                }`}
              >
                <span
                  className={`transition text-lg ${
                    isActive ? "text-white" : "text-gray-400"
                  }`}
                >
                  {isActive ? item.filledIcon : item.outlinedIcon}
                </span>
                <span>{item.label}</span>
              </Link>
            </button>
          );
        })}
      </div>

      {/* دکمه خروج */}
      <div className="flex justify-center items-center w-full py-8">
        <Button
          variant="destructive"
          className="text-xs py-1.5 px-8"
          onClick={handleLogout} // ← تابع خروج
        >
          خروج از حساب
        </Button>
      </div>
    </aside>
  );
};

export default ProfileAside;
