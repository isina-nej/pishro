"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

// استفاده از آیکون‌های Heroicons برای یکدست بودن
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

const user = {
  name: "نام کاربر",
  phone: "09123456789",
  image: "/images/profile/profile-1.png",
};

const ProfileAside = () => {
  const pathname = usePathname();

  const sidebarLinks = [
    {
      label: "اکانت شما",
      outlinedIcon: <HiOutlineHome />,
      filledIcon: <HiHome />,
      link: "/profile",
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

  return (
    <aside className="rounded-md bg-[#131B22] text-white w-[286px]">
      {/* پروفایل */}
      <div className="w-full flex flex-col justify-center items-center pt-8 pb-16 border-b border-dashed border-[#495157]">
        <div className="relative rounded-full overflow-hidden w-20 h-20 mb-2">
          <Image
            alt="user-profile"
            src={user.image}
            fill
            className="object-cover"
          />
        </div>
        <p className="font-medium text-sm">{user.phone}</p>
        <p className="font-medium text-sm">{user.name}</p>
      </div>
      {/* لینک‌های ناوبری */}
      <div className="pt-8 pb-80 pr-2 flex flex-col items-start gap-4 border-b border-dashed border-[#495157]">
        {sidebarLinks.map((item, idx) => {
          // بررسی می‌کنیم که آیا مسیر فعلی برابر با لینک مورد نظر است
          const isActive = pathname === item.link;
          return (
            <button
              key={idx}
              className="relative w-full text-left hover:bg-blue-500/5"
            >
              {/* خط قرمز در سمت چپ در صورت فعال بودن */}
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
      <div className="flex justify-center items-center w-full py-8">
        <Button variant={"destructive"} className="text-xs py-1.5 px-8">
          خروج از حساب
        </Button>
      </div>
    </aside>
  );
};

export default ProfileAside;
