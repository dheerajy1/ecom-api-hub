import { withAuth } from "@/middleware/context.js";
import Cart from "@/models/cart.js";
import {
    RemoveItemInputSchema,
    RemoveItemResponseSchema
} from "@/types/index.js";
import { ORPCError } from "@orpc/server";

/**
 * POST /api/v1/user/cart/removeItem
 *
 * Remove a product from authenticated user's cart
 */
export const removeItem = withAuth
    .route({
        method: "POST",
        path: "/api/v1/user/cart/removeItem",
        summary: "Remove item from cart",
        description: "Remove a product from the authenticated user's cart",
        inputStructure: "detailed",
    })
    .input(RemoveItemInputSchema)
    .output(RemoveItemResponseSchema)
    .handler(async ({ input, context }) => {
        const userId = Number(context.user.id);
        const { productId } = input.body;

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            throw new ORPCError("NOT_FOUND", {
                message: "Cart not found",
            });
        }

        const product = cart.products.find(p => p.id === productId);

        if (!product) {
            throw new ORPCError("NOT_FOUND", {
                message: "Product not in cart",
            });
        }

        await Cart.updateOne(
            { userId },
            {
                $pull: { products: { id: productId } },
                $inc: {
                    totalQuantity: -product.quantity,
                    totalProducts: -1,
                    total: -product.total,
                    discountedTotal: -product.discountedTotal,
                },
            }
        );

        return {
            success: true,
            statusCode: 200,
            message: "Item removed",
        };
    });
