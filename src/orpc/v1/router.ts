import { authRouter } from "./auth.router.js";
import { cartRouter } from "./cart.router.js";

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
