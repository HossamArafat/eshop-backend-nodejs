import mongoose from "mongoose";
// import setImageURL from "../middlewares/mongoose-middlware/setImgURLMiddleware.js";

// Create schema
const subCategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Sub category name is required."],
      unique: [true, "Sub category must be unique."],
      minlength: [2, "Too short sub category name."],
      maxlength: [32, "Too long sub category name."],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      required: [true, "Sub category must belong to category."],
      ref: "category",
    },
    image: String,
  },
  { timestamps: true }
);

// setImageURL(subCategorySchema, "subCategories");

// Create model
const subCategoryModel = mongoose.model("subCategory", subCategorySchema);

export default subCategoryModel;
