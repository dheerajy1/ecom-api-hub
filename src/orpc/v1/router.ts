import { authRouter } from "@/orpc/v1/auth.router.js";
import { cartRouter } from "@/orpc/v1/cart.router.js";

/**
 * v1 oRPC router
 *
 * This is a plain object.
 * oRPC uses object shape to infer routes → OpenAPI.
 */
export const v1Router = {
    auth: authRouter,
    user: {
        cart: cartRouter,
    },
};
