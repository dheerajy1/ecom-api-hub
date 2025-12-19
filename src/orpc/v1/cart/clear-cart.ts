import { withAuth } from "@/middleware/context.js";
import Cart from "@/models/cart.js";
import { ClearCartInputSchema, ClearCartResponseSchema } from "@/types/index.js";

/**
 * POST /api/v1/user/cart/clearCart
 *
 * Clears all items from authenticated user's cart
 */
export const clearCart = withAuth
    .route({
        method: "POST",
        path: "/api/v1/user/cart/clearCart",
        summary: "Clear cart",
        description: "Clears all items from the authenticated user's cart",
        inputStructure: "detailed",
    })
    .input(ClearCartInputSchema)
    .output(ClearCartResponseSchema)
    .handler(async ({ context }) => {
        const userId = Number(context.user.id);

        await Cart.updateOne(
            { userId },
            {
                $set: {
                    products: [],
                    total: 0,
                    discountedTotal: 0,
                    totalProducts: 0,
                    totalQuantity: 0,
                },
            }
        );

        return {
            success: true,
            statusCode: 200,
            message: "Cart cleared",
        };
    });
