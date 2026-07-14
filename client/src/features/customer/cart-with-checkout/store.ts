import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, CartProduct } from "./types";
import type { Product } from "../collections/types";

type CartAndCheckoutStoreType = {
  isOpen: boolean;
  setOpen: (value: boolean) => void;

  cart: CartItem[];

  onAdd: (
    product: Product,
    quantity: number,
    color?: string,
    size?: "S" | "M" | "L" | "XL",
  ) => void;

  onRemove: (
    productId: string,
    color?: string,
    size?: "S" | "M" | "L" | "XL",
  ) => void;

  onChangeQuantity: (
    productId: string,
    quantity: number,
    color?: string,
    size?: "S" | "M" | "L" | "XL",
  ) => void;

  clearCart: () => void;

  AppliedPromo: string;
  setAppliedPromo: (value: string) => void;
  getCartQuantity: () => number;
};

export const useCartAndCheckoutStore = create<CartAndCheckoutStoreType>()(
  persist(
    (set,get) => ({
      isOpen: false,

      setOpen: (value) =>
        set({
          isOpen: value,
        }),

      cart: [],

      onAdd: (product, quantity, color, size) =>
        set((state) => {
          const exists = state.cart.some(
            (item) =>
              item.id === product._id &&
              item.color === color &&
              item.size === size,
          );

          if (exists) return state;

          const defaultImage = product.images.find((image) => image.isCover);

          const finalPrice = product.salesPercentage
            ? product.price - (product.price * product.salesPercentage) / 100
            : product.price;

          const productPreview: CartProduct = {
            id: product._id,
            title: product.title,
            Category: product.category.name,
            brand: product.brand,
            image: defaultImage?.url ?? product.images[0]?.url ?? "",
            price: finalPrice,
          };

          return {
            cart: [
              ...state.cart,
              {
                ...productPreview,
                quantity,
                color,
                size,
              },
            ],
          };
        }),

      onRemove: (productId, color, size) =>
        set((state) => ({
          cart: state.cart.filter(
            (item) =>
              !(
                item.id === productId &&
                item.color === color &&
                item.size === size
              ),
          ),
        })),

      onChangeQuantity: (productId, quantity, color, size) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === productId && item.color === color && item.size === size
              ? {
                  ...item,
                  quantity,
                }
              : item,
          ),
        })),

      clearCart: () =>
        set({
          cart: [],
        }),

      AppliedPromo: "",

      setAppliedPromo: (value) =>
        set({
          AppliedPromo: value,
        }),
      getCartQuantity: () =>
        get().cart.reduce((total, item) => total + item.quantity, 0),
    }),

    {
      name: "guest-cart",
      partialize: (state) => ({
        cart: state.cart,
      }),
    },
  ),
);
