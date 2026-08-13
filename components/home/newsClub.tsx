"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  newsletterSchema,
  NewsletterInput,
} from "@/lib/validations/newsletter";
import { subscribeToNewsletter } from "@/lib/services/newsletter";
import toast from "react-hot-toast";

/** همان سبز زیتونی پنل کاربر / دکمه primary پنل */
const ACCENT = "#868C68";
/** مشکی نزدیک به سبز برای سطح کارت */
const CARD_BG = "#0C1410";
const CARD_BG_MID = "#101810";

const NewsClub = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewsletterInput>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { phone: "" },
  });

  const onSubmit = async (data: NewsletterInput) => {
    const toastId = toast.loading("در حال ارسال اطلاعات...");
    try {
      const res = await subscribeToNewsletter(data);
      if (res.success) {
        toast.success("عضویت شما با موفقیت ثبت شد ✅", { id: toastId });
        reset();
      } else {
        toast.error("خطا در ثبت عضویت ❌", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("خطا در برقراری ارتباط با سرور ❌", { id: toastId });
    }
  };

  return (
    <section
      className="relative mx-auto mt-10 min-h-[480px] w-[calc(100%-2rem)] overflow-hidden rounded-[2.5rem] border pb-8 pt-4 shadow-2xl md:mt-0 md:h-screen md:w-[calc(100%-4rem)] md:pb-0 md:pt-8"
      style={{
        background: `linear-gradient(160deg, ${CARD_BG_MID} 0%, ${CARD_BG} 48%, #080E0A 100%)`,
        borderColor: `${ACCENT}33`,
        boxShadow: `0 28px 90px rgba(0,0,0,0.45), inset 0 1px 0 ${ACCENT}22`,
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0"
        style={{
          background: `radial-gradient(ellipse 70% 55% at 80% 20%, ${ACCENT}2E, transparent 60%), radial-gradient(ellipse 50% 40% at 10% 90%, ${ACCENT}14, transparent 55%)`,
        }}
      />

      <div className="container-xl relative z-10 flex h-full flex-col items-center gap-3 md:flex-row md:items-center md:gap-8">
        <div className="order-2 mt-10 flex w-full items-end justify-center md:order-1 md:mt-0 md:h-full md:flex-1 md:justify-start">
          <div className="relative aspect-[1.3] w-full max-w-[400px] md:aspect-[661/504] md:max-w-full">
            <Image
              src={"/images/home/news-club/news-club.svg"}
              fill
              alt="دکور"
              className="object-cover"
            />
          </div>
        </div>

        <div className="order-1 flex w-full flex-1 flex-col items-center justify-end gap-6 md:order-2 md:h-full md:gap-10">
          <div className="flex aspect-[1.1] w-full flex-col justify-between md:aspect-[661/504]">
            <div className="">
              <span
                className="mb-4 mt-2 inline-flex rounded-full border px-4 py-2 text-[11px] font-bold md:mt-16"
                style={{
                  borderColor: `${ACCENT}55`,
                  backgroundColor: `${ACCENT}22`,
                  color: ACCENT,
                }}
              >
                همیشه یک گام جلوتر
              </span>
              <h4 className="flex justify-center gap-2 text-5xl font-black leading-none tracking-tight text-white sm:text-6xl md:justify-start md:gap-3 md:text-start lg:text-7xl">
                <span className="inline-block">باشگاه</span>
                <span
                  className="-translate-y-1 inline-block"
                  style={{ color: ACCENT }}
                >
                  پیشرو
                </span>
              </h4>
              <p className="mt-4 pr-1 text-center text-sm leading-relaxed text-white/75 sm:text-base md:mt-6 md:pl-[60px] md:text-right md:text-lg xl:pl-[128px]">
                با عضویت در باشگاه خبری پیشرو، از تازه‌ترین مقالات آموزشی، نکات
                تخصصی و تحلیل‌های روز دنیای دیجیتال باخبر شوید و همیشه یک گام
                جلوتر از رقبا بمانید. جدیدترین مطالب مستقیماً در تلفن همراه شما
                ارسال خواهد شد.
              </p>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full pb-4 pl-0 md:pb-16 md:pl-32"
            >
              <div className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
                <Input
                  {...register("phone")}
                  className="ltr ml-0 h-10 max-w-[100%] rounded-full border-white/15 bg-black/25 !text-base !text-white shadow-inner backdrop-blur-xl placeholder:text-base placeholder:text-white/45 sm:ml-2 sm:h-12 sm:max-w-[290px] sm:!text-lg sm:placeholder:text-lg"
                  placeholder="09115829721"
                />
                <Button
                  type="submit"
                  className="h-10 w-full rounded-full px-8 text-base font-bold shadow-lg transition-transform duration-300 ease-out hover:scale-105 active:scale-[1.02] sm:h-12 sm:px-16 sm:text-lg md:w-fit"
                  style={{
                    backgroundColor: ACCENT,
                    color: "#12140F",
                  }}
                >
                  عضویت
                </Button>
              </div>
              {errors.phone && (
                <p className="mt-2 text-center text-sm text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      <>
        <div className="pointer-events-none absolute -right-8 top-0 z-[1] hidden h-[50vh] w-[180px] md:block lg:h-[86vh] lg:w-[260px]">
          <Image
            src={"/images/home/news-club/right-vector.png"}
            fill
            alt=""
            className="object-contain opacity-80"
            style={{
              filter:
                "brightness(0) saturate(100%) invert(58%) sepia(12%) saturate(700%) hue-rotate(32deg) brightness(95%) contrast(88%)",
            }}
          />
        </div>
        <div className="pointer-events-none absolute -left-10 bottom-0 z-[1] hidden h-[60vh] w-[140px] md:block lg:-left-24 lg:h-[90vh] lg:w-[240px]">
          <Image
            src={"/images/home/news-club/left-vector.png"}
            fill
            alt=""
            className="object-contain opacity-80"
            style={{
              filter:
                "brightness(0) saturate(100%) invert(58%) sepia(12%) saturate(700%) hue-rotate(32deg) brightness(95%) contrast(88%)",
            }}
          />
        </div>
      </>
    </section>
  );
};

export default NewsClub;
