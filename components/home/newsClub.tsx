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
import { usePublicCopy } from "@/components/site/PublicContentProvider";

/** سبز زیتونی هدف طراحی */
const ACCENT = "#6B7460";
/** مشکی نزدیک به سبز برای سطح کارت */
const CARD_BG = "#0C1410";
const CARD_BG_MID = "#101810";

const NewsClub = () => {
  const copy = usePublicCopy("home-sections");
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
    const toastId = toast.loading(copy("club.sending", "در حال ارسال اطلاعات..."));
    try {
      const res = await subscribeToNewsletter(data);
      if (res.success) {
        toast.success(copy("club.success", "عضویت شما با موفقیت ثبت شد ✅"), { id: toastId });
        reset();
      } else {
        toast.error(copy("club.error", "خطا در ثبت عضویت ❌"), { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error(copy("club.serverError", "خطا در برقراری ارتباط با سرور ❌"), { id: toastId });
    }
  };

  return (
    <section
      className="relative mx-auto mt-10 w-[calc(100%-2rem)] overflow-hidden rounded-[2.5rem] border px-5 py-10 shadow-2xl sm:px-8 md:mt-0 md:w-[calc(100%-4rem)] md:px-12 md:py-14"
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

      <div className="container-xl relative z-10 mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-2 md:gap-10">
        <div className="flex w-full items-center justify-center">
          <div className="relative aspect-[4/3] w-full max-w-[440px]">
            <Image
              src={copy("club.image", "/images/home/news-club/news-club.svg")}
              fill
              alt="باشگاه خبری پیشرو"
              className="object-contain"
            />
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-5 text-center md:items-start md:text-start">
          <span
            className="inline-flex rounded-full border px-4 py-2 text-[11px] font-bold"
            style={{
              borderColor: `${ACCENT}55`,
              backgroundColor: `${ACCENT}22`,
              color: ACCENT,
            }}
          >
            {copy("club.eyebrow", "همیشه یک گام جلوتر")}
          </span>
          <h4 className="flex items-baseline justify-center gap-2 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl md:justify-start lg:text-6xl">
            <span className="inline-block">{copy("club.title", "باشگاه")}</span>
            <span
              className="inline-block"
              style={{ color: ACCENT }}
            >
              {copy("club.titleAccent", "پیشرو")}
            </span>
          </h4>
          <p className="max-w-xl text-sm leading-loose text-white/75 sm:text-base md:text-lg">
            {copy(
              "club.description",
              "با عضویت در باشگاه خبری پیشرو، از تازه‌ترین مقالات آموزشی، نکات تخصصی و تحلیل‌های روز دنیای دیجیتال باخبر شوید و همیشه یک گام جلوتر از رقبا بمانید. جدیدترین مطالب مستقیماً در تلفن همراه شما ارسال خواهد شد."
            )}
          </p>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-md"
          >
            <div className="flex w-full flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Input
                {...register("phone")}
                className="ltr h-11 w-full flex-1 rounded-full border-white/15 bg-black/25 !text-base !text-white shadow-inner backdrop-blur-xl placeholder:text-base placeholder:text-white/45 sm:h-12 sm:!text-lg sm:placeholder:text-lg"
                placeholder={copy("club.phonePlaceholder", "09115829721")}
              />
              <Button
                type="submit"
                className="h-11 shrink-0 rounded-full px-8 text-base font-bold shadow-lg transition-transform duration-300 ease-out hover:scale-105 active:scale-[1.02] sm:h-12 sm:text-lg"
                style={{
                  backgroundColor: ACCENT,
                  color: "#12140F",
                }}
              >
                {copy("club.submit", "عضویت")}
              </Button>
            </div>
            {errors.phone && (
              <p className="mt-2 text-center text-sm text-destructive md:text-start">
                {errors.phone.message}
              </p>
            )}
          </form>
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
        <div className="pointer-events-none absolute -left-10 bottom-8 z-[1] hidden h-[60vh] w-[140px] md:block lg:-left-24 lg:bottom-12 lg:h-[90vh] lg:w-[240px]">
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
