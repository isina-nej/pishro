"use client";

import { useEffect, useState, useCallback } from "react";
import FloatingNotification from "./floatingNotification";

interface NotificationState {
  mobileScrollShown: boolean;
  coursesShown: boolean;
}

const FloatingNotificationManager = () => {
  const [currentNotification, setCurrentNotification] = useState<string | null>(
    null
  );
  const [shownNotifications, setShownNotifications] =
    useState<NotificationState>({
      mobileScrollShown: false,
      coursesShown: false,
    });

  const handleClose = useCallback(() => {
    setCurrentNotification(null);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // بررسی اسکرول به بخش MobileScroll
      const mobileScrollSection = document.getElementById("mobile-scroll");
      if (
        mobileScrollSection &&
        !shownNotifications.mobileScrollShown &&
        !currentNotification
      ) {
        const rect = mobileScrollSection.getBoundingClientRect();
        const isVisible =
          rect.top >= 0 &&
          rect.top <= window.innerHeight * 0.7 &&
          rect.bottom >= 0;

        if (isVisible) {
          setCurrentNotification("سلام خوبین؟ نیاز به راهنمایی دارین؟");
          setShownNotifications((prev) => ({
            ...prev,
            mobileScrollShown: true,
          }));
        }
      }

      // بررسی اسکرول به بخش دوره‌ها
      const coursesSection = document.getElementById("courses-section");
      if (
        coursesSection &&
        !shownNotifications.coursesShown &&
        !currentNotification
      ) {
        const rect = coursesSection.getBoundingClientRect();
        const isVisible =
          rect.top >= 0 &&
          rect.top <= window.innerHeight * 0.7 &&
          rect.bottom >= 0;

        if (isVisible) {
          setCurrentNotification("برای خرید دوره‌ها نیاز به کمک دارین؟");
          setShownNotifications((prev) => ({ ...prev, coursesShown: true }));
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // بررسی اولیه

    return () => window.removeEventListener("scroll", handleScroll);
  }, [shownNotifications, currentNotification]);

  return (
    <FloatingNotification
      message={currentNotification || ""}
      isVisible={currentNotification !== null}
      onClose={handleClose}
    />
  );
};

export default FloatingNotificationManager;
