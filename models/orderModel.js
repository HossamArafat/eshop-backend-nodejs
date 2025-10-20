import mongoose from "mongoose";
import setPopulate from "../middlewares/mongoose-middlware/setPopulateMiddleware.js";

// create schema
const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "product",
        },
        color: String,
        price: Number,
        quantity: Number,
      },
    ],
    cartPrice: Number,
    taxPrice: Number,
    shippingPrice: Number,
    totalOrderPrice: Number,
    shippingAddress: {
        alias: String,
        details: String,
        city: String,
        postalCode: String,
        phone: String
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'cash'],
      default: 'cash'
    },
    isPaid: {
      type: Boolean,
      default: false
    },
    paidAt: Date,
    isDelivered: {
      type: Boolean,
      default: false
    },
    deliveredAt: Date,
  },
  { timestamps: true }
);

// set populate
setPopulate(orderSchema, "user", "name profileImg email phone")
setPopulate(orderSchema, "cartItems.product", "title imageCover")

// create model
const orderModel = mongoose.model("order", orderSchema);

export default orderModel;
