"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { userKeys } from "@/lib/hooks/useUser";
import { bookmarkKeys } from "@/lib/hooks/useBookmarks";
import {
  getCurrentUser,
  getEnrolledCourses,
  getUserOrders,
  getUserTransactions,
} from "@/lib/services/user-service";
import { getBookmarks } from "@/lib/services/bookmark-service";

/**
 * ورود به هر صفحه پنل = وارم‌کردن دیتای همه تب‌ها.
 * staleTime هوک‌ها ناوبری بعدی را فوری می‌کند.
 */
// ponytail: تب جدید به پنل اضافه شد کوئری‌اش را اینجا هم پری‌فچ کن
export default function ProfilePrefetch() {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.prefetchQuery({ queryKey: userKeys.me(), queryFn: getCurrentUser });
    queryClient.prefetchQuery({
      queryKey: userKeys.enrolledCourses(1, 9),
      queryFn: () => getEnrolledCourses(1, 9),
    });
    queryClient.prefetchQuery({
      queryKey: userKeys.enrolledCourses(1, 3),
      queryFn: () => getEnrolledCourses(1, 3),
    });
    queryClient.prefetchQuery({
      queryKey: userKeys.orders(1, 10),
      queryFn: () => getUserOrders(1, 10),
    });
    queryClient.prefetchQuery({
      queryKey: userKeys.orders(1, 5),
      queryFn: () => getUserOrders(1, 5),
    });
    queryClient.prefetchQuery({
      queryKey: userKeys.transactions(1, 10),
      queryFn: () => getUserTransactions(1, 10),
    });
    queryClient.prefetchQuery({ queryKey: bookmarkKeys.list(), queryFn: getBookmarks });
  }, [queryClient]);

  return null;
}
