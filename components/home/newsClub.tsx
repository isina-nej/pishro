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
    defaultValues: { email: "" },
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
    <section className="relative w-full h-lvh pb-16 pt-8">
      <div className="container-xl h-full flex items-center gap-8">
        <div className="flex-1 flex items-end h-full">
          {/* wrapper با نسبت درست */}
          <div className="relative w-full aspect-[685/500]">
            <Image
              src={"/images/home/news-club/news-club.png"}
              fill
              alt="دکور"
              className="object-cover"
            />
          </div>
        </div>

        {/* form section */}
        <div className="flex-1 flex flex-col h-full justify-end gap-10 items-center">
          <div className="w-full aspect-[685/500] flex flex-col justify-between">
            <h4 className="text-7xl font-bold text-mySecondary">
              باشگاه خبری <span className="text-myPrimary">پیشرو</span>
            </h4>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full pl-32">
              <div className="w-full flex items-center justify-center">
                <Input
                  {...register("email")}
                  className="rounded-full h-12 ml-2 ltr !text-lg placeholder:text-lg"
                  placeholder="example@mail.com"
                />
                <Button
                  type="submit"
                  className="bg-mySecondary hover:bg-mySecondary/95 transition-colors py-3 px-12 rounded-full text-white font-medium"
                >
                  عضویت
                </Button>
              </div>

              {errors.email && (
                <p className="text-red-500 text-sm mt-2 text-center">
                  {errors.email.message}
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
