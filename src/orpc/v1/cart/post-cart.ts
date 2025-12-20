import { withAuth } from "../../../middleware/context.js";
import Cart from "../../../models/cart.js";
import {
  CartItem,
  PostCartInputSchema,
  PostCartResponseSchema
} from "../../../types/index.js";
import { ORPCError } from "@orpc/server";

/**
 * POST /api/v1/user/cart/add
 *
 * Add a product to authenticated user's cart
 */
export const postCart = withAuth
    .route({
        method: "POST",
        path: "/api/v1/user/cart/add",
        summary: "Add product to cart",
        description: "Add a product to the authenticated user's cart",
        inputStructure: "detailed",
    })
    .input(PostCartInputSchema)
    .output(PostCartResponseSchema)
    .handler(async ({ input, context }) => {
        const userId = Number(context.user.id);
        const { productId, quantity } = input.body;

        // 1. Fetch product
        const prodRes = await fetch(
            `https://dummyjson.com/products/${productId}?select=title,price,discountPercentage,thumbnail`
        );

        if (!prodRes.ok) {
            throw new ORPCError("NOT_FOUND", {
                message: "Product not found",
            });
        }

        const product = await prodRes.json();

        const lineTotal = Number((product.price * quantity).toFixed(2));
        const discountedLineTotal = Number(
            (lineTotal * (1 - (product.discountPercentage || 0) / 100)).toFixed(2)
        );

        const cartProduct: CartItem = {
            id: product.id,
            title: product.title,
            price: product.price,
            quantity,
            total: lineTotal,
            discountPercentage: product.discountPercentage || 0,
            discountedTotal: discountedLineTotal,
            thumbnail: product.thumbnail,
        };

        // 2. Update if product already exists
        const updatedExisting = await Cart.findOneAndUpdate(
            { userId, "products.id": productId },
            {
                $inc: {
                    "products.$.quantity": quantity,
                    "products.$.total": lineTotal,
                    "products.$.discountedTotal": discountedLineTotal,
                    totalQuantity: quantity,
                    total: lineTotal,
                    discountedTotal: discountedLineTotal,
                },
            },
            { new: true }
        );

        if (updatedExisting) {
            return {
                success: true,
                statusCode: 200,
                message: "Product added to cart and quantity updated",
                data: {
                    cart: updatedExisting,
                },
            };
        }

        // 3. Push new product
        const updatedNew = await Cart.findOneAndUpdate(
            { userId },
            {
                $push: { products: cartProduct },
                $inc: {
                    totalQuantity: quantity,
                    totalProducts: 1,
                    total: lineTotal,
                    discountedTotal: discountedLineTotal,
                },
            },
            { new: true }
        );

        if (!updatedNew) {
            throw new ORPCError("NOT_FOUND", {
                message: "Cart not found!",
            });
        }

        return {
            success: true,
            statusCode: 200,
            message: "Product added to cart",
            data: {
                cart: updatedNew,
            },
        };
    });
