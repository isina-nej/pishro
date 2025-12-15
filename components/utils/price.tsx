interface PriceProps {
  price: number; // Base price
  discount?: number; // Discount percentage
}

// Helper function to format number in Persian
const formatPrice = (price: number): string => {
  if (price >= 1_000_000) {
    const millions = Math.floor(price / 1_000_000); // میلیون‌ها
    const thousands = Math.floor((price % 1_000_000) / 1000); // هزارها

    if (thousands === 0) {
      return `${millions.toLocaleString("fa-IR")} میلیون`;
    }
    return `${millions.toLocaleString(
      "fa-IR"
    )} میلیون و ${thousands.toLocaleString("fa-IR")} هزار`;
  } else if (price >= 1000) {
    const thousands = Math.floor(price / 1000);
    return `${thousands.toLocaleString("fa-IR")} هزار`;
  }
  return price.toLocaleString("fa-IR");
};

const Price = ({ price, discount = 0 }: PriceProps) => {
  return (
    <div className="flex items-center gap-1 text-red-600 text-base font-bold">
      {/* Price */}
      <span className="">{formatPrice(price)}</span>
      <span>تومان</span>

      {/* Discount Badge */}
      {discount > 0 && (
        <span className="bg-red-600 text-white text-xs font-bold rounded-full px-2 pb-0 pt-0.5">
          %{discount}
        </span>
      )}
    </div>
  );
};

export default Price;
