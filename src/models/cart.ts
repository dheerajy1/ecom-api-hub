import { Schema, model } from "mongoose";

const CartItemSchema = new Schema(
  {
    id: { type: Number, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    total: { type: Number, required: true },
    discountPercentage: { type: Number, required: true },
    discountedTotal: { type: Number, required: true },
    thumbnail: { type: String, required: true },
  },
  { _id: false } // prevents Mongo auto _id for each product
);

const CartSchema = new Schema(
  {
    userId: { type: Number, required: true, unique: true },

    products: {
      type: [CartItemSchema],
      default: [],
    },

    total: { type: Number, default: 0 },
    discountedTotal: { type: Number, default: 0 },
    totalProducts: { type: Number, default: 0 },
    totalQuantity: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default model("Cart", CartSchema);
