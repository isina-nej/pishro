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
import { subscribeToNewsletter } from "@/services/newsletter";
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
    <section className="relative w-full h-screen pb-16 pt-8">
      <div className="container-xl h-full flex items-center gap-8">
        <div className="flex-1 flex items-end h-full">
          {/* wrapper با نسبت درست */}
          <div className="relative w-full aspect-[661/504]">
            <Image
              src={"/images/home/news-club/news-club.svg"}
              fill
              alt="دکور"
              className="object-cover"
            />
          </div>
        </div>

        {/* form section */}
        <div className="flex-1 flex flex-col h-full justify-end gap-10 items-center">
          <div className="w-full aspect-[685/500] flex flex-col justify-between">
            <div>
              <h4 className="text-7xl font-bold text-mySecondary">
                باشگاه خبری <span className="text-myPrimary">پیشرو</span>
              </h4>
              <p className="mt-8 text-lg text-gray-600 leading-relaxed pl-12">
                با عضویت در باشگاه خبری پیشرو، جدیدترین اخبار و مقالات آموزشی را
                مستقیماً در تلفن همراه خود دریافت کنید.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full pl-32">
              <div className="w-full flex items-center justify-center">
                <Input
                  {...register("phone")}
                  className="rounded-full h-12 ml-2 ltr !text-lg placeholder:text-lg"
                  placeholder="09121234567"
                />
                <Button
                  type="submit"
                  className="bg-mySecondary hover:bg-mySecondary/95 transition-colors h-12 px-12 rounded-full text-white font-medium"
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
        <div className="absolute top-0 right-0 w-[240px] h-[88vh] -z-10">
          <Image
            src={"/images/home/news-club/right-vector.png"}
            fill
            alt="دکور"
          />
        </div>
        <div className="absolute bottom-0 left-0 w-[220px] h-[90vh] -z-10">
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
