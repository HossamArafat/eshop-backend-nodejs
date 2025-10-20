import mongoose from "mongoose";

// Create schema
const couponSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Coupn name is required"],
      unique: [true, "Coupon must be unique."],
    },
    discount: {
      type: Number,
      required: [true, "Coupon must have a discout value"],
      min: [0.1, "Discount precentage must be above OR equal 0.1"],
      max: [100, "Discount precentage must be below or equal 100"],
    },
    expire: {
      type: Date,
      required: [true, "Coupon must have an expire date"],
    },
  },
  { timestampes: true }
);

// Create model
const couponModel = mongoose.model("coupon", couponSchema);

export default couponModel;
