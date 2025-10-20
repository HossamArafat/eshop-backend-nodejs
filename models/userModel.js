import mongoose from "mongoose";
import setImageURL from "../middlewares/mongoose-middlware/setImgURLMiddleware.js";
import setHashPass from "../middlewares/mongoose-middlware/setHashPassMiddleware.js";
// create schema
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name required."],
      minlength: [3, "Too short name."],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Eamil required."],
      unique: [true, "Email must be unique."],
      lowercase: true,
    },
    phone: String,
    password: {
      type: String,
      required: [true, "Password required."],
      minlength: [6, "Too short password."],
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpired: Date,
    passwordResetVerified: Boolean,
    profileImg: String,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    likedProducts: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'product'
      } 
    ],
    addresses: [
      {
        alias: String,
        details: String,
        city: String,
        postalCode: String,
        phone: String
      }
    ]
  },
  { timestamps: true }
);

// set image
setImageURL(userSchema, "users");

// set bcrypt
setHashPass(userSchema)

// create model
const userModel = mongoose.model("user", userSchema);

export default userModel;
