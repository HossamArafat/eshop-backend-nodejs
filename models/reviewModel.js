import mongoose from "mongoose";
import setPopulate from "../middlewares/mongoose-middlware/setPopulateMiddleware.js";
import calcAvgRatingsAndQty from "../middlewares/mongoose-middlware/calcRatingsMiddlware.js";

// Create schema
const reviewSchema = mongoose.Schema(
  {
    comment: String,
    rating: {
      type: Number,
      min: [1, "Rating must be above or equal 1.0"],
      max: [5, "Rating must be below or equal 5.0"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: ["Review must belong to user"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "product",
      required: ["Review must belong to product"],
    },
  },
  { timestampes: true }
);

// setPopulate
setPopulate(reviewSchema, "user")

// Calc ratings
calcAvgRatingsAndQty(reviewSchema)

// Create model
const reviewModel = mongoose.model('review', reviewSchema)

export default reviewModel