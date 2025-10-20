import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/express-middleware/validatorMiddleware.js";
import userModel from "../../models/userModel.js";
import bcrypt from "bcrypt";

const userIdValidator = [
  check("id").isMongoId().withMessage("Invalid user id format."),
  validatorMiddleware,
];

const createUserValidator = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("Name required.")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Too short name."),
  check("email")
    .trim()
    .notEmpty()
    .withMessage("Email required.")
    .isEmail()
    .withMessage("Invalid email address.")
    .bail()
    .custom(async (value, { req }) => {
      const isExist = await userModel.findOne({ email: value });
      if (isExist)
        return Promise.reject({
          message: "Email already has been taken.",
          statusCode: 409,
        });
      return true;
    }),
  check("phone")
    .trim()
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number, only accepted EG and SA phone numbers"),
  check("password")
    .trim()
    .notEmpty()
    .withMessage("Password required")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters."),
  check("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage("Confirmation password is required")
    .bail()
    .custom((value, { req }) => {
      if (value != req.body.password)
        return Promise.reject({
          message: "Confirmation password is not matched with password.",
          statusCode: 422,
        });
      return true;
    }),

  validatorMiddleware,
];

const updateUserValidator = [
  check("name")
    .trim()
    .optional()
    .isLength({ min: 3 })
    .withMessage("Too short name."),
  check("email")
    .trim()
    .optional()
    .isEmail()
    .withMessage("Invalid email address."),
  check("phone")
    .trim()
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number, only accepted EG and SA phone numbers"),

  validatorMiddleware,
];

const changePassValidator = [
  check("currentPassword")
    .notEmpty()
    .withMessage("Current password is required."),
  check("confirmPassword")
    .notEmpty()
    .withMessage("Confirmation password is required."),
  check("password")
    .notEmpty()
    .withMessage("New password is required.")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters.")
    .bail()
    .custom(async (value, { req }) => {
      // 1- Verify user
      const filter = req.params.id ? req.params.id : req.user._id;
      const user = await userModel.findById(filter);
      if (!user)
        return Promise.reject({
          message: `There is no user for this id: ${req.params.id}`,
          statusCode: 404,
        });

      // 2- Verify current password
      const isCorrectPass = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPass)
        return Promise.reject({
          message: "Incorrect current password.",
          statusCode: 401,
        });

      // 3- Verify confirmation password
      if (value != req.body.confirmPassword)
        return Promise.reject({
          message: "Confirmation password is not matched with new password.",
          statusCode: 422,
        });

      return true;
    }),
  validatorMiddleware,
];

const addToWshlistValidator = [
  check("productId").custom((value, { req }) =>
    userModel
      .findOne({ _id: req.user._id, likedProducts: value })
      .then((product) => {
        if (product)
          return Promise.reject(
            "This product already in your wishlist."
          );
      })
  ),

  validatorMiddleware
];

const orderValidator = [
  check("shippingAddress.phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number required")
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number, only accepted EG and SA phone numbers"),

  validatorMiddleware
]

export {
  userIdValidator,
  updateUserValidator,
  createUserValidator,
  changePassValidator,
  addToWshlistValidator,
  orderValidator
};
