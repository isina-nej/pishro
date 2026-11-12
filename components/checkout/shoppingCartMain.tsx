import ItemCard from "./itemCard";
import type { CartItem } from "@/stores/cart-store";
import { ShoppingBag } from "lucide-react";

interface CheckoutMainProps { data: CartItem[] }

export default function ShoppingCartMain({ data }: CheckoutMainProps) {
  return (
    <main className="overflow-hidden rounded-[1.65rem] border border-border/75 bg-card shadow-[0_24px_70px_-40px_rgba(0,0,0,.28)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/75 px-5 py-6 sm:px-7">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary"><ShoppingBag className="size-5" /></span>
          <div>
            <h2 className="text-xl font-black text-foreground">محصولات انتخاب‌شده</h2>
            <p className="mt-1 text-xs text-muted-foreground">اقلام سبد را قبل از ادامه بررسی کنید.</p>
          </div>
        </div>
        <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground">{data.length.toLocaleString("fa-IR")} مورد</span>
      </div>
      <div className="space-y-4 p-4 sm:p-6">
        {data.map((item, idx) => <ItemCard key={item.id} data={item} index={idx} />)}
      </div>
    </main>
  );
}
