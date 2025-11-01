"use client";

import React, { useMemo, useState } from "react";
import NavbarLinks from "./NavbarLinks";
import NavbarActions from "./NavbarActions";
import NavbarPopover from "./navbarPopover";

interface NavbarDesktopProps {
  isDark: boolean;
  navbarData: (
    | { label: string; link: string; data?: undefined }
    | { label: string; link: string; data: { label: string; link: string }[] }
  )[];
}

const COURSE_LABELS = ["کریپتو", "بورس", "متاورس", "NFT", "ایردراپ"] as const;

const isCourseLabel = (
  label: string
): label is (typeof COURSE_LABELS)[number] =>
  COURSE_LABELS.includes(label as (typeof COURSE_LABELS)[number]);

const NavbarDesktop = ({ isDark, navbarData }: NavbarDesktopProps) => {
  const [isIndicatorActive, setIsIndicatorActive] = useState(true);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const desktopNavbarData = useMemo(() => {
    const groupedItems = navbarData.filter((item) => isCourseLabel(item.label));

    if (!groupedItems.length) {
      return navbarData;
    }

    const coursesMenu: NavbarDesktopProps["navbarData"][number] = {
      label: "دوره ها",
      link: "#",
      data: groupedItems.map((item) => ({
        label: item.label,
        link: item.link,
      })),
    };

    const preparedNavbar: NavbarDesktopProps["navbarData"] = [];
    let hasInsertedCourses = false;

    navbarData.forEach((item) => {
      if (isCourseLabel(item.label)) {
        if (!hasInsertedCourses) {
          preparedNavbar.push(coursesMenu);
          hasInsertedCourses = true;
        }
        return;
      }

      preparedNavbar.push(item);
    });

    if (!hasInsertedCourses) {
      preparedNavbar.push(coursesMenu);
    }

    return preparedNavbar;
  }, [navbarData]);

  return (
    <div
      className={`absolute top-0 w-full z-[100] pt-4 md:pt-8 pb-4 md:pb-8 text-xs px-2 sm:px-8 md:px-[60px] flex flex-col md:flex-row justify-between items-center transition-colors duration-300 ${
        isDark
          ? "text-white bg-gradient-to-b from-black/70 via-black/40 to-transparent backdrop-blur-[2px]"
          : "text-mySecondary bg-transparent"
      }`}
      onMouseLeave={() => setIsIndicatorActive(false)}
    >
      {/* لیست منو */}
      <div className="relative w-full md:w-auto flex-1 flex justify-center md:justify-start">
        <ul className="h-full flex items-center gap-1 sm:gap-2 relative flex-wrap">
          {desktopNavbarData.map((item, idx) => (
            <li
              key={idx}
              className="group relative h-full flex items-center pb-1"
              onMouseEnter={(e) => {
                const target = e.currentTarget;
                setIndicatorStyle({
                  left: target.offsetLeft,
                  width: target.clientWidth,
                });
                setIsIndicatorActive(true);
              }}
            >
              {"data" in item && item.data?.length ? (
                <NavbarPopover item={item} />
              ) : (
                item.label && <NavbarLinks navbarData={[item]} />
              )}
            </li>
          ))}

          {/* Underline indicator */}
          <div
            className={`absolute bottom-0 h-[2px] rounded transition-all duration-300 ${
              isIndicatorActive
                ? isDark
                  ? "bg-red-500"
                  : "bg-mySecondary"
                : "opacity-0"
            }`}
            style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
          />
        </ul>
      </div>

      {/* بخش اکشن و سوشال */}
      <NavbarActions isDark={isDark} />
    </div>
  );
};

export default NavbarDesktop;
