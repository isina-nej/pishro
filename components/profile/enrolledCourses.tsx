"use client";

import { useEffect, useState } from "react";
import ProfileHeader from "./header";
import Link from "next/link";
import Image from "next/image";
import {
  getEnrolledCourses,
  EnrolledCourse,
} from "@/lib/services/user-service";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

const EnrolledCourses = () => {
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const pageSize = 9;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await getEnrolledCourses(page, pageSize);
        setCourses(response.data.items);
        setTotal(response.data.pagination.total);
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
        toast.error("خطا در دریافت دوره‌ها");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [page]);

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
      <div className="bg-white rounded-md mb-8 shadow p-10 flex justify-center items-center">
        <div className="relative">
          <div className="w-10 h-10 border-4 border-blue-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // ===== Empty State =====
  if (courses.length === 0) {
    return (
      <div className="bg-white rounded-md mb-8 shadow">
        <ProfileHeader>
          <h4 className="font-medium text-sm text-[#131834]">دوره‌های من</h4>
        </ProfileHeader>
        <div className="p-12 text-center text-gray-500">
          هنوز در دوره‌ای ثبت‌نام نکرده‌اید
        </div>
      </div>
    );
  }

  // ===== Course List =====
  return (
    <div className="bg-white rounded-md mb-8 shadow">
      <ProfileHeader>
        <h4 className="font-medium text-sm text-[#131834]">
          دوره‌های من ({total})
        </h4>
      </ProfileHeader>

      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map((enrollment) => (
          <div
            key={enrollment.id}
            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 bg-white"
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
                href={`/class/${enrollment.course.id}`}
                className="text-sm font-medium text-gray-900 hover:text-blue-600 line-clamp-1"
              >
                {enrollment.course.subject}
              </Link>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>پیشرفت دوره</span>
                  <span>{enrollment.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      enrollment.isCompleted ? "bg-green-500" : "bg-blue-500"
                    }`}
                    style={{ width: `${enrollment.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Info */}
              <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <span>تاریخ ثبت‌نام:</span>
                <span className="font-irsans">
                  {formatDate(enrollment.enrolledAt)}
                </span>
              </div>

              {/* Completion Badge */}
              {enrollment.isCompleted && (
                <div className="mt-3 w-full py-1.5 text-center text-xs font-medium rounded bg-green-100 text-green-600">
                  تکمیل شده ✓
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {total > pageSize && (
        <div className="flex justify-center items-center gap-3 py-5 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            قبلی
          </Button>
          <span className="text-sm text-gray-600">
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
