"use client";

import { Course } from "@prisma/client";
import { useCartStore } from "@/stores/cart-store";
import toast from "react-hot-toast";
import { LuShoppingCart } from "react-icons/lu";

interface AddToCartButtonProps {
  course: Course;
}

export default function AddToCartButton({ course }: AddToCartButtonProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const items = useCartStore((state) => state.items);

  const isInCart = items.some((item) => item.id === course.id);

  const handleAddToCart = () => {
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
        isInCart
          ? "bg-gray-400 dark:bg-darkBgHidden dark:bg-gray-500 dark:bg-gray-50 dark:bg-darkBgHidden0 text-white cursor-not-allowed"
          : "bg-mySecondary text-white"
      }`}
      disabled={isInCart}
    >
      <LuShoppingCart size={20} />
      {isInCart ? "در سبد خرید" : "افزودن به سبد خرید"}
    </button>
  );
}
