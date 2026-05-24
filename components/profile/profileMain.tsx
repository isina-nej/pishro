"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  CreditCard,
  GraduationCap,
  ReceiptText,
  Settings,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  UserRoundCheck,
} from "lucide-react";
import {
  useCurrentUser,
  useEnrolledCourses,
  useUserOrders,
} from "@/lib/hooks/useUser";
import type { EnrolledCourse, UserOrder } from "@/lib/services/user-service";
import { cn } from "@/lib/utils";

const formatDate = (dateString?: string) => {
  if (!dateString) return "ثبت نشده";
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
};

const formatMoney = (value: number) =>
  `${value.toLocaleString("fa-IR")} تومان`;

const getStatusBadge = (status: string) => {
  const map: Record<string, { label: string; className: string }> = {
    paid: {
      label: "پرداخت شده",
      className:
        "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900",
    },
    pending: {
      label: "در انتظار پرداخت",
      className:
        "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900",
    },
    failed: {
      label: "ناموفق",
      className:
        "bg-red-50 text-red-700 ring-red-200 dark:bg-red-950/40 dark:text-red-300 dark:ring-red-900",
    },
  };

  const item = map[status] || {
    label: status,
    className:
      "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-darkBgHidden dark:text-textSecondary dark:ring-borderColor",
  };

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1",
        item.className
      )}
    >
      {item.label}
    </span>
  );
};

const DashboardSkeleton = () => (
  <div className="space-y-5">
    <div className="h-44 animate-pulse rounded-2xl bg-slate-200 dark:bg-cardBg" />
    <div className="grid gap-4 md:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-28 animate-pulse rounded-2xl bg-slate-200 dark:bg-cardBg"
        />
      ))}
    </div>
  </div>
);

const EmptyState = ({
  title,
  description,
  href,
  action,
}: {
  title: string;
  description: string;
  href: string;
  action: string;
}) => (
  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center dark:border-borderColor dark:bg-darkBgHidden/60">
    <Sparkles className="mx-auto size-8 text-myGolden" />
    <h3 className="mt-3 text-base font-extrabold text-slate-950 dark:text-textPrimary">
      {title}
    </h3>
    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-textSecondary">
      {description}
    </p>
    <Link
      href={href}
      className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-mySecondary px-4 py-2 text-sm font-bold text-white transition hover:bg-mySecondary/90 dark:bg-myGolden dark:text-slate-950"
    >
      {action}
      <ArrowLeft className="size-4" />
    </Link>
  </div>
);

