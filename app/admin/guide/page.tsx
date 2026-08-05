"use client";

import AdminGuidePage from "@/components/admin/guide/AdminGuidePage";
import { AdminLoadingState } from "@/components/admin/AdminPageShell";
import { useAdminAuth } from "@/lib/hooks/useAdminAuth";

export default function AdminGuideRoutePage() {
  const { user, isLoading } = useAdminAuth();

  if (isLoading) {
    return <AdminLoadingState label="در حال بارگذاری آموزش پنل..." />;
  }

  if (!user) return null;

  return <AdminGuidePage user={user} />;
}
