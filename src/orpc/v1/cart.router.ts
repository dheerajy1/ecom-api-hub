import { clearCart } from "./cart/clear-cart.js";
import { getCart } from "./cart/get-cart.js";
import { postCart } from "./cart/post-cart.js";
import { removeItem } from "./cart/remove-Item.js";

export const cartRouter = {
  getCart,
  clearCart,
  add: postCart,
  removeItem,
};
