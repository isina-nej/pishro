import ItemCard from "./itemCard";

interface CheckoutMainProps {
  data: {
    title: string;
    image: string;
    price: number;
  }[];
}

const ShoppingCartMain = ({ data }: CheckoutMainProps) => {
  return (
    <main className="grid grid-cols-2 gap-4 w-full">
      {data.map((item, idx) => (
        <ItemCard key={idx} data={item} />
      ))}
    </main>
  );
};

export default ShoppingCartMain;
