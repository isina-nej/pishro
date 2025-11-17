"use client";
import { useState } from "react";
import Image from "next/image";
import { Trash2, Tag, TrendingDown, Wallet, Clock, BarChart3 } from "lucide-react";
import { useCartStore, CartItem, isCourse, isPortfolio } from "@/stores/cart-store";
import { motion } from "framer-motion";

interface ItemCardProps {
  data: CartItem;
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

  // بررسی نوع آیتم
  const itemIsCourse = isCourse(data);
  const itemIsPortfolio = isPortfolio(data);

  // محاسبه قیمت اصلی بر اساس درصد تخفیف (فقط برای دوره‌ها)
  const hasDiscount = itemIsCourse && data.discountPercent && data.discountPercent > 0;
  const originalPrice = hasDiscount && itemIsCourse
    ? Math.round(data.price / (1 - data.discountPercent! / 100) / 100_000) *
      100_000
    : itemIsCourse
    ? Math.round(data.price / 100_000) * 100_000
    : 0;

  const savedAmount = hasDiscount ? originalPrice - data.price : 0;

  // برای investment portfolios
  const getRiskLabel = (type: string) => {
    switch (type) {
      case "low":
        return "کم‌ریسک";
      case "medium":
        return "متوسط";
      case "high":
        return "پرریسک";
      default:
        return "متوسط";
    }
  };

  const getRiskColor = (type: string) => {
    switch (type) {
      case "low":
        return "text-green-600 bg-green-50";
      case "medium":
        return "text-orange-600 bg-orange-50";
      case "high":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  // Render برای دوره‌ها
  if (itemIsCourse) {
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
  }

  // Render برای Investment Portfolios
  if (itemIsPortfolio) {
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
        {/* Header with delete button */}
        <div className="relative w-full bg-gradient-to-br from-mySecondary to-emerald-700 p-6">
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

          <div className="flex items-center gap-3 text-white">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h6 className="font-bold text-lg">سبد سرمایه‌گذاری</h6>
              <p className="text-sm text-white/80">
                {getRiskLabel(data.portfolioType)}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Portfolio Details */}
          <div className="grid grid-cols-2 gap-3">
            {/* Amount */}
            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
              <Wallet className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-xs text-gray-600 mb-1">مبلغ سرمایه</p>
                <p className="text-sm font-bold text-gray-900">
                  {data.portfolioAmount.toLocaleString("fa-IR")} تومان
                </p>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-start gap-2 p-3 bg-purple-50 rounded-lg">
              <Clock className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <p className="text-xs text-gray-600 mb-1">مدت زمان</p>
                <p className="text-sm font-bold text-gray-900">
                  {data.portfolioDuration} ماه
                </p>
              </div>
            </div>
          </div>

          {/* Risk Level Badge */}
          <div className="flex justify-center">
            <span
              className={`inline-block px-4 py-2 rounded-lg border-2 font-bold text-sm ${getRiskColor(
                data.portfolioType
              )}`}
            >
              {getRiskLabel(data.portfolioType)}
            </span>
          </div>

          {/* Expected Return */}
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600 mb-1 text-center">بازده تخمینی</p>
            <p className="text-lg font-bold text-green-700 text-center">
              {data.expectedReturn.toLocaleString("fa-IR")} تومان
            </p>
            <p className="text-xs text-gray-500 text-center mt-1">
              نرخ ماهیانه: {(data.monthlyRate * 100).toFixed(0)}٪
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200" />

          {/* Price Section */}
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-medium">هزینه سبد</p>
            </div>
            <div className="flex flex-col items-end">
              <motion.p
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="text-2xl font-black text-mySecondary"
              >
                {data.price.toLocaleString("fa-IR")}
              </motion.p>
              <span className="text-xs text-gray-500 font-medium">تومان</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Fallback (should never happen)
  return null;
};

export default ItemCard;
