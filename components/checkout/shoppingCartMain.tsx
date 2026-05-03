import ItemCard from "./itemCard";
import { CartItem } from "@/stores/cart-store";

interface CheckoutMainProps {
  data: CartItem[];
}

const ShoppingCartMain = ({ data }: CheckoutMainProps) => {
  return (
    <main className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {data.map((item, idx) => (
        <ItemCard key={item.id} data={item} index={idx} />
      ))}
    </main>
  );
};

export default ShoppingCartMain;
