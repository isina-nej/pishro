"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// آیکون‌های outline
import { GoHome } from "react-icons/go";
import { FiShoppingCart } from "react-icons/fi";
import { HiOutlineClipboardList } from "react-icons/hi";
import { FaRegUser } from "react-icons/fa6";

// آیکون‌های filled
import { AiFillHome } from "react-icons/ai";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { HiClipboardList } from "react-icons/hi";

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
      outlinedIcon: <GoHome />,
      filledIcon: <AiFillHome />,
      link: "/profile",
    },
    {
      label: "سفارش ها",
      outlinedIcon: <FiShoppingCart />,
      filledIcon: <FaShoppingCart />,
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
      outlinedIcon: <FaRegUser />,
      filledIcon: <FaUser />,
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
      <div className="py-8 pr-2 flex flex-col items-start gap-4">
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
    </aside>
  );
};

export default ProfileAside;
