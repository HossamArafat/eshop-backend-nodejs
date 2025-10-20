import mongoose, { Schema } from "mongoose";
import setImageURL from "../middlewares/mongoose-middlware/setImgURLMiddleware.js";
import setPopulate from "../middlewares/mongoose-middlware/setPopulateMiddleware.js";

// create schema
const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required."],
      minlength: [3, "Too short product title."],
      maxlength: [100, "Too long product title."],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required."],
      minlength: [20, "Too short product description."],
      maxlength: [2000, "Too long product description."],
    },
    quantity: {
      type: Number,
      default: 1,
      min: [1, "Invalid quantity."],
    },
    sold: {
      type: Number,
      default: 0,
      min: [0, "Sold quantity cannot be negative."],
    },
    price: {
      type: Number,
      required: [true, "Product price is required."],
      min: [0, "Product price cannot be negative."],
      max: [1000000, "Too long product price."],
    },
    priceAfterDiscount: {
      type: Number,
      min: [0, "Price after discount cannot be negative."],
    },
    colors: [String],
    images: [String],
    imageCover: {
      type: String,
      required: [true, "Product image cover is required."],
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating average must be above or equal 1.0"],
      max: [5, "Rating average must be below or equal 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      min: [0, "Rating quantity cannot be negative."],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "category",
      required: [true, "Product must belong to category."],
    },
    subCategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "subCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "brand",
    },
  },
  { timestamps: true, toJSON: {virtuals: true}, toObject: {virtuals: true} }
);

// virtual populate
productSchema.virtual('reviews', {
  ref: 'review',
  foreignField: 'product',
  localField: '_id'
})

productSchema.pre('findOne', function(next) {
  this.populate({ path: 'reviews' });
  next()
});

// setPopulate
setPopulate(productSchema, "category")

// set images
setImageURL(productSchema, "products")

// create model
const productModel = mongoose.model("product", productSchema);

export default productModel;
