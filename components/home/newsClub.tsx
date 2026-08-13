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

const OLIVE = "#6B7F3C";

const NewsClub = () => {
  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewsletterInput>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { phone: "" },
  });

  // handle submit
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
    <section className="relative mx-auto mt-10 min-h-[480px] w-[calc(100%-2rem)] overflow-hidden rounded-[2.5rem] border border-border/60 bg-card/55 pb-8 pt-4 shadow-2xl shadow-primary/10 backdrop-blur-2xl/10/[0.05] md:mt-0 md:h-screen md:w-[calc(100%-4rem)] md:pb-0 md:pt-8">
      <div className="container-xl flex h-full flex-col items-center gap-3 md:flex-row md:items-center md:gap-8">
        <div className="order-2 mt-10 flex w-full items-end justify-center md:order-1 md:mt-0 md:h-full md:flex-1 md:justify-start">
          {/* wrapper با نسبت درست */}
          <div className="relative aspect-[1.3] w-full max-w-[400px] md:aspect-[661/504] md:max-w-full">
            <Image
              src={"/images/home/news-club/news-club.svg"}
              fill
              alt="دکور"
              className="object-cover"
            />
          </div>
        </div>

        {/* form section */}
        <div className="order-1 flex w-full flex-1 flex-col items-center justify-end gap-6 md:order-2 md:h-full md:gap-10">
          <div className="flex aspect-[1.1] w-full flex-col justify-between md:aspect-[661/504]">
            <div className="">
              <span
                className="mb-4 mt-2 inline-flex rounded-full border px-4 py-2 text-[11px] font-bold md:mt-16"
                style={{
                  borderColor: `${OLIVE}55`,
                  backgroundColor: `${OLIVE}18`,
                  color: OLIVE,
                }}
              >
                همیشه یک گام جلوتر
              </span>
              <h4 className="flex justify-center gap-2 text-5xl font-black leading-none tracking-tight text-foreground sm:text-6xl md:justify-start md:gap-3 md:text-start lg:text-7xl">
                <span className="inline-block">باشگاه</span>
                <span
                  className="-translate-y-1 inline-block"
                  style={{ color: OLIVE }}
                >
                  پیشرو
                </span>
              </h4>
              <p className="mt-4 pr-1 text-center text-sm leading-relaxed text-muted-foreground sm:text-base md:mt-6 md:pl-[60px] md:text-right md:text-lg xl:pl-[128px]">
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
                  className="ltr ml-0 h-10 max-w-[100%] rounded-full border-border/70 bg-background !text-base !text-foreground shadow-inner backdrop-blur-xl placeholder:text-base placeholder:text-muted-foreground sm:ml-2 sm:h-12 sm:max-w-[290px] sm:!text-lg sm:placeholder:text-lg"
                  placeholder="09115829721"
                />
                <Button
                  type="submit"
                  className="h-10 w-full rounded-full bg-[#6B7F3C] px-8 text-base font-bold text-white shadow-lg transition-transform duration-300 ease-out hover:scale-105 hover:bg-[#6B7F3C] active:scale-[1.02] sm:h-12 sm:px-16 sm:text-lg md:w-fit"
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

      {/* decorations — olive-tinted to match theme */}
      <>
        <div className="absolute -right-8 top-0 -z-10 hidden h-[50vh] w-[180px] md:block lg:h-[86vh] lg:w-[260px]">
          <Image
            src={"/images/home/news-club/right-vector.png"}
            fill
            alt="دکور"
            className="object-contain opacity-80"
            style={{
              filter:
                "brightness(0) saturate(100%) invert(46%) sepia(24%) saturate(900%) hue-rotate(42deg) brightness(95%) contrast(90%)",
            }}
          />
        </div>
        <div className="absolute -left-10 bottom-0 -z-10 hidden h-[60vh] w-[140px] md:block lg:-left-24 lg:h-[90vh] lg:w-[240px]">
          <Image
            src={"/images/home/news-club/left-vector.png"}
            fill
            alt="دکور"
            className="object-contain opacity-80"
            style={{
              filter:
                "brightness(0) saturate(100%) invert(46%) sepia(24%) saturate(900%) hue-rotate(42deg) brightness(95%) contrast(90%)",
            }}
          />
        </div>
      </>
    </section>
  );
};

export default NewsClub;
