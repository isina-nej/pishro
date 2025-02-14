import { Button } from "@/components/ui/button";

interface CheckoutSidebarProps {
  data: {
    price: number;
    off: number;
    lastPrice: number;
  };
  setStep: (i: "shoppingCart" | "pay") => void;
}

const CheckoutSidebar = ({ data, setStep }: CheckoutSidebarProps) => {
  const price = data.price.toLocaleString("fa-IR");
  const off = data.off.toLocaleString("fa-IR");
  const lastPrice = data.lastPrice.toLocaleString("fa-IR");

  return (
    <aside>
      <div className="w-[306px] bg-[#fafafa] rounded-sm pt-4 pb-10">
        <div className="mb-3 border-b px-4">
          <p className="font-medium text-sm mb-5">دوره های منتخب شما</p>
        </div>
        <div className="px-4 flex flex-col gap-5 font-medium text-sm text-[#666666] pb-4 border-b">
          <div className="flex justify-between items-center">
            <span>قیمت دوره :</span>
            <span className="line-through">{price}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>سود شما از خرید :</span>
            <span>{off}</span>
          </div>
          <div className="flex justify-between items-center font-bold">
            <span>قیمت نهایی :</span>
            <span className="text-[#d52a16]">{lastPrice}</span>
          </div>
        </div>
        <Button
          onClick={() => setStep("pay")}
          variant={"destructive"}
          className="mt-10 w-full mx-4"
        >
          ادامه
        </Button>
      </div>
    </aside>
  );
};

export default CheckoutSidebar;
