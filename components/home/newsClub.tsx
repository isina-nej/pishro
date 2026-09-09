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

/* ponytail: palette-driven via --home-* vars; hardcode olive only if NewsClub needs own brand */
const CARD_BG = "var(--home-bg-mid)";
const CARD_BG_MID = "var(--home-bg)";

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
        background: `linear-gradient(160deg, ${CARD_BG_MID} 0%, ${CARD_BG} 48%, var(--home-bg) 100%)`,
        borderColor: "color-mix(in srgb, var(--home-glow) 25%, transparent)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 80% 20%, color-mix(in srgb, var(--home-glow) 18%, transparent), transparent 60%), radial-gradient(ellipse 50% 40% at 10% 90%, color-mix(in srgb, var(--home-glow) 8%, transparent), transparent 55%)",
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
            className="inline-flex rounded-full border border-[color-mix(in_srgb,var(--home-glow)_35%,transparent)] bg-[color-mix(in_srgb,var(--home-glow)_13%,transparent)] px-4 py-2 text-[11px] font-bold text-[var(--home-glow)]"
          >
            {copy("club.eyebrow", "همیشه یک گام جلوتر")}
          </span>
          <h4 className="flex items-baseline justify-center gap-2 text-4xl font-black leading-tight tracking-tight text-[var(--home-ink)] sm:text-5xl md:justify-start lg:text-6xl">
            <span className="inline-block">{copy("club.title", "باشگاه")}</span>
            <span className="inline-block text-[var(--home-glow)]">
              {copy("club.titleAccent", "پیشرو")}
            </span>
          </h4>
          <p className="max-w-xl text-sm leading-loose text-[var(--home-muted)] sm:text-base md:text-lg">
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
                className="ltr h-11 w-full flex-1 rounded-full border-border bg-card !text-base !text-foreground shadow-inner backdrop-blur-xl placeholder:text-base placeholder:text-muted-foreground sm:h-12 sm:!text-lg sm:placeholder:text-lg"
                placeholder={copy("club.phonePlaceholder", "09115829721")}
              />
              <Button
                type="submit"
                className="h-11 shrink-0 rounded-full bg-[var(--btn-primary-bg)] px-8 text-base font-bold text-primary-foreground shadow-lg transition-all duration-300 ease-out hover:scale-105 hover:bg-[var(--btn-primary-hover)] active:scale-[1.02] sm:h-12 sm:text-lg"
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
            className="object-contain opacity-40 dark:opacity-80"
          />
        </div>
        <div className="pointer-events-none absolute -left-10 bottom-8 z-[1] hidden h-[60vh] w-[140px] md:block lg:-left-24 lg:bottom-12 lg:h-[90vh] lg:w-[240px]">
          <Image
            src={"/images/home/news-club/left-vector.png"}
            fill
            alt=""
            className="object-contain opacity-40 dark:opacity-80"
          />
        </div>
      </>
    </section>
  );
};

export default NewsClub;
