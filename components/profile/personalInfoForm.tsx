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
import { useCurrentUser, useUpdatePersonalInfo } from "@/lib/hooks/useUser";

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
  // استفاده از React Query hooks
  const { data: userResponse, isLoading: loading } = useCurrentUser();
  const updateMutation = useUpdatePersonalInfo();
  const user = userResponse?.data;

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

  // به‌روزرسانی فرم با داده‌های کاربر
  React.useEffect(() => {
    if (user) {
      setValue("firstName", user.firstName || "");
      setValue("lastName", user.lastName || "");
      setValue("phone", user.phone);
      setValue("email", user.email || "");
      setValue("nationalCode", user.nationalCode || "");

      if (user.birthDate) {
        setValue("birthDate", new DateObject(new Date(user.birthDate)));
      }
    }
  }, [user, setValue]);

  const onSubmit = async (data: PersonalInfoFormValues) => {
    updateMutation.mutate({
      ...data,
      birthDate: data.birthDate ? data.birthDate.toDate() : null,
    });
  };
  useImperativeHandle(ref, () => ({
    submit: handleSubmit(onSubmit),
  }));

  return (
    <div className="bg-[#fafafa] w-full rounded mt-6 md:mt-8">
      {/* header */}
      <div className="w-full p-4 md:p-5 border-b border-[#e1e1e1]">
        <h6 className="font-irsans text-xs text-[#4d4d4d] mb-3 md:mb-5 flex items-start md:items-center flex-col md:flex-row gap-2 md:gap-0">
          <ProfileIcon className="size-4 stroke-[#2F2F2F]" />
          <span className="md:mr-3">
            مشخصات فردی (شخصیت حقوقی هستید؟{" "}
            <button className="text-[#2B93F3]">کلید کنید</button>)
          </span>
        </h6>
      </div>

      {/* form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 md:p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 md:gap-x-16 gap-y-4 md:gap-y-6">
          {/* نام */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="w-full sm:w-[110px] block text-xs font-medium text-[#1a1a1a]">
                نام <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("firstName")}
                disabled={loading}
                className="block w-full border border-gray-300 rounded-md p-2 text-sm"
              />
            </div>
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1 sm:mr-[110px]">
                {errors.firstName.message}
              </p>
            )}
          </div>

          {/* نام خانوادگی */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="w-full sm:w-[110px] block text-xs font-medium text-[#1a1a1a]">
                نام خانوادگی <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("lastName")}
                disabled={loading}
                className="block w-full border border-gray-300 rounded-md p-2 text-sm"
              />
            </div>
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1 sm:mr-[110px]">
                {errors.lastName.message}
              </p>
            )}
          </div>

          {/* شماره تماس */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="w-full sm:w-[110px] block text-xs font-medium text-[#1a1a1a]">
                شماره تماس <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                {...register("phone")}
                disabled={loading}
                className="block w-full border border-gray-300 rounded-md p-2 text-sm"
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1 sm:mr-[110px]">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* نشانی ایمیل */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="w-full sm:w-[110px] block text-xs font-medium text-[#1a1a1a]">
                نشانی ایمیل <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                {...register("email")}
                disabled={loading}
                className="block w-full border border-gray-300 rounded-md p-2 text-sm"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 sm:mr-[110px]">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* کد ملی */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="w-full sm:w-[110px] block text-xs font-medium text-[#1a1a1a]">
                کد ملی
              </label>
              <input
                type="text"
                {...register("nationalCode")}
                disabled={loading}
                className="block w-full border border-gray-300 rounded-md p-2 text-sm"
              />
            </div>
            {errors.nationalCode && (
              <p className="text-red-500 text-xs mt-1 sm:mr-[110px]">
                {errors.nationalCode.message}
              </p>
            )}
          </div>

          {/* تاریخ تولد */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="w-full sm:w-[110px] block text-xs font-medium text-[#1a1a1a]">
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
                    inputClass="block w-full border border-gray-300 rounded-md p-2 text-sm"
                    containerClassName="w-full"
                    disabled={loading}
                  />
                )}
              />
            </div>
            {errors.birthDate && (
              <p className="text-red-500 text-xs mt-1 sm:mr-[110px]">
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
