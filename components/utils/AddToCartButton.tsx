"use client";

import { Course } from "@prisma/client";
import { useCartStore } from "@/stores/cart-store";
import toast from "react-hot-toast";
import { LuShoppingCart } from "react-icons/lu";
import { useSession } from "next-auth/react";
import {
  enrollFreeCourse,
  isFreeCourse,
  redirectToLoginForFreeCourse,
} from "@/lib/free-course-enrollment";

interface AddToCartButtonProps {
  course: Course;
}

export default function AddToCartButton({ course }: AddToCartButtonProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const items = useCartStore((state) => state.items);
  const { data: session } = useSession();

  const isInCart = items.some((item) => item.id === course.id);
  const freeCourse = isFreeCourse(course);

  const handleAddToCart = async () => {
    if (freeCourse) {
      if (!session?.user) {
        redirectToLoginForFreeCourse(course.id);
        return;
      }

      try {
        await enrollFreeCourse(course.id);
        toast.success(`«${course.subject}» به فهرست دوره‌های شما اضافه شد`);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "خطا در ثبت‌نام دوره رایگان");
      }
      return;
    }

    if (isInCart) {
      toast.success("این دوره قبلاً به سبد خرید اضافه شده است");
      return;
    }

    addToCart(course);
    toast.success(`«${course.subject}» به سبد خرید اضافه شد 🛒`);
  };

  return (
    <button
      onClick={handleAddToCart}
      className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-base shadow-lg hover:opacity-90 transition ${
        !freeCourse && isInCart
          ? "bg-accent dark:bg-darkBgHidden dark:bg-darkBgHidden0 text-primary-foreground cursor-not-allowed"
          : "bg-mySecondary text-primary-foreground"
      }`}
      disabled={!freeCourse && isInCart}
    >
      <LuShoppingCart size={20} />
      {freeCourse ? "ثبت‌نام رایگان" : isInCart ? "در سبد خرید" : "افزودن به سبد خرید"}
    </button>
  );
}
