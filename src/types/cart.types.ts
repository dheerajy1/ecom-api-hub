import { withAuthHeadersSchema } from "@/types/auth.types.js";
import { z } from "zod";

export const CartItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  quantity: z.number(),
  total: z.number(),
  discountPercentage: z.number(),
  discountedTotal: z.number(),
  thumbnail: z.string(),
});

export type CartItem = z.infer<typeof CartItemSchema>;

export const CartSchema = z.object({
  userId: z.number(),
  products: z.array(CartItemSchema),
  total: z.number(),
  discountedTotal: z.number(),
  totalProducts: z.number(),
  totalQuantity: z.number(),
});

// =========================
// GET CART REQUEST
// =========================

export const GetCartInputSchema = z.object({
  headers: withAuthHeadersSchema,
  // body: ,
})

export const GetCartResponseSchema = z.object({
  success: z.literal(true),
  statusCode: z.literal(200),
  message: z.string(),
  data: z.object({
    cart: CartSchema,
    total: z.number(),
    skip: z.number(),
    limit: z.number(),
  }),
});

export type GetCartResponse = z.infer<typeof GetCartResponseSchema>;

// =========================
// POST CART REQUEST
// =========================

export const PostCartRequestSchema = z.object({
  productId: z.number().int(),
  quantity: z.number().int().min(1).default(1),
});

export type PostCartRequest = z.infer<typeof PostCartRequestSchema>;

export const PostCartInputSchema = z.object({
  headers: withAuthHeadersSchema,
  body: PostCartRequestSchema,
})

// =========================
// POST CART RESPONSE
// =========================
export const PostCartResponseSchema = z.object({
  success: z.literal(true),
  statusCode: z.literal(200),
  message: z.string(),
  data: z.object({
    cart: CartSchema,
  }),
});

export type PostCartResponse = z.infer<typeof PostCartResponseSchema>;

// =========================
// REMOVE ITEM REQUEST
// =========================
export const RemoveItemRequestSchema = z.object({
  productId: z.number().int(),
});

export type RemoveItemRequest = z.infer<typeof RemoveItemRequestSchema>;

export const RemoveItemInputSchema = z.object({
  headers: withAuthHeadersSchema,
  body: RemoveItemRequestSchema,
})

// =========================
// REMOVE ITEM RESPONSE
// =========================
export const RemoveItemResponseSchema = z.object({
  success: z.literal(true),
  statusCode: z.literal(200),
  message: z.string(),
});

export type RemoveItemResponse = z.infer<typeof RemoveItemResponseSchema>;

// =========================
// CLEAR CART RESPONSE
// =========================

export const ClearCartInputSchema = z.object({
  headers: withAuthHeadersSchema,
  // body: ,
})

export const ClearCartResponseSchema = z.object({
  success: z.literal(true),
  statusCode: z.number(),
  message: z.string(),
});

export type ClearCartResponse = z.infer<typeof ClearCartResponseSchema>;


// =========================
// CART ERROR RESPONSE 
// =========================
export const CartErrorResponseSchema = z.object({
  success: z.literal(false),
  statusCode: z.number(),
  error: z.string(),
});

export type CartErrorResponse = z.infer<typeof CartErrorResponseSchema>;
