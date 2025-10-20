import mongoose from "mongoose";
import setImageURL from "../middlewares/mongoose-middlware/setImgURLMiddleware.js";
// create schema
const brandSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required."],
      unique: [true, "Brand must be unique."],
      minlength: [3, "Too short brand name."],
      maxlength: [32, "Too long brand name."],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

// set image
setImageURL(brandSchema, "brands")

const brandModel = mongoose.model("brand", brandSchema);

export default brandModel;
