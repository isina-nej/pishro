"use client";

import React, { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ProfileIcon } from "@/public/svgr-icons";
import { useCurrentUser, useUpdatePayInfo } from "@/lib/hooks/useUser";

// تعریف اسکیمای اعتبارسنجی با zod
const payInfoSchema = z.object({
  cardNumber: z
    .string()
    .regex(/^\d{16}$/, "شماره کارت باید 16 رقم باشد")
    .optional()
    .or(z.literal("")),
  shebaNumber: z
    .string()
    .regex(/^(IR)?\d{24}$/, "شماره شبا باید 24 رقم باشد")
    .optional()
    .or(z.literal("")),
  accountOwner: z
    .string()
    .min(2, "نام صاحب حساب باید حداقل 2 حرف باشد")
    .optional()
    .or(z.literal("")),
});

type PayInfoFormValues = z.infer<typeof payInfoSchema>;

const PayInfoForm = forwardRef((props, ref) => {
  // استفاده از React Query hooks
  const { data: userResponse, isLoading: loading } = useCurrentUser();
  const updateMutation = useUpdatePayInfo();
  const user = userResponse?.data;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PayInfoFormValues>({
    resolver: zodResolver(payInfoSchema),
    defaultValues: {
      cardNumber: "",
      shebaNumber: "",
      accountOwner: "",
    },
  });

  // به‌روزرسانی فرم با داده‌های کاربر
  React.useEffect(() => {
    if (user) {
      setValue("cardNumber", user.cardNumber || "");
      setValue("shebaNumber", user.shebaNumber || "");
      setValue("accountOwner", user.accountOwner || "");
    }
  }, [user, setValue]);

  const onSubmit = async (data: PayInfoFormValues) => {
    updateMutation.mutate({
      cardNumber: data.cardNumber || "",
      shebaNumber: data.shebaNumber || "",
      accountOwner: data.accountOwner || "",
    });
  };

  useImperativeHandle(ref, () => ({
    submit: handleSubmit(onSubmit),
  }));

  return (
    <div className="bg-[#fafafa] w-full rounded mt-8">
      {/* هدر */}
      <div className="w-full p-5 border-b border-[#e1e1e1]">
        <h6 className="font-irsans text-xs text-[#4d4d4d] mb-5 flex items-center">
          <ProfileIcon className="size-4 stroke-[#2F2F2F]" />
          <span className="mr-3">اطلاعات بانکی</span>
        </h6>
        <p className="font-medium text-xs text-[#4D4D4D]">
          لطفاً اطلاعات بانکی خود را برای بازگشت وجه وارد کنید
        </p>
      </div>

      {/* form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-5">
        <div className="grid grid-cols-1 gap-y-6">
          {/* شماره کارت */}
          <div>
            <div className="flex items-center">
              <label className="w-[150px] block text-xs font-medium text-[#1a1a1a]">
                شماره کارت
              </label>
              <input
                type="text"
                {...register("cardNumber")}
                disabled={loading}
                placeholder="1234567812345678"
                maxLength={16}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-left"
                dir="ltr"
              />
            </div>
            {errors.cardNumber && (
              <p className="text-red-500 text-xs mt-1 mr-[150px]">
                {errors.cardNumber.message}
              </p>
            )}
          </div>

          {/* شماره شبا */}
          <div>
            <div className="flex items-center">
              <label className="w-[150px] block text-xs font-medium text-[#1a1a1a]">
                شماره شبا
              </label>
              <div className="flex-1 flex items-center">
                <span className="text-sm font-medium text-gray-600 ml-2">
                  IR
                </span>
                <input
                  type="text"
                  {...register("shebaNumber")}
                  disabled={loading}
                  placeholder="012345678901234567890123"
                  maxLength={24}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-left"
                  dir="ltr"
                />
              </div>
            </div>
            {errors.shebaNumber && (
              <p className="text-red-500 text-xs mt-1 mr-[150px]">
                {errors.shebaNumber.message}
              </p>
            )}
          </div>

          {/* نام صاحب حساب */}
          <div>
            <div className="flex items-center">
              <label className="w-[150px] block text-xs font-medium text-[#1a1a1a]">
                نام صاحب حساب
              </label>
              <input
                type="text"
                {...register("accountOwner")}
                disabled={loading}
                placeholder="نام و نام خانوادگی"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            {errors.accountOwner && (
              <p className="text-red-500 text-xs mt-1 mr-[150px]">
                {errors.accountOwner.message}
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
});

PayInfoForm.displayName = "PayInfoForm";
export default PayInfoForm;
