"use client";

import React, { forwardRef, useImperativeHandle } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import DatePicker from "react-multi-date-picker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/colors/teal.css";
import { ProfileIcon } from "@/public/svgr-icons";
import { updatePersonalInfo } from "@/lib/services/user-service";
import toast from "react-hot-toast";

// تعریف اسکیمای اعتبارسنجی با zod
const personalInfoSchema = z.object({
  firstName: z.string().min(2, "نام باید حداقل 2 حرف باشد"),
  lastName: z.string().min(2, "نام خانوادگی باید حداقل 2 حرف باشد"),
  phone: z
    .string()
    .regex(/^09\d{9}$/, "شماره تماس باید 11 رقمی باشد و با 09 شروع شود"),
  email: z.string().email("نشانی ایمیل نامعتبر است"),
  nationalCode: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{10}$/.test(val), {
      message: "کد ملی باید 10 رقمی باشد",
    }),
  birthDate: z.instanceof(DateObject).nullable(),
});

type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

const PersonalInfoForm = forwardRef((props, ref) => {
  const [loading, setLoading] = React.useState(true);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      nationalCode: "",
      birthDate: null,
    },
  });

  // Fetch user data on mount
  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { getCurrentUser } = await import("@/lib/services/user-service");
        const response = await getCurrentUser();
        const user = response.data;

        setValue("firstName", user.firstName || "");
        setValue("lastName", user.lastName || "");
        setValue("phone", user.phone);
        setValue("email", user.email || "");
        setValue("nationalCode", user.nationalCode || "");

        if (user.birthDate) {
          setValue("birthDate", new DateObject(new Date(user.birthDate)));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("خطا در بارگذاری اطلاعات");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [setValue]);

  const onSubmit = async (data: PersonalInfoFormValues) => {
    try {
      const response = await updatePersonalInfo({
        ...data,
        birthDate: data.birthDate ? data.birthDate.toDate() : null,
      });
      console.log(response);
      toast.success("اطلاعات با موفقیت به‌روزرسانی شد");
    } catch (err) {
      console.log(err);
      toast.error("خطا در به‌روزرسانی اطلاعات");
    }
  };
  useImperativeHandle(ref, () => ({
    submit: handleSubmit(onSubmit),
  }));

  return (
    <div className="bg-[#fafafa] w-full rounded mt-8">
      {/* header */}
      <div className="w-full p-5 border-b border-[#e1e1e1]">
        <h6 className="font-irsans text-xs text-[#4d4d4d] mb-5 flex items-center">
          <ProfileIcon className="size-4 stroke-[#2F2F2F]" />
          <span className="mr-3">
            مشخصات فردی (شخصیت حقوقی هستید؟{" "}
            <button className="text-[#2B93F3]">کلید کنید</button>)
          </span>
        </h6>
      </div>

      {/* form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
          {/* نام */}
          <div>
            <div className="flex items-center">
              <label className="w-[110px] block text-xs font-medium text-[#1a1a1a]">
                نام <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("firstName")}
                disabled={loading}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1 mr-[100px]">
                {errors.firstName.message}
              </p>
            )}
          </div>

          {/* نام خانوادگی */}
          <div>
            <div className="flex items-center">
              <label className="w-[110px] block text-xs font-medium text-[#1a1a1a]">
                نام خانوادگی <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("lastName")}
                disabled={loading}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1 mr-[100px]">
                {errors.lastName.message}
              </p>
            )}
          </div>

          {/* شماره تماس */}
          <div>
            <div className="flex items-center">
              <label className="w-[110px] block text-xs font-medium text-[#1a1a1a]">
                شماره تماس <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                {...register("phone")}
                disabled={loading}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1 mr-[100px]">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* نشانی ایمیل */}
          <div>
            <div className="flex items-center">
              <label className="w-[110px] block text-xs font-medium text-[#1a1a1a]">
                نشانی ایمیل <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                {...register("email")}
                disabled={loading}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 mr-[100px]">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* کد ملی */}
          <div>
            <div className="flex items-center">
              <label className="w-[110px] block text-xs font-medium text-[#1a1a1a]">
                کد ملی
              </label>
              <input
                type="text"
                {...register("nationalCode")}
                disabled={loading}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            {errors.nationalCode && (
              <p className="text-red-500 text-xs mt-1 mr-[100px]">
                {errors.nationalCode.message}
              </p>
            )}
          </div>

          {/* تاریخ تولد */}
          <div>
            <div className="flex items-center">
              <label className="w-[110px] block text-xs font-medium text-[#1a1a1a]">
                تاریخ تولد
              </label>
              <Controller
                control={control}
                name="birthDate"
                render={({ field }) => (
                  <DatePicker
                    value={field.value}
                    onChange={(date: DateObject | null) => field.onChange(date)}
                    calendar={persian}
                    locale={persian_fa}
                    calendarPosition="bottom-right"
                    placeholder="انتخاب تاریخ"
                    inputClass="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    containerClassName="w-full"
                    disabled={loading}
                  />
                )}
              />
            </div>
            {errors.birthDate && (
              <p className="text-red-500 text-xs mt-1 mr-[100px]">
                {errors.birthDate.message as string}
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
});

PersonalInfoForm.displayName = "PersonalInfoForm";
export default PersonalInfoForm;
