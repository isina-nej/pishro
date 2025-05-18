import React, { useState } from "react";
import Link from "next/link";
import NavbarPopover from "./navbarPopover";

interface NavbarItemsProps {
  navbarData: (
    | {
        label: string;
        link: string;
        data?: undefined;
      }
    | {
        label: string;
        link: string;
        data: {
          label: string;
          link: string;
        }[];
      }
  )[];
  indicatorStyle: {
    left: number;
    width: number;
  };
  setIndicatorStyle: React.Dispatch<
    React.SetStateAction<{
      left: number;
      width: number;
    }>
  >;
}

const NavbarItems = ({
  navbarData,
  indicatorStyle,
  setIndicatorStyle,
}: NavbarItemsProps) => {
  // State to control if the indicator should appear in active color or faded
  const [isIndicatorActive, setIsIndicatorActive] = useState(true);

  return (
    <div
      className="bg-mySecondary h-9 text-white text-xs px-[60px] relative"
      // When mouse leaves the container, mark indicator as inactive (faded)
      onMouseLeave={() => setIsIndicatorActive(false)}
    >
      <ul className="h-9 flex items-center gap-5 relative">
        {navbarData.map((item, idx: number) => (
          <React.Fragment key={idx}>
            <li
              className="group relative h-full flex items-center"
              // On mouse enter update indicator position and activate it
              onMouseEnter={(e) => {
                const target = e.currentTarget;
                setIndicatorStyle({
                  left: target.offsetLeft,
                  width: target.clientWidth,
                });
                setIsIndicatorActive(true);
              }}
            >
              {item.data ? (
                <NavbarPopover item={item} />
              ) : (
                <Link
                  href={item.link}
                  className="hover:text-gray-200 relative inline-block"
                >
                  {item.label}
                </Link>
              )}
            </li>

            {idx === 8 && <li className="border-l border-white h-6 mx-2"></li>}
          </React.Fragment>
        ))}

        {/* Animated Underline Indicator */}
        <div
          className={`absolute bottom-0 h-[4px] rounded transition-all duration-300 ${
            isIndicatorActive ? "bg-red-500" : "bg-red-500 opacity-0"
          }`}
          style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
        ></div>
      </ul>
    </div>
  );
};

export default NavbarItems;
