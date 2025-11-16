import { Course } from "@prisma/client";
import ItemCard from "./itemCard";

// Accept both Course and serialized versions (with string dates)
type CourseData = Course | (Omit<Course, "createdAt" | "updatedAt"> & {
  createdAt: string | Date;
  updatedAt: string | Date;
});

interface CheckoutMainProps {
  data: CourseData[];
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
