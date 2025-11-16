// @/stores/cart-store.ts

import { Course } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Accept both Course and serialized versions (with string dates)
type CourseData = Course | (Omit<Course, "createdAt" | "updatedAt"> & {
  createdAt: string | Date;
  updatedAt: string | Date;
});

interface CartStore {
  items: CourseData[];
  addToCart: (course: CourseData) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (course) => {
        const items = get().items;
        const exists = items.find((item) => item.id === course.id);
        if (!exists) {
          set({ items: [...items, course] });
        }
      },

      removeFromCart: (id) =>
        set({ items: get().items.filter((item) => item.id !== id) }),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
    }
  )
);
