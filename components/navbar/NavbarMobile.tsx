"use client";

import { useCallback, useMemo, useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";
import { HiMiniArrowLeftEndOnRectangle } from "react-icons/hi2";
import NavbarLinks from "./NavbarLinks";
import NavbarActions from "./NavbarActions";
import useHideOnScroll from "./useHideOnScroll";
import SiteLogo from "@/components/branding/SiteLogo";

type NavbarLinksProps = React.ComponentProps<typeof NavbarLinks>;

type NavbarMobileProps = {
  isDark: boolean;
  navbarData: NavbarLinksProps["navbarData"];
  logoUrl?: string;
  siteName?: string;
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
  logoUrl,
  siteName,
  transitionDuration = DEFAULT_TRANSITION_DURATION,
}: NavbarMobileProps) => {
  const { isMounted, isOpen, openMenu, closeMenu } =
    useMobileMenu(transitionDuration);
  const isHidden = useHideOnScroll({ disabled: isOpen });

  return (
    <>
      <div
        className={clsx(
          "fixed top-0 left-0 w-full flex justify-between items-center md:hidden py-2 px-4 z-[9999] transition-transform duration-300",
          isHidden ? "-translate-y-full" : "translate-y-0",
          isOpen
            ? "bg-transparent text-foreground border-b border-border/20"
            : "bg-card dark:bg-cardBg shadow-md"
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
            <SiteLogo
              logoUrl={logoUrl}
              siteName={siteName}
              className="h-8 w-[96px]"
              priority
            />
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className={clsx(
                "border transition-colors pr-2 pl-2 py-1.5 rounded-lg text-sm ml-2",
                isDark
                  ? "border-border hover:bg-background/20 text-foreground"
                  : "border-muted-foreground/50 text-muted-foreground hover:bg-muted/60",
                isOpen ? "border-border" : ""
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
            "fixed inset-0 z-[9998] flex flex-col pt-20 bg-background transition-opacity duration-300 ease-out md:hidden overflow-hidden",
            isOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          )}
        >
          <div
            className={clsx(
              "transition-transform duration-300 ease-out h-full flex flex-col justify-between overflow-y-auto",
              isOpen ? "translate-y-0" : "-translate-y-4"
            )}
          >
            <NavbarLinks
              navbarData={navbarData}
              onClick={closeMenu}
              className="flex flex-col items-start gap-6 px-4 text-lg text-foreground"
            />
            <div className="flex flex-col items-center mt-10 pb-10 gap-4">
              <NavbarActions isDark={true} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavbarMobile;
