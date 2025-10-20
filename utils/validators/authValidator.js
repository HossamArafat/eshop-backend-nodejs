import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/express-middleware/validatorMiddleware.js";
import userModel from "../../models/userModel.js";

const signupValidator = [
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

const loginValidator = [
  check("email")
    .trim()
    .notEmpty()
    .withMessage("Email required.")
    .isEmail()
    .withMessage("Invalid email address."),
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

const forgotPassValidator = [
  check("email")
    .trim()
    .notEmpty()
    .withMessage("Email required.")
    .isEmail()
    .withMessage("Invalid email address."),

  validatorMiddleware,
];

const resetPassValidator = [
  check("newPassword")
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
      if (value != req.body.newPassword)
        return Promise.reject({
          message: "Confirmation password is not matched with password.",
          statusCode: 422,
        });
      return true;
    }),

  validatorMiddleware,
];

export { signupValidator, loginValidator, forgotPassValidator, resetPassValidator };
