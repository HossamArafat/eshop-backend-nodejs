import mongoose from "mongoose";
import setImageURL from "../middlewares/mongoose-middlware/setImgURLMiddleware.js";

// create schema
const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required."],
      unique: [true, "Category must be unique."],
      minlength: [3, "Too short category name."],
      maxlength: [32, "Too long category name."],
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
setImageURL(categorySchema, "categories");

// create model
const categoryModel = mongoose.model("category", categorySchema);

export default categoryModel;
