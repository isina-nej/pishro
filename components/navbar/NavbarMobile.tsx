"use client";

import { useCallback, useMemo, useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";
import { HiMiniArrowLeftEndOnRectangle } from "react-icons/hi2";
import NavbarLinks from "./NavbarLinks";
import NavbarActions from "./NavbarActions";

type NavbarLinksProps = React.ComponentProps<typeof NavbarLinks>;

type NavbarMobileProps = {
  isDark: boolean;
  navbarData: NavbarLinksProps["navbarData"];
  transitionDuration?: number;
};

const DEFAULT_TRANSITION_DURATION = 300;

const useMobileMenu = (transitionDuration: number) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const openMenu = useCallback(() => {
    setIsMounted(true);
    requestAnimationFrame(() => setIsOpen(true));
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => setIsMounted(false), transitionDuration);
  }, [transitionDuration]);

  return useMemo(
    () => ({
      isMounted,
      isOpen,
      openMenu,
      closeMenu,
    }),
    [closeMenu, isMounted, isOpen, openMenu]
  );
};

const NavbarMobile = ({
  isDark,
  navbarData,
  transitionDuration = DEFAULT_TRANSITION_DURATION,
}: NavbarMobileProps) => {
  const { isMounted, isOpen, openMenu, closeMenu } = useMobileMenu(
    transitionDuration
  );

  return (
    <>
      <div
        className={clsx(
          "fixed top-0 left-0 w-full flex justify-between items-center md:hidden py-2 px-4 z-[100]",
          isOpen
            ? "bg-mySecondary/5 text-white border-b border-white/20"
            : "bg-white/95 backdrop-blur-sm shadow-md"
        )}
      >
        <div className="flex justify-between items-center w-full relative">
          <div className="flex items-center gap-1">
            {isOpen ? (
              <button
                aria-label="بستن منو"
                onClick={closeMenu}
                className="text-2xl focus:outline-none p-2"
              >
                <FiX />
              </button>
            ) : (
              <button
                aria-label="باز کردن منو"
                onClick={openMenu}
                className="text-2xl focus:outline-none p-2"
              >
                <FiMenu />
              </button>
            )}
            <span className="font-bold text-lg -mt-0.5">پیشرو</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className={clsx(
                "border transition-colors pr-2 pl-2 py-1.5 rounded-lg text-sm ml-2",
                !isDark
                  ? "border-white hover:bg-black/20 text-white"
                  : "border-mySecondary hover:bg-mySecondary/10",
                isOpen ? "border-white" : "border-mySecondary"
              )}
            >
              <span className="flex items-center gap-1 font-medium text-xs">
                ورود | ثبت نام
                <HiMiniArrowLeftEndOnRectangle className="size-4" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {isMounted && (
        <div
          className={clsx(
            "fixed inset-0 z-50 flex flex-col pt-20 backdrop-blur-md bg-mySecondary/95 transition-opacity duration-300 ease-out md:hidden",
            isOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          )}
        >
          <div
            className={clsx(
              "transition-transform duration-300 ease-out",
              isOpen ? "translate-y-0" : "-translate-y-4"
            )}
          >
            <NavbarLinks
              navbarData={navbarData}
              onClick={closeMenu}
              className="flex flex-col items-start gap-6 px-8 text-lg text-white"
            />
            <div className="flex flex-col items-center mt-10 gap-4">
              <NavbarActions isDark={isDark} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavbarMobile;

