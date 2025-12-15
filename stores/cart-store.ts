// @/stores/cart-store.ts

import { Course } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Accept both Course and serialized versions (with string dates)
type CourseData = Course | (Omit<Course, "createdAt" | "updatedAt"> & {
  createdAt: string | Date;
  updatedAt: string | Date;
});

// Investment Portfolio item type
export interface InvestmentPortfolioItem {
  id: string; // unique ID for the cart item
  type: "portfolio";
  portfolioType: "low" | "medium" | "high";
  portfolioAmount: number;
  portfolioDuration: number;
  expectedReturn: number;
  monthlyRate: number;
  price: number;
}

// Union type for cart items
export type CartItem = CourseData | InvestmentPortfolioItem;

// Type guard functions
export const isCourse = (item: CartItem): item is CourseData => {
  return "subject" in item;
};

export const isPortfolio = (item: CartItem): item is InvestmentPortfolioItem => {
  return "type" in item && item.type === "portfolio";
};

interface CartStore {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (item) => {
        const items = get().items;
        const exists = items.find((existingItem) => existingItem.id === item.id);
        if (!exists) {
          set({ items: [...items, item] });
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
