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
import { Badge } from "@/components/ui/badge";
import EmptyState from "./emptyState";

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
  const map: Record<string, { label: string; variant: "success" | "destructive" }> = {
    paid: { label: "پرداخت شده", variant: "success" },
    failed: { label: "ناموفق", variant: "destructive" },
  };

  if (status === "pending") {
    return (
      <span className="inline-flex rounded-full bg-premium px-2.5 py-1 text-xs font-bold text-premium ring-1 ring-premium/40">
        در انتظار پرداخت
      </span>
    );
  }

  const item = map[status] || { label: status, variant: "success" as const };

  return <Badge variant={item.variant}>{item.label}</Badge>;
};

const DashboardSkeleton = () => (
  <div className="space-y-5">
    <div className="h-44 animate-pulse rounded-2xl bg-muted" />
    <div className="grid gap-4 md:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <div key={item} className="h-28 animate-pulse rounded-2xl bg-muted" />
      ))}
    </div>
  </div>
);

const CourseCard = ({ enrollment }: { enrollment: EnrolledCourse }) => {
  const firstLessonId = enrollment.course.lessons?.[0]?.id;
  const courseHref = firstLessonId
    ? `/courses/view/${enrollment.course.id}?lesson=${firstLessonId}`
    : `/courses/view/${enrollment.course.id}`;

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-40 bg-muted">
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
            <GraduationCap className="size-10 text-muted-foreground" />
          </div>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-card/90 px-2.5 py-1 text-xs font-bold text-foreground shadow-sm backdrop-blur">
          {enrollment.progress}% تکمیل
        </span>
      </div>
      <div className="p-4">
        <Link
          href={courseHref}
          className="line-clamp-1 text-base font-extrabold text-foreground transition hover:text-primary"
        >
          {enrollment.course.subject}
        </Link>
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>پیشرفت دوره</span>
            <span>{enrollment.isCompleted ? "تکمیل شده" : "در حال یادگیری"}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full",
                enrollment.isCompleted ? "bg-success" : "bg-primary"
              )}
              style={{ width: `${enrollment.progress}%` }}
            />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
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
    <div className="divide-y divide-border">
      {orders.slice(0, 5).map((order) => (
        <Link
          key={order.id}
          href="/profile/orders"
          className="flex flex-col gap-3 py-4 transition hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-muted text-primary">
              <ReceiptText className="size-5" />
            </span>
            <div>
              <p className="text-sm font-extrabold text-foreground">
                سفارش {order.itemCount} آیتمی
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatDate(order.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <p className="text-sm font-bold text-foreground">
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
      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="relative p-5 md:p-7">
          <div className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-br from-primary/15 via-success/10 to-transparent blur-3xl" />
          <div className="relative grid gap-6 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-navActiveBg px-3 py-1 text-xs font-bold text-primary">
                <UserRoundCheck className="size-4" />
                حساب کاربری فعال
              </span>
              <h2 className="mt-4 text-2xl font-black leading-9 text-foreground md:text-3xl">
                مسیر یادگیری و سفارش‌هایت اینجاست
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                ادامه دوره‌ها، وضعیت سفارش‌ها و تکمیل پروفایل را از همین پنل
                پیگیری کن؛ بدون نیاز به رفت‌وآمد بین چند صفحه.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
                >
                  ادامه یادگیری
                  <ArrowLeft className="size-4" />
                </Link>
                <Link
                  href="/profile/settings"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-bold text-foreground transition hover:bg-muted"
                >
                  تکمیل پروفایل
                  <Settings className="size-4" />
                </Link>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-muted/50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-foreground">
                    تکمیل پروفایل
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    پروفایل کامل‌تر، تجربه خرید و پشتیبانی بهتر.
                  </p>
                </div>
                <span
                  className={cn(
                    "text-2xl font-black",
                    profileCompletion === 100 ? "text-premium" : "text-primary"
                  )}
                >
                  {profileCompletion}%
                </span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-card">
                <div
                  className={cn(
                    "h-full rounded-full",
                    profileCompletion === 100
                      ? "bg-premium"
                      : "bg-gradient-to-l from-primary to-success"
                  )}
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
              {profileCompletion === 100 && (
                <div className="mt-3">
                  <Badge variant="premium">پروفایل کامل</Badge>
                </div>
              )}
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
            tone: "text-primary bg-primary/40",
          },
          {
            label: "میانگین پیشرفت",
            value: `${averageProgress}%`,
            icon: TrendingUp,
            tone: "text-primary bg-primary/40",
          },
          {
            label: "سفارش‌ها",
            value: stats?.totalOrders || 0,
            icon: ShoppingBag,
            tone: "text-premium bg-premium/40",
          },
          {
            label: "پرداخت موفق اخیر",
            value: paidOrders,
            icon: CreditCard,
            tone: "text-accent bg-accent/40",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div
                className={cn(
                  "flex size-11 items-center justify-center rounded-xl",
                  item.tone
                )}
              >
                <Icon className="size-5" />
              </div>
              <p className="mt-5 text-2xl font-black text-foreground">
                {item.value}
              </p>
              <p className="mt-1 text-sm font-medium text-muted-foreground">
                {item.label}
              </p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border p-5">
            <div>
              <h2 className="text-lg font-black text-foreground">
                ادامه یادگیری
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                آخرین دوره‌هایی که در آن‌ها ثبت‌نام کرده‌ای.
              </p>
            </div>
            <Link
              href="/profile/courses"
              className="text-sm font-bold text-primary transition hover:text-primary/80"
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
                    className="h-72 animate-pulse rounded-2xl bg-muted"
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
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-xl bg-success/10 text-success">
                <CheckCircle2 className="size-5" />
              </span>
              <div>
                <h2 className="text-base font-black text-foreground">
                  وضعیت یادگیری
                </h2>
                <p className="text-sm text-muted-foreground">
                  {completedCourses} دوره تکمیل شده از {courses.length} مورد اخیر
                </p>
              </div>
            </div>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">آخرین عضویت</span>
                <span className="font-bold text-foreground">
                  {formatDate(user?.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">شماره تایید شده</span>
                <span className="font-bold text-foreground">
                  {user?.phoneVerified ? "بله" : "خیر"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-xl bg-premium text-premium/40">
                <Clock3 className="size-5" />
              </span>
              <div>
                <h2 className="text-base font-black text-foreground">
                  پیشنهاد بعدی
                </h2>
                <p className="text-sm text-muted-foreground">
                  یک قدم کوچک برای فعال نگه داشتن حساب.
                </p>
              </div>
            </div>
            <Link
              href={profileCompletion < 100 ? "/profile/settings" : "/courses"}
              className="mt-5 flex items-center justify-between rounded-xl bg-muted px-4 py-3 text-sm font-bold text-foreground transition hover:bg-muted/70"
            >
              {profileCompletion < 100
                ? "اطلاعات پروفایل را کامل کن"
                : "دوره بعدی را انتخاب کن"}
              <ArrowLeft className="size-4" />
            </Link>
          </div>
        </aside>
      </section>

      <section className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h2 className="text-lg font-black text-foreground">
              سفارش‌های اخیر
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              آخرین پرداخت‌ها و خریدهای ثبت‌شده در حساب شما.
            </p>
          </div>
          <Link
            href="/profile/orders"
            className="text-sm font-bold text-primary transition hover:text-primary/80"
          >
            همه سفارش‌ها
          </Link>
        </div>
        <div className="px-5">
          {ordersLoading ? (
            <div className="space-y-3 py-5">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-16 animate-pulse rounded-xl bg-muted" />
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
