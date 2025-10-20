import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/express-middleware/validatorMiddleware.js";
import productModel from "../../models/productModel.js";
import userModel from "../../models/userModel.js";
import reviewModel from "../../models/reviewModel.js";

const reviewIdValidator = [
  check("id").isMongoId().withMessage("Invalid review id format."),
  validatorMiddleware,
];

const createReviewValidator = [
  check("rating")
    .optional()
    .isNumeric()
    .withMessage("Rating  must be a number.")
    .bail()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1.0 and 5.0"),
  check("user")
    .notEmpty()
    .withMessage("Review must belong to user.")
    .bail()
    .isMongoId()
    .withMessage("Invalid user id format.")
    .bail()
    .custom((value) =>
      userModel.findById(value).then((user) => {
        if (!user)
          return Promise.reject({
            message: `No user for this id: ${value}`,
            statusCode: 404,
          });
      })
    ),
  check("product")
    .notEmpty()
    .withMessage("Review must belong to product.")
    .bail()
    .isMongoId()
    .withMessage("Invalid product id format.")
    .bail()
    .custom((value, { req }) => {
      return Promise.all([
        // Check product
        productModel.findById(value).then((product) => {
          if (!product)
            return Promise.reject({
              message: `No product for this id: ${value}`,
              statusCode: 404,
            });
        }),
        // Check review
        reviewModel
          .findOne({ product: value, user: req.body.user })
          .then((review) => {
            if (review)
              return Promise.reject({
                message: "You already created a review before.",
                statusCode: 409,
              });
          }),
      ]);
    }),

  validatorMiddleware,
];

const updateReviewValidator = [
  check("rating")
    .optional()
    .isNumeric()
    .withMessage("Rating  must be a number.")
    .bail()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1.0 and 5.0"),
  check("id")
    .isMongoId()
    .withMessage("Invalid review id format.")
    .bail()
    .custom((value, { req }) =>
      reviewModel.findById(value).then((review) => {
        // Check review presence
        if (!review)
          return Promise.reject({
            message: `No review for this id: ${value}`,
            statusCode: 404,
          });
        // Check review ownership
        const condition = req.user._id.toString() == review.user._id.toString();
        if (!condition)
          return Promise.reject({
            message: "You are not allowed to edit this review.",
            statusCode: 403,
          });
      })
    ),

  validatorMiddleware,
];
const deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid review id format.")
    .bail()
    .custom((value, { req }) =>
      reviewModel.findById(value).then((review) => {
        // Check review presence
        if (!review)
          return Promise.reject({
            message: `No review for this id: ${value}`,
            statusCode: 404,
          });

        // Check review ownership of user, admin, or manager
        return userModel.findById(review.user._id).then((user) => {
          const condition =
            req.user._id.toString() == user._id.toString() ||
            ["admin", "manager"].includes(req.user.role);
          if (!condition)
            return Promise.reject({
              message: "You are not allowed to delete this review.",
              statusCode: 403,
            });
        });
      })
    ),

  validatorMiddleware,
];

export {
  reviewIdValidator,
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
};
