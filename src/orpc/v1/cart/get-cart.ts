import { withAuth } from "@/middleware/context.js";
import Cart from "@/models/cart.js";
import { GetCartInputSchema, GetCartResponseSchema } from "@/types/index.js";
import { ORPCError } from "@orpc/server";

/**
 * GET /api/v1/user/cart
 *
 * - Same path as existing API
 * - Auth handled by oRPC middleware
 * - OpenAPI generated automatically
 */
export const getCart = withAuth
  .route({
    method: "GET",
    path: "/api/v1/user/cart",
    summary: "Fetch authenticated user's cart",
    description: "Fetches the authenticated user's cart from MongoDB",
    inputStructure: "detailed",
  })
  .input(GetCartInputSchema)
  .output(GetCartResponseSchema)
  .handler(async ({ context }) => {
    const userId = Number(context.user.id);

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      throw new ORPCError("NOT_FOUND", {
        message: "Cart not found!",
      });
    }

    const totalProducts = cart.products.length;

    return {
      success: true,
      statusCode: 200,
      message: "Cart retrieved successfully!",
      data: {
        cart,
        total: totalProducts,
        skip: 0,
        limit: 30,
      },
    };
  });
