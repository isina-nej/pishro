import { Course } from "@prisma/client";
import ItemCard from "./itemCard";

interface CheckoutMainProps {
  data: Course[];
}

const ShoppingCartMain = ({ data }: CheckoutMainProps) => {
  return (
    <main className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {data.map((item, idx) => (
        <ItemCard key={idx} data={item} index={idx} />
      ))}
    </main>
  );
};

export default ShoppingCartMain;
