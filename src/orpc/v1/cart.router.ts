import { clearCart } from "@/orpc/v1/cart/clear-cart.js";
import { getCart } from "@/orpc/v1/cart/get-cart.js";
import { postCart } from "@/orpc/v1/cart/post-cart.js";
import { removeItem } from "@/orpc/v1/cart/remove-Item.js";

export const cartRouter = {
  getCart,
  clearCart,
  add: postCart,
  removeItem,
};
