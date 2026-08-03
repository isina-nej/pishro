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
        <div className="md:flex-1 w-full flex items-end md:h-full justify-center md:justify-start order-2 md:order-1 mt-10 md:mt-0">
          {/* wrapper با نسبت درست */}
          <div className="relative w-full max-w-[400px] md:max-w-full aspect-[1.3] md:aspect-[661/504]">
            <Image
              src={"/images/home/news-club/news-club.svg"}
              fill
              alt="دکور"
              className="object-cover"
            />
          </div>
        </div>

        {/* form section */}
        <div className="flex-1 w-full flex flex-col md:h-full justify-end gap-6 md:gap-10 items-center order-1 md:order-2">
          <div className="w-full aspect-[1.1] md:aspect-[661/504] flex flex-col justify-between">
            <div className="">
              <span className="mb-4 mt-2 inline-flex rounded-full border border-primary/20 bg-card/70 px-4 py-2 text-[11px] font-bold text-primary md:mt-16">همیشه یک گام جلوتر</span>
              <h4 className="flex justify-center gap-2 text-5xl font-black leading-none tracking-tight text-foreground sm:text-6xl md:justify-start md:gap-3 md:text-start lg:text-7xl">
                <span className="inline-block">باشگاه</span>
                <span className="inline-block text-premium -translate-y-1">
                  پیشرو
                </span>
              </h4>
              <p className="mt-4 md:mt-6 text-center md:text-right text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed md:pl-[60px] xl:pl-[128px] pr-1">
                با عضویت در باشگاه خبری پیشرو، از تازه‌ترین مقالات آموزشی، نکات
                تخصصی و تحلیل‌های روز دنیای دیجیتال باخبر شوید و همیشه یک گام
                جلوتر از رقبا بمانید. جدیدترین مطالب مستقیماً در تلفن همراه شما
                ارسال خواهد شد.
              </p>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full pl-0 md:pl-32 pb-4 md:pb-16"
            >
              <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3">
                <Input
                  {...register("phone")}
                  className="ltr ml-0 h-10 max-w-[100%] rounded-full border-border/70 bg-card/70 !text-base shadow-inner backdrop-blur-xl placeholder:text-base placeholder:text-muted-foreground sm:ml-2 sm:h-12 sm:max-w-[290px] sm:!text-lg sm:placeholder:text-lg"
                  placeholder="09115829721"
                />
                <Button
                  type="submit"
                  className="h-10 w-full rounded-full bg-primary px-8 text-base font-bold text-primary-foreground shadow-lg transition hover:-translate-y-0.5 hover:bg-[#1A6B45] sm:h-12 sm:px-16 sm:text-lg md:w-fit"
                >
                  عضویت
                </Button>
              </div>
              {errors.phone && (
                <p className="text-destructive text-sm mt-2 text-center">
                  {errors.phone.message}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* decorations */}
      <>
        <div className="hidden md:block absolute top-0 -right-8 w-[180px] lg:w-[260px] h-[50vh] lg:h-[86vh] -z-10">
          <Image
            src={"/images/home/news-club/right-vector.png"}
            fill
            alt="دکور"
          />
        </div>
        <div className="hidden md:block absolute bottom-0 -left-10 lg:-left-24 w-[140px] lg:w-[240px] h-[60vh] lg:h-[90vh] -z-10">
          <Image
            src={"/images/home/news-club/left-vector.png"}
            fill
            alt="دکور"
          />
        </div>
      </>
    </section>
  );
};

export default NewsClub;
