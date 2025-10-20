import mongoose from "mongoose";

// create schema //for general settings in app
const settingSchema = mongoose.Schema(
 {
  taxPrice: {
      type: Number,
      default: 0
    },
    shippingPrice: {
      type: Number,
      default: 0
    },
 } 
)

// create model
const settingModel = mongoose.model("setting", settingSchema);

export default settingModel;
