"use client";

import { useState } from "react";
import ProfileHeader from "./header";
import Link from "next/link";
import Image from "next/image";
import { useEnrolledCourses } from "@/lib/hooks/useUser";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EmptyState from "./emptyState";

const EnrolledCourses = () => {
  const [page, setPage] = useState<number>(1);
  const pageSize = 9;

  // استفاده از React Query hook
  const { data: response, isLoading: loading } = useEnrolledCourses(page, pageSize);
  const courses = response?.data?.items || [];
  const total = response?.data?.pagination?.total || 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  // ===== Loading State =====
  if (loading) {
    return (
      <div className="bg-card rounded-md mb-8 shadow p-10 flex justify-center items-center">
        <div className="relative">
          <div className="w-10 h-10 border-4 border-muted rounded-full"></div>
          <div className="absolute top-0 left-0 w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // ===== Empty State =====
  if (courses.length === 0) {
    return (
      <div className="bg-card rounded-md mb-8 shadow">
        <ProfileHeader>
          <h4 className="font-medium text-sm text-foreground">دوره‌های من</h4>
        </ProfileHeader>
        <div className="p-8">
          <EmptyState
            title="هنوز در دوره‌ای ثبت‌نام نکرده‌ای"
            description="یک دوره انتخاب کن تا پیشرفت و وضعیت یادگیری‌ات اینجا نمایش داده شود."
            href="/courses"
            action="مشاهده دوره‌ها"
          />
        </div>
      </div>
    );
  }

  // ===== Course List =====
  return (
    <div className="bg-card rounded-md mb-8 shadow">
      <ProfileHeader>
        <h4 className="font-medium text-sm text-foreground">
          دوره‌های من ({total})
        </h4>
      </ProfileHeader>

      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map((enrollment) => (
          <div
            key={enrollment.id}
            className="border border-border rounded-lg overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 bg-card"
          >
            {enrollment.course.img && (
              <div className="relative h-40 w-full">
                <Image
                  src={enrollment.course.img}
                  alt={enrollment.course.subject}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            )}
            <div className="p-4">
              <Link
                href={`/courses/view/${enrollment.course.id}`}
                className="text-sm font-medium text-foreground hover:text-primary line-clamp-1"
              >
                {enrollment.course.subject}
              </Link>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>پیشرفت دوره</span>
                  <span>{enrollment.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      enrollment.isCompleted ? "bg-success" : "bg-primary"
                    }`}
                    style={{ width: `${enrollment.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Info */}
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>تاریخ ثبت‌نام:</span>
                <span className="font-irsans">
                  {formatDate(enrollment.enrolledAt)}
                </span>
              </div>

              {/* Completion Badge */}
              {enrollment.isCompleted && (
                <div className="mt-3">
                  <Badge
                    variant="success"
                    className="block w-full rounded-md py-1.5 text-center"
                  >
                    تکمیل شده ✓
                  </Badge>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {total > pageSize && (
        <div className="flex justify-center items-center gap-3 py-5 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            قبلی
          </Button>
          <span className="text-sm text-muted-foreground">
            صفحه {page} از {Math.ceil(total / pageSize)}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= Math.ceil(total / pageSize)}
            onClick={() => setPage((prev) => prev + 1)}
          >
            بعدی
          </Button>
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;
