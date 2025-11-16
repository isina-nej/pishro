"use client";
import { useState } from "react";
import Image from "next/image";
import { Course } from "@prisma/client";
import { Trash2, Tag, TrendingDown } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { motion } from "framer-motion";

// Accept both Course and serialized versions (with string dates)
type CourseData = Course | (Omit<Course, "createdAt" | "updatedAt"> & {
  createdAt: string | Date;
  updatedAt: string | Date;
});

interface ItemCardProps {
  data: CourseData;
  index?: number;
}

const ItemCard = ({ data, index = 0 }: ItemCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const { removeFromCart } = useCartStore();

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      removeFromCart(data.id);
    }, 300);
  };

  // محاسبه قیمت اصلی بر اساس درصد تخفیف
  const hasDiscount = data.discountPercent && data.discountPercent > 0;
  const originalPrice = hasDiscount
    ? Math.round(data.price / (1 - data.discountPercent! / 100) / 100_000) *
      100_000
    : Math.round(data.price / 100_000) * 100_000;

  const savedAmount = hasDiscount ? originalPrice - data.price : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isRemoving ? 0 : 1,
        y: isRemoving ? -20 : 0,
        scale: isRemoving ? 0.95 : 1
      }}
      transition={{
        duration: 0.3,
        delay: index * 0.1,
        ease: "easeOut"
      }}
      className="w-full h-fit max-w-[410px] bg-white shadow-lg hover:shadow-xl rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300 group"
    >
      {/* Image with overlay */}
      <div className="relative w-full aspect-[16/9] overflow-hidden">
        {/* Discount Badge */}
        {hasDiscount && (
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
            className="absolute top-3 left-3 z-20"
          >
            <div className="bg-gradient-to-br from-myPrimary to-red-600 text-white px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              <span className="text-xs font-bold">{data.discountPercent}٪ تخفیف</span>
            </div>
          </motion.div>
        )}

        {/* Delete Button */}
        <motion.button
          onClick={handleRemove}
          disabled={isRemoving}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-3 right-3 z-20 p-2.5 text-white bg-red-500/90 hover:bg-red-600 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 disabled:opacity-50"
          aria-label="حذف از سبد خرید"
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>

        {/* Image */}
        <div className="relative size-full bg-gradient-to-br from-gray-100 to-gray-200">
          {imageError ? (
            <div className="size-full flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                <Image
                  src="/images/logo.png"
                  alt="placeholder"
                  width={40}
                  height={40}
                  className="opacity-50"
                />
              </div>
              <span className="text-gray-400 text-sm">تصویر در دسترس نیست</span>
            </div>
          ) : (
            <>
              <Image
                src={data.img || ""}
                alt={data.subject}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                onError={() => setImageError(true)}
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Title */}
        <h6 className="font-bold text-lg text-gray-900 line-clamp-2 min-h-[3.5rem] leading-relaxed">
          {data.subject}
        </h6>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem] leading-relaxed">
          {data.description || "توضیحات دوره در دسترس نیست"}
        </p>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Price Section */}
        <div className="space-y-3">
          {/* Saved Amount */}
          {hasDiscount && savedAmount > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg"
            >
              <TrendingDown className="w-4 h-4" />
              <span className="text-xs font-medium">
                شما {savedAmount.toLocaleString("fa-IR")} تومان صرفه‌جویی می‌کنید!
              </span>
            </motion.div>
          )}

          {/* Prices */}
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-medium">قیمت نهایی</p>
              <div className="flex items-center gap-2">
                {hasDiscount && originalPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    {originalPrice.toLocaleString("fa-IR")}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <motion.p
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className={`text-2xl font-black ${
                  hasDiscount ? "text-myPrimary" : "text-gray-900"
                }`}
              >
                {data.price.toLocaleString("fa-IR")}
              </motion.p>
              <span className="text-xs text-gray-500 font-medium">تومان</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ItemCard;