const CourseCard = ({ enrollment }: { enrollment: EnrolledCourse }) => {
  const firstLessonId = enrollment.course.lessons?.[0]?.id;
  const courseHref = firstLessonId
    ? `/courses/view/${enrollment.course.id}?lesson=${firstLessonId}`
    : `/courses/view/${enrollment.course.id}`;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-borderColor dark:bg-cardBg">
      <div className="relative h-40 bg-slate-100 dark:bg-darkBgHidden">
        {enrollment.course.img ? (
          <Image
            src={enrollment.course.img}
            alt={enrollment.course.subject}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <GraduationCap className="size-10 text-slate-400" />
          </div>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-slate-700 shadow-sm backdrop-blur dark:bg-cardBg/90 dark:text-textPrimary">
          {enrollment.progress}% تکمیل
        </span>
      </div>
      <div className="p-4">
        <Link
          href={courseHref}
          className="line-clamp-1 text-base font-extrabold text-slate-950 transition hover:text-myPrimary dark:text-textPrimary"
        >
          {enrollment.course.subject}
        </Link>
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-xs text-slate-500 dark:text-textSecondary">
            <span>پیشرفت دوره</span>
            <span>{enrollment.isCompleted ? "تکمیل شده" : "در حال یادگیری"}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-darkBgHidden">
            <div
              className={cn(
                "h-full rounded-full",
                enrollment.isCompleted ? "bg-emerald-500" : "bg-mySecondary"
              )}
              style={{ width: `${enrollment.progress}%` }}
            />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-textSecondary">
          <span>ثبت‌نام</span>
          <span>{formatDate(enrollment.enrolledAt)}</span>
        </div>
      </div>
    </article>
  );
};

const OrdersPreview = ({ orders }: { orders: UserOrder[] }) => {
  if (orders.length === 0) {
    return (
      <EmptyState
        title="هنوز سفارشی ثبت نشده"
        description="بعد از خرید دوره یا سبد سرمایه‌گذاری، وضعیت پرداخت و جزئیات سفارش‌ها اینجا نمایش داده می‌شود."
        href="/courses"
        action="مشاهده دوره‌ها"
      />
    );
  }

  return (
    <div className="divide-y divide-slate-100 dark:divide-borderColor">
      {orders.slice(0, 5).map((order) => (
        <Link
          key={order.id}
          href={`/profile/orders/${order.id}`}
          className="flex flex-col gap-3 py-4 transition hover:bg-slate-50 dark:hover:bg-darkBgHidden sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-slate-100 text-mySecondary dark:bg-darkBgHidden dark:text-myGolden">
              <ReceiptText className="size-5" />
            </span>
            <div>
              <p className="text-sm font-extrabold text-slate-950 dark:text-textPrimary">
                سفارش {order.itemCount} آیتمی
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-textSecondary">
                {formatDate(order.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <p className="text-sm font-bold text-slate-800 dark:text-textPrimary">
              {formatMoney(order.total)}
            </p>
            {getStatusBadge(order.status)}
          </div>
        </Link>
      ))}
    </div>
  );
};

const ProfileMainContent = () => {
  const { data: userResponse, isLoading: userLoading } = useCurrentUser();
  const { data: coursesResponse, isLoading: coursesLoading } =
    useEnrolledCourses(1, 3);
  const { data: ordersResponse, isLoading: ordersLoading } = useUserOrders(1, 5);

  const user = userResponse?.data;
  const courses = coursesResponse?.data?.items || [];
  const orders = ordersResponse?.data?.items || [];
  const stats = user?.stats;
  const completedCourses = courses.filter((item) => item.isCompleted).length;
  const averageProgress =
    courses.length > 0
      ? Math.round(
          courses.reduce((sum, item) => sum + item.progress, 0) / courses.length
        )
      : 0;
  const paidOrders = orders.filter((order) => order.status === "paid").length;
  const profileFields = [
    user?.firstName,
    user?.lastName,
    user?.email,
    user?.nationalCode,
    user?.cardNumber,
    user?.avatarUrl,
  ];
  const profileCompletion = user
    ? Math.round(
        (profileFields.filter(Boolean).length / profileFields.length) * 100
      )
    : 0;

  if (userLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-borderColor dark:bg-cardBg">
        <div className="relative p-5 md:p-7">
          <div className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-br from-myGolden/20 via-myBlue/10 to-transparent blur-3xl" />
          <div className="relative grid gap-6 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-mySecondary dark:bg-darkBgHidden dark:text-myGolden">
                <UserRoundCheck className="size-4" />
                حساب کاربری فعال
              </span>
              <h2 className="mt-4 text-2xl font-black leading-9 text-slate-950 dark:text-textPrimary md:text-3xl">
                مسیر یادگیری و سفارش‌هایت اینجاست
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-textSecondary">
                ادامه دوره‌ها، وضعیت سفارش‌ها و تکمیل پروفایل را از همین پنل
                پیگیری کن؛ بدون نیاز به رفت‌وآمد بین چند صفحه.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 rounded-xl bg-mySecondary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-mySecondary/90 dark:bg-myGolden dark:text-slate-950"
                >
                  ادامه یادگیری
                  <ArrowLeft className="size-4" />
                </Link>
                <Link
                  href="/profile/settings"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-borderColor dark:bg-cardBg dark:text-textPrimary dark:hover:bg-darkBgHidden"
                >
                  تکمیل پروفایل
                  <Settings className="size-4" />
                </Link>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-borderColor dark:bg-darkBgHidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-950 dark:text-textPrimary">
                    تکمیل پروفایل
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-textSecondary">
                    پروفایل کامل‌تر، تجربه خرید و پشتیبانی بهتر.
                  </p>
                </div>
                <span className="text-2xl font-black text-mySecondary dark:text-myGolden">
                  {profileCompletion}%
                </span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white dark:bg-cardBg">
                <div
                  className="h-full rounded-full bg-gradient-to-l from-mySecondary to-myBlue dark:from-myGolden dark:to-myBlue"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "دوره‌های فعال",
            value: stats?.totalEnrollments || 0,
            icon: GraduationCap,
            tone: "text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-950/40",
          },
          {
            label: "میانگین پیشرفت",
            value: `${averageProgress}%`,
            icon: TrendingUp,
            tone: "text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/40",
          },
          {
            label: "سفارش‌ها",
            value: stats?.totalOrders || 0,
            icon: ShoppingBag,
            tone: "text-orange-700 bg-orange-50 dark:text-orange-300 dark:bg-orange-950/40",
          },
          {
            label: "پرداخت موفق اخیر",
            value: paidOrders,
            icon: CreditCard,
            tone: "text-violet-700 bg-violet-50 dark:text-violet-300 dark:bg-violet-950/40",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-borderColor dark:bg-cardBg"
            >
              <div
                className={cn(
                  "flex size-11 items-center justify-center rounded-xl",
                  item.tone
                )}
              >
                <Icon className="size-5" />
              </div>
              <p className="mt-5 text-2xl font-black text-slate-950 dark:text-textPrimary">
                {item.value}
              </p>
              <p className="mt-1 text-sm font-medium text-slate-500 dark:text-textSecondary">
                {item.label}
              </p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-borderColor dark:bg-cardBg">
          <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-borderColor">
            <div>
              <h2 className="text-lg font-black text-slate-950 dark:text-textPrimary">
                ادامه یادگیری
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-textSecondary">
                آخرین دوره‌هایی که در آن‌ها ثبت‌نام کرده‌ای.
              </p>
            </div>
            <Link
              href="/profile/courses"
              className="text-sm font-bold text-mySecondary transition hover:text-myPrimary dark:text-myGolden"
            >
              مشاهده همه
            </Link>
          </div>
          <div className="p-5">
            {coursesLoading ? (
              <div className="grid gap-4 md:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-72 animate-pulse rounded-2xl bg-slate-100 dark:bg-darkBgHidden"
                  />
                ))}
              </div>
            ) : courses.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-3">
                {courses.map((course) => (
                  <CourseCard key={course.id} enrollment={course} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="هنوز دوره‌ای شروع نکرده‌ای"
                description="یک دوره انتخاب کن تا پیشرفت، درس بعدی و وضعیت یادگیری‌ات در داشبورد نمایش داده شود."
                href="/courses"
                action="شروع از دوره‌ها"
              />
            )}
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-borderColor dark:bg-cardBg">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                <CheckCircle2 className="size-5" />
              </span>
              <div>
                <h2 className="text-base font-black text-slate-950 dark:text-textPrimary">
                  وضعیت یادگیری
                </h2>
                <p className="text-sm text-slate-500 dark:text-textSecondary">
                  {completedCourses} دوره تکمیل شده از {courses.length} مورد اخیر
                </p>
              </div>
            </div>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-textSecondary">
                  آخرین عضویت
                </span>
                <span className="font-bold text-slate-900 dark:text-textPrimary">
                  {formatDate(user?.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-textSecondary">
                  شماره تایید شده
                </span>
                <span className="font-bold text-slate-900 dark:text-textPrimary">
                  {user?.phoneVerified ? "بله" : "خیر"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-borderColor dark:bg-cardBg">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                <Clock3 className="size-5" />
              </span>
              <div>
                <h2 className="text-base font-black text-slate-950 dark:text-textPrimary">
                  پیشنهاد بعدی
                </h2>
                <p className="text-sm text-slate-500 dark:text-textSecondary">
                  یک قدم کوچک برای فعال نگه داشتن حساب.
                </p>
              </div>
            </div>
            <Link
              href={profileCompletion < 100 ? "/profile/settings" : "/courses"}
              className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-100 dark:bg-darkBgHidden dark:text-textPrimary dark:hover:bg-bodyBg"
            >
              {profileCompletion < 100
                ? "اطلاعات پروفایل را کامل کن"
                : "دوره بعدی را انتخاب کن"}
              <ArrowLeft className="size-4" />
            </Link>
          </div>
        </aside>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-borderColor dark:bg-cardBg">
        <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-borderColor">
          <div>
            <h2 className="text-lg font-black text-slate-950 dark:text-textPrimary">
              سفارش‌های اخیر
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-textSecondary">
              آخرین پرداخت‌ها و خریدهای ثبت‌شده در حساب شما.
            </p>
          </div>
          <Link
            href="/profile/orders"
            className="text-sm font-bold text-mySecondary transition hover:text-myPrimary dark:text-myGolden"
          >
            همه سفارش‌ها
          </Link>
        </div>
        <div className="px-5">
          {ordersLoading ? (
            <div className="space-y-3 py-5">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-16 animate-pulse rounded-xl bg-slate-100 dark:bg-darkBgHidden"
                />
              ))}
            </div>
          ) : (
            <OrdersPreview orders={orders} />
          )}
        </div>
      </section>
    </div>
  );
};

export default ProfileMainContent;
