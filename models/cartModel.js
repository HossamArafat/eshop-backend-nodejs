import mongoose from "mongoose";
import calcTotalCartPrice from "../middlewares/mongoose-middlware/calcTotalPriceMiddleware.js";

const cartSchema = mongoose.Schema(
  {
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "product",
        },
        color: String,
        price: Number,
        quantity: { type: Number, default: 1 },
      },
    ],
    totalCartPrice: Number,
    totalCartPriceAfterDiscount: Number,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

// Calc price
calcTotalCartPrice(cartSchema)

const cartModel = mongoose.model("cart", cartSchema);

export default cartModel;