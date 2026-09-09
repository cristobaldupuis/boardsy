import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  qty: number;
  priceCents: number;
  title: string;
  colorway: string;
  preset: string;
  preview?: string;
  spaces?: string[];
  stations?: string[];
  utilities?: string[];
  photos: number;
};

type CartState = {
  items: CartItem[];
  add: (item: Omit<CartItem, "id">) => void;
  remove: (id: string) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (item) =>
        set((s) => ({
          items: [...s.items, { ...item, id: crypto.randomUUID() }],
        })),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [] }),
    }),
    { name: "boardsy-cart" },
  ),
);

export function cartCount(items: CartItem[]) {
  return items.reduce((n, i) => n + i.qty, 0);
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((n, i) => n + i.priceCents, 0);
}
