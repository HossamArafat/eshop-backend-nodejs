import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/express-middleware/validatorMiddleware.js";
import categoryModel from "../../models/categoryModel.js";
import subCategoryModel from "../../models/subCategoryModel.js";

// .isLength({ min: 2 }) => for strings and arrays only
// .isFloat({ min: 2 }) => for numbers
const subCategoryIdValidator = [
  check("id").isMongoId().withMessage("Invalid sub category id format."),
  validatorMiddleware,
];

const subCategoryBodyValidator = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("Sub category name is required.")
    .bail()
    .custom(async (value, { req }) => {
      const filter = { name: value };
      if (req.method == "PUT") filter._id = { $ne: req.params.id };
      const doc = await subCategoryModel.findOne(filter);
      if (doc) {
        return Promise.reject({message: "Sub category name must be unique.", statusCode: 409});
      }
    })
    .isLength({ min: 2 })
    .withMessage("Too short sub category name.")
    .isLength({ max: 32 })
    .withMessage("Too long sub category name."),
  check("category")
    .notEmpty()
    .withMessage("Sub category must belong to category.")
    .bail()
    .isMongoId()
    .withMessage("Invalid category id format.")
    .bail()
    .custom((value) =>
      categoryModel.findById(value).then((category) => {
        if (!category)
          return Promise.reject({message: `No category for this id: ${value}`, statusCode: 404});
      })
    ),

  validatorMiddleware,
];

export { subCategoryIdValidator, subCategoryBodyValidator };
