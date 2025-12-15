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
    <section className="relative w-full min-h-[480px] h-[90vh] md:h-screen pb-8 md:pb-0 pt-4 md:pt-8 mt-20 md:mt-0">
      <div className="container-xl h-full flex flex-col md:flex-row items-center md:items-center md:gap-8 gap-3">
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
              <h4 className="flex justify-center md:justify-start md:text-start text-6xl sm:text-7xl lg:text-8xl leading-none font-semibold text-mySecondary mt-2 md:mt-16 gap-2 md:gap-3">
                <span className="inline-block">باشگاه</span>
                <span className="inline-block text-[#8E8E8E] -translate-y-1">
                  پیشرو
                </span>
              </h4>
              <p className="mt-4 md:mt-6 text-center md:text-right text-sm sm:text-base md:text-lg text-gray-400 leading-relaxed md:pl-[60px] xl:pl-[128px] pr-1">
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
                  className="rounded-full h-10 sm:h-12 ml-0 sm:ml-2 ltr !text-base sm:!text-lg max-w-[100%] sm:max-w-[290px] placeholder:text-base sm:placeholder:text-lg"
                  placeholder="09121234567"
                />
                <Button
                  type="submit"
                  className="w-full md:w-fit bg-mySecondary hover:bg-mySecondary/95 transition-colors h-10 sm:h-12 px-8 sm:px-16 rounded-full text-white text-base sm:text-lg font-medium"
                >
                  عضویت
                </Button>
              </div>
              {errors.phone && (
                <p className="text-red-500 text-sm mt-2 text-center">
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
